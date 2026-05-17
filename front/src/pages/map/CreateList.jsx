import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapContainer, useMapEvents, Circle } from "react-leaflet";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../layouts/Navbar";
import Toast from "../../components/Toast";
import {
  getPois,
  getCategorias,
  getUsuarioListas,
  getNodos,
  createLista,
  updateLista,
  uploadListaImage,
  createPoi,
  updatePoi,
  deletePoi,
  getListas,
  deleteNode,
} from "../../services/communicationManager";
import MapLayers from "../../components/MapLayers";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapEvents = ({ onMapClick, setCurrentZoom }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
    zoomend: (e) => setCurrentZoom(e.target.getZoom()),
  });
  return null;
};

const CreateList = () => {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const initialCenter = [41.3864, 2.1058];
  const location = useLocation();
  const [currentUserId, setCurrentUserId] = useState(null);

  // State
  const [pois, setPois] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allNodes, setAllNodes] = useState([]);
  const [selectedPoisForList, setSelectedPoisForList] = useState([]);
  const [listName, setListName] = useState("");
  const [listDesc, setListDesc] = useState("");
  const [activePoiIndex, setActivePoiIndex] = useState(null);
  const [listVisibility, setListVisibility] = useState("private");
  const [joinedRoute, setJoinedRoute] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  const [otherLists, setOtherLists] = useState([]);
  const [otherListGeometries, setOtherListGeometries] = useState({});
  const [focusedListId, setFocusedListId] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [hasInitialCentered, setHasInitialCentered] = useState(false);
  const [hasInitialFitBounds, setHasInitialFitBounds] = useState(false);

  const [editingListId, setEditingListId] = useState(null);
  const [showOtherLists, setShowOtherLists] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(17);
  const [listImage, setListImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSheetMinimized, setIsSheetMinimized] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [toast, setToast] = useState(null);
  const [isProcessingList, setIsProcessingList] = useState(false);
  const [routeProfile, setRouteProfile] = useState("foot");

  // Ref para tener acceso inmediato al estado dentro de eventos de Leaflet
  const selectedPoisRef = useRef([]);
  useEffect(() => {
    selectedPoisRef.current = selectedPoisForList;
  }, [selectedPoisForList]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem("usuario");
        let userId = null;
        if (userStr) {
          const userObj = JSON.parse(userStr);
          userId = userObj.id_usuario;
          setCurrentUserId(userId);
          console.log("DEBUG CreateList: userId detectado:", userId);
        } else {
          console.warn(
            "DEBUG CreateList: No hay usuario logueado en localStorage",
          );
        }

        const [poiRes, catRes, nodeRes, listRes] = await Promise.all([
          getPois(),
          getCategorias(),
          getNodos(),
          userId
            ? getUsuarioListas(userId)
            : Promise.resolve({ success: true, data: [] }),
        ]);

        console.log(
          "DEBUG CreateList: Listas recibidas:",
          listRes.data?.length || 0,
        );

        if (poiRes.success) setPois(poiRes.data);
        if (catRes.success) setCategories(catRes.data);
        if (nodeRes.success) setAllNodes(nodeRes.data);
        if (listRes.success) {
          let combinedLists = listRes.data || [];
          if (location.state?.editingList) {
            const extList = location.state.editingList;
            if (!combinedLists.find((l) => l.id_lista === extList.id_lista)) {
              combinedLists = [extList, ...combinedLists];
            }
          }
          setOtherLists(combinedLists);
          console.log(
            "DEBUG CreateList: otherLists actualizado con",
            combinedLists.length,
            "listas",
          );

          // Sequential fetch to avoid 429 Too Many Requests
          const loadRoutes = async () => {
            for (const list of combinedLists) {
              if (list.pois && list.pois.length >= 2) {
                try {
                  const coords = list.pois
                    .map((p) => `${p.longitud},${p.latitud}`)
                    .join(";");
                  const url = routeProfile === "foot" 
                    ? `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${coords}?overview=full&geometries=geojson`
                    : `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
                  const res = await fetch(url);
                  if (res.status === 429) {
                    console.warn("OSM Rate limit reached (429), stopping preload.");
                    break;
                  }
                  if (!res.ok) throw new Error(`HTTP ${res.status}`);
                  const data = await res.json();
                  if (data.code === "Ok") {
                    const route = data.routes[0];
                    const geom = route.geometry.coordinates.map((c) => [
                      c[1],
                      c[0],
                    ]);
                    setOtherListGeometries((prev) => ({
                      ...prev,
                      [list.id_lista]: {
                        geom,
                        distance: route.distance,
                        waypoints: route.legs.map((leg) => leg.distance),
                      },
                    }));
                  }
                  // Small delay to respect public API limits
                  await new Promise(r => setTimeout(r, 250));
                } catch (e) {
                  console.warn("Error precargando ruta:", e.message || e);
                }
              }
            }
          };
          loadRoutes();
        }
      } catch (err) {
        console.error("Error in fetchData:", err);
      }
    };
    fetchData();

    // Real-time user position tracking
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newPos = [pos.coords.latitude, pos.coords.longitude];
          setUserPosition(newPos);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    if (location.state?.editingList) {
      const list = location.state.editingList;
      const userStr = localStorage.getItem("usuario");
      const currentId = userStr ? JSON.parse(userStr).id_usuario : null;

      if (list.id_usuario === currentId) {
        // Own list: regular edit
        setSelectedPoisForList(list.pois || []);
        setListName(list.nombre || "");
        setListDesc(list.descripcion || "");
        setListVisibility(list.visibilidad || "public");
        setEditingListId(list.id_lista);
      } else {
        // External list: Template mode
        setSelectedPoisForList(list.pois || []);
        setListName(`Copia de ${list.nombre}`);
        setListDesc(list.descripcion || "");
        setEditingListId(null); // Clear ID to force creation of a NEW list
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (mapRef.current && location.state?.editingList && selectedPoisForList.length > 0 && !hasInitialFitBounds) {
      const bounds = L.latLngBounds(
        selectedPoisForList.map((p) => [parseFloat(p.latitud), parseFloat(p.longitud)])
      );
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        setHasInitialFitBounds(true);
      }
    } else if (mapRef.current && userPosition && !hasInitialCentered && !location.state?.editingList) {
      mapRef.current.flyTo(userPosition, 17, { animate: true, duration: 1.5 });
      setHasInitialCentered(true);
    }
  }, [selectedPoisForList, userPosition, hasInitialCentered, hasInitialFitBounds, location.state?.editingList]);

  const handleSelectPoi = (poi) => {
    const existingIndex = selectedPoisForList.findIndex(
      (p) => p.id_poi === poi.id_poi,
    );
    if (existingIndex === -1) {
      // Si no está en el itinerario, lo añadimos y AUTO-OPTIMIZAMOS el orden
      const newSelected = [...selectedPoisForList, poi];
      
      if (newSelected.length >= 3) {
        // Auto-optimizar con el algoritmo del vecino más cercano (Nearest Neighbor)
        const points = [...newSelected];
        const optimized = [points.shift()]; // Mantener el primero como inicio
        
        while (points.length > 0) {
          const last = optimized[optimized.length - 1];
          let nearestIdx = 0;
          let minDist = L.latLng(parseFloat(last.latitud), parseFloat(last.longitud))
            .distanceTo(L.latLng(parseFloat(points[0].latitud), parseFloat(points[0].longitud)));
            
          for (let i = 1; i < points.length; i++) {
            const d = L.latLng(parseFloat(last.latitud), parseFloat(last.longitud))
              .distanceTo(L.latLng(parseFloat(points[i].latitud), parseFloat(points[i].longitud)));
            if (d < minDist) {
              minDist = d;
              nearestIdx = i;
            }
          }
          optimized.push(points.splice(nearestIdx, 1)[0]);
        }
        setSelectedPoisForList(optimized);
        setActivePoiIndex(optimized.length - 1);
      } else {
        setSelectedPoisForList(newSelected);
        setActivePoiIndex(newSelected.length - 1);
      }
    } else {
      // Si ya está, lo quitamos del itinerario para "desunirlo"
      setSelectedPoisForList((prev) =>
        prev.filter((p) => p.id_poi !== poi.id_poi),
      );
      setActivePoiIndex(null);
    }
  };

  const handleMarkNodeAsPoi = (node) => {
    const tempId = `temp-node-${Date.now()}`;

    // Solo añadimos al "pool" de puntos disponibles en el mapa
    const newPoi = {
      id_poi: tempId,
      nombre: t("createList.defaultNodePoiName", "POI Nodo {{id}}", { id: node.id_nodo }),
      latitud: node.latitud,
      longitud: node.longitud,
      id_categoria: categories[0]?.id_categoria || 1,
      es_accesible: 1,
      id_nodo_acceso: node.id_nodo,
      isNew: true,
    };

    setPois((prev) => [...prev, newPoi]);
  };

  const handleMapClick = (latlng) => {
    const tempId = `temp-${Date.now()}`;

    const newPoi = {
      id_poi: tempId,
      nombre: t("createList.defaultPoiName", "Punto {{number}}", { number: pois.length + 1 }),
      latitud: latlng.lat,
      longitud: latlng.lng,
      id_categoria: categories[0]?.id_categoria || 1,
      es_accesible: 1,
      isNew: true,
    };

    // Añadimos a la lista general de puntos disponibles
    setPois((prev) => [...prev, newPoi]);
  };
  const handleAddPoiAtLocation = () => {
    if (!userPosition) {
      setToast({
        message:
          t("createList.locationError", "No s'ha pogut detectar la teva ubicació. Activa els permisos de geolocalització."),
        type: "warning",
      });
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const newPoi = {
      id_poi: tempId,
      nombre: t("createList.defaultLocationPoiName", "Punto en mi ubicación"),
      latitud: userPosition[0],
      longitud: userPosition[1],
      id_categoria: categories[0]?.id_categoria || 1,
      es_accesible: 1,
      isNew: true,
    };

    // Añadimos a la lista general de puntos disponibles Y lo seleccionamos para la ruta
    setPois((prev) => [...prev, newPoi]);
    setSelectedPoisForList((prev) => [...prev, newPoi]);
    setActivePoiIndex(selectedPoisForList.length);
  };

  const handleRemovePoi = async (index) => {
    const poiToRemove = selectedPoisForList[index];
    if (!poiToRemove) return;

    // --- ACTUALIZACIÓN INSTANTÁNEA ---
    setSelectedPoisForList((prev) => prev.filter((_, i) => i !== index));
    setPois((prev) => prev.filter((p) => p.id_poi !== poiToRemove.id_poi));

    if (activePoiIndex === index) setActivePoiIndex(null);
    else if (activePoiIndex > index) setActivePoiIndex(activePoiIndex - 1);

    // --- BORRADO REAL EN DB ---
    try {
      // 1. Borramos el POI
      await deletePoi(poiToRemove.id_poi);

      // 2. Borramos también su nodo de navegación asociado para que no queden residuos
      if (poiToRemove.id_nodo_acceso) {
        await deleteNode(poiToRemove.id_nodo_acceso).catch((err) => {
          console.warn(
            "El nodo no se pudo borrar (posiblemente sea un nodo compartido):",
            err,
          );
        });
        // Actualizamos la lista de nodos local para que desaparezca del mapa si la red está visible
        setAllNodes((prev) =>
          prev.filter((n) => n.id_nodo !== poiToRemove.id_nodo_acceso),
        );
      }
    } catch (err) {
      console.error("Error deleting POI from database:", err);
    }
  };

  const handleUpdatePoiDesc = async (index, newDesc) => {
    const updatedPois = [...selectedPoisForList];
    updatedPois[index].descripcion = newDesc;
    setSelectedPoisForList(updatedPois);

    try {
      await updatePoi(updatedPois[index].id_poi, {
        nombre: updatedPois[index].nombre,
        descripcion: newDesc,
      });
    } catch (err) {
      console.error("Error updating POI description:", err);
    }
  };

  const handleLocate = () => {
    if (userPosition && mapRef.current) {
      mapRef.current.flyTo(userPosition, 17, { animate: true, duration: 1.2 });
    } else {
      navigator.geolocation.getCurrentPosition((pos) => {
        const p = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(p);
        if (mapRef.current)
          mapRef.current.flyTo(p, 17, { animate: true, duration: 1.2 });
      });
    }
  };

  // Cálculo de ruta en tiempo real para la lista que se está creando
  useEffect(() => {
    const getLiveRoute = async () => {
      if (selectedPoisForList.length >= 2) {
        try {
          const coords = selectedPoisForList
            .map((p) => `${p.longitud},${p.latitud}`)
            .join(";");
          const url = routeProfile === "foot" 
            ? `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${coords}?overview=full&geometries=geojson`
            : `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          if (data.code === "Ok") {
            const geom = data.routes[0].geometry.coordinates.map((c) => [
              c[1],
              c[0],
            ]);
            setJoinedRoute(geom);
            setTotalDistance(data.routes[0].distance);
          } else {
            const fallbackGeom = selectedPoisForList.map((p) => [
              parseFloat(p.latitud),
              parseFloat(p.longitud),
            ]);
            setJoinedRoute(fallbackGeom);
            setTotalDistance(0);
            setToast({ message: "No se pudo calcular la ruta para este medio, uniendo puntos en línea recta.", type: "warning" });
          }
        } catch (e) {
          console.error("Error calculating live route:", e);
        }
      } else {
        setJoinedRoute(null);
        setTotalDistance(0);
      }
    };
    getLiveRoute();
  }, [selectedPoisForList, routeProfile]);

  const handleFocusList = (list) => {
    setFocusedListId(list.id_lista);
    if (list.pois && list.pois.length > 0) {
      const bounds = L.latLngBounds(
        list.pois.map((p) => [parseFloat(p.latitud), parseFloat(p.longitud)]),
      );
      if (mapRef.current)
        mapRef.current.fitBounds(bounds, { padding: [100, 100] });
    }
  };


  const handleSaveList = async () => {
    if (selectedPoisForList.length < 2) {
      setToast({
        message: t("createList.need2Points", "Selecciona almenys 2 punts per definir una ruta."),
        type: "warning",
      });
      return;
    }

    if (!listName) {
      setToast({
        message: t("createList.errorNoName", "Posa un nom a la ruta."),
        type: "warning",
      });
      return;
    }

    if (categories.length === 0) {
      setToast({
        message:
          t("createList.noCategoriesError", "Error: No hi ha categories a la base de dades. Contacta a l'administrador."),
        type: "error",
      });
      return;
    }

    try {
      const finalPois = [...selectedPoisForList];
      await _doSave(finalPois);
    } catch (err) {
      console.error("Error saving/updating list:", err);
      setToast({
        message: t("createList.saveError", "Error al desar la ruta. Intenta-ho de nou."),
        type: "error",
      });
    }
  };

  // Separated save logic so it can be called after the optimize confirm modal
  const _doSave = async (finalPois) => {
    if (isProcessingList) return;
    setIsProcessingList(true);
    try {
      // --- 2. Creación Real de POIs Temporales ---
      const poiIdsFinales = [];
      for (const poi of finalPois) {
        if (poi.isNew) {
          const resPoi = await createPoi({
            nombre: poi.nombre,
            latitud: poi.latitud,
            longitud: poi.longitud,
            id_categoria: poi.id_categoria || 1,
            es_accesible: poi.es_accesible ?? 1,
            // User-created points have no nav node — pass null to avoid FK violation
            id_nodo_acceso: null,
            visibilidad: "public",
          });
          if (resPoi.success) {
            poiIdsFinales.push(resPoi.data.id_poi);
          } else {
            throw new Error("Error al crear uno de los puntos intermedios");
          }
        } else {
          poiIdsFinales.push(poi.id_poi);
        }
      }

      // --- 3. Guardar la Lista ---
      const user = JSON.parse(localStorage.getItem("usuario"));
      if (!user) {
        setToast({
          message: t("createList.loginRequired", "Has d'iniciar sessió per crear llistes."),
          type: "error",
        });
        navigate("/login");
        return;
      }

      const savedUser = localStorage.getItem("usuario");
      const userId = savedUser ? JSON.parse(savedUser).id_usuario : 1;

      const listaData = {
        id_usuario: user.id_usuario,
        nombre: listName,
        descripcion: listDesc,
        visibilidad: listVisibility,
        pois: poiIdsFinales,
      };

      let res;
      if (editingListId) {
        res = await updateLista(editingListId, listaData);
      } else {
        res = await createLista(listaData);
      }

      if (res.success) {
        const listId = editingListId || res.data.id_lista;

        if (listImage) {
          try {
            await uploadListaImage(listId, listImage);
          } catch (imgErr) {
            console.error("Error subiendo la portada:", imgErr);
          }
        }

        setToast({
          message: editingListId
            ? t("createList.updatedSuccess", "Ruta actualitzada correctament!")
            : t("createList.createdSuccess", "Ruta creada i guardada!"),
          type: "success",
        });

        // Reset and navigate after a short delay so toast is visible
        setTimeout(() => {
          setSelectedPoisForList([]);
          setListName("");
          setListDesc("");
          setEditingListId(null);
          setImagePreview(null);
          setIsSheetMinimized(false);
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      console.error("Error saving/updating list:", err);
      setToast({
        message: t("createList.saveError", "Error al desar la ruta. Intenta-ho de nou."),
        type: "error",
      });
      setIsProcessingList(false);
    }
  };
  const focusedList = focusedListId ? otherLists.find(l => l.id_lista === focusedListId) : null;

  return (
    <div className="relative h-screen w-full bg-slate-950 text-white font-display overflow-hidden select-none md:pl-20">
      <div className="absolute inset-0 z-0">
        <MapContainer
          ref={mapRef}
          center={initialCenter}
          zoom={17}
          className="w-full h-full"
          zoomControl={false}
        >
          <MapEvents
            onMapClick={handleMapClick}
            setCurrentZoom={setCurrentZoom}
          />

          <MapLayers
            isSatelliteView={isSatelliteView}
            currentZoom={currentZoom}
            userLists={showOtherLists ? otherLists : []}
            focusedListId={focusedListId}
            handleFocusList={handleFocusList}
            otherListGeometries={otherListGeometries}
            generalMarkers={pois}
            selectedPoisForList={selectedPoisForList}
            joinedRoute={joinedRoute}
            onPoiClick={handleSelectPoi}
            activePoiIndex={activePoiIndex}
            setActivePoiIndex={setActivePoiIndex}
            userPosition={userPosition}
            currentUser={JSON.parse(localStorage.getItem("usuario") || "null")}
            t={t}
            routeProfile={routeProfile}
          />

          {/* Location Focus Circle */}
          {userPosition && (
            <Circle
              center={userPosition}
              radius={20}
              pathOptions={{
                fillColor: "#3b82f6",
                fillOpacity: 0.1,
                color: "#3b82f6",
                weight: 1,
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Floating Actions Stack (Mismo que en Map.jsx) */}
      <div className="fixed bottom-24 right-6 z-[110] pointer-events-auto flex flex-col gap-3">
        {/* ADD POI AT LOCATION BUTTON */}
        <button
          onClick={handleAddPoiAtLocation}
          className="w-16 h-16 bg-primary text-primary-text rounded-full shadow-[0_8px_25px_-5px_rgba(0,0,0,0.3)] flex items-center justify-center hover:opacity-90 transition-all hover:scale-110 active:scale-95 border border-primary/20"
          title={t(
            "createList.addPoiAtLocation",
            "Añadir punto en mi ubicación",
          )}
        >
          <span className="material-symbols-outlined text-3xl">
            add_location_alt
          </span>
        </button>

        <button
          onClick={handleLocate}
          className="w-16 h-16 bg-white text-black rounded-full shadow-xl flex items-center justify-center hover:bg-gray-100 transition-all hover:scale-110 active:scale-95 border border-black/5"
        >
          <span className="material-symbols-outlined text-2xl">
            my_location
          </span>
        </button>

        <button
          onClick={() => setRouteProfile(prev => prev === "foot" ? "driving" : "foot")}
          className="w-16 h-16 bg-white text-black rounded-full shadow-xl flex items-center justify-center hover:bg-gray-100 transition-all hover:scale-110 active:scale-95 border border-black/5"
          title={routeProfile === "foot" ? t("createList.switchToCar", "Cambiar a coche") : t("createList.switchToFoot", "Cambiar a pie")}
        >
          <span className="material-symbols-outlined text-2xl">
            {routeProfile === "foot" ? "directions_walk" : "directions_car"}
          </span>
        </button>

        <button
          onClick={() => {
            const newState = !showOtherLists;
            setShowOtherLists(newState);

            if (newState && otherLists.length > 0) {
              // Fit bounds to show all user lists
              const allPois = otherLists.flatMap((l) => l.pois || []);
              if (allPois.length > 0 && mapRef.current) {
                const bounds = L.latLngBounds(
                  allPois.map((p) => [
                    parseFloat(p.latitud),
                    parseFloat(p.longitud),
                  ]),
                );
                mapRef.current.fitBounds(bounds, { padding: [100, 100] });
              }
            }
          }}
          className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center border-2 transition-all hover:scale-110 active:scale-95 ${showOtherLists ? "bg-primary text-primary-text border-primary/50" : "bg-white dark:bg-[#111] text-primary border-black/5 dark:border-white/10"}`}
        >
          <span className="material-symbols-outlined text-2xl">
            format_list_bulleted
          </span>
        </button>
      </div>

      {/* Top-right close button — always visible, goes back to map */}
      <div className="absolute top-6 right-6 z-20 pointer-events-auto">
        <button
          onClick={() => navigate("/")}
          className="w-12 h-12 bg-black/60 backdrop-blur-xl text-white rounded-full flex items-center justify-center border border-white/10 shadow-2xl hover:bg-black/80 transition-all hover:scale-110 active:scale-95"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Panel Inferior de Creación / Edición / Inspección (Bottom Sheet) */}
      <AnimatePresence>
        {(selectedPoisForList.length > 0 || editingListId || focusedListId) && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-[76px] md:bottom-0 left-0 md:left-20 right-0 z-[1900] pointer-events-auto"
          >
            <div className="w-full flex flex-col bg-white/95 dark:bg-[#0a0a0a]/95 rounded-t-[2rem] shadow-[0_-20px_60px_rgba(0,0,0,0.3)] backdrop-blur-lg border-t border-white/10 font-display">
              {/* Header with title and action buttons */}
              <div className="flex items-center justify-between px-6 pt-5 pb-3">
                <h3 className="text-sm font-bold text-black dark:text-white font-display">
                  {focusedListId
                    ? t("createList.inspecting", "Inspeccionando")
                    : editingListId
                      ? t("createList.editingList", "Editando lista")
                      : t("createList.newList", "Nueva lista")}
                </h3>
                <div className="flex items-center gap-2">
                  {/* Minimize / restore toggle */}
                  <button
                    onClick={() => setIsSheetMinimized((prev) => !prev)}
                    title={
                      isSheetMinimized ? "Mostrar panel" : "Minimizar panel"
                    }
                    className="w-8 h-8 bg-black/10 dark:bg-white/10 text-black dark:text-white rounded-full flex items-center justify-center hover:bg-black/20 dark:hover:bg-white/20 transition-all border border-black/10 dark:border-white/10"
                  >
                    <span className="material-symbols-outlined text-base">
                      {isSheetMinimized ? "expand_less" : "map"}
                    </span>
                  </button>
                  {/* Close — opens confirmation modal */}
                  {!focusedListId && (
                    <button
                      onClick={() => setShowCloseConfirm(true)}
                      title={t("createList.closePanel", "Cerrar panel")}
                      className="w-8 h-8 bg-black/10 dark:bg-white/10 text-black dark:text-white rounded-full flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all border border-black/10 dark:border-white/10"
                    >
                      <span className="material-symbols-outlined text-base">
                        close
                      </span>
                    </button>
                  )}
                  {focusedListId && (
                    <button
                      onClick={() => setFocusedListId(null)}
                      className="w-8 h-8 bg-black/10 dark:bg-white/10 text-black dark:text-white rounded-full flex items-center justify-center hover:bg-black/20 dark:hover:bg-white/20 transition-all border border-black/10 dark:border-white/10"
                    >
                      <span className="material-symbols-outlined text-base">
                        close
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable content — animated when minimized/restored */}
              <AnimatePresence>
                {!isSheetMinimized && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="px-6 pb-6 overflow-y-auto max-h-[50vh] no-scrollbar"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Lado Izquierdo: Configuración General */}
                      <div className="space-y-4">
                        {focusedList?.imagen_url ? (
                          <div className="relative h-24 w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center">
                            <img src={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${focusedList.imagen_url}`} className="absolute inset-0 w-full h-full object-cover" alt={focusedList.nombre} />
                          </div>
                        ) : !focusedListId ? (
                          <div
                            onClick={() =>
                              document
                                .getElementById("list-image-input")
                                .click()
                            }
                            className="relative h-24 w-full bg-black/5 dark:bg-white/5 border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-1 group"
                          >
                            {imagePreview ||
                            (editingListId &&
                              otherLists.find(
                                (l) => l.id_lista === editingListId,
                              )?.imagen_url) ? (
                              <img
                                src={
                                  imagePreview ||
                                  `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${otherLists.find((l) => l.id_lista === editingListId)?.imagen_url}`
                                }
                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                                alt="Preview"
                              />
                            ) : (
                              <span className="text-xs font-bold text-black/30 dark:text-white/30">
                                {t("createList.addCover", "Añadir portada")}
                              </span>
                            )}
                            <input
                              id="list-image-input"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setListImage(file);
                                  setImagePreview(URL.createObjectURL(file));
                                }
                              }}
                            />
                          </div>
                        ) : null}

                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder={t("createList.namePlaceholder")}
                            value={focusedList ? focusedList.nombre : listName}
                            onChange={(e) => setListName(e.target.value)}
                            readOnly={!!focusedListId}
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:border-primary/50 outline-none font-display"
                          />
                          <textarea
                            placeholder={t("createList.descPlaceholder")}
                            value={focusedList ? (focusedList.descripcion || "") : listDesc}
                            onChange={(e) => setListDesc(e.target.value)}
                            readOnly={!!focusedListId}
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:border-primary/50 outline-none h-20 resize-none font-display"
                          />

                          {!focusedListId && (
                            <div className="space-y-2">
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  {
                                    v: "public",
                                    icon: "public",
                                    label: t(
                                      "createList.visibility.public",
                                      "Pública",
                                    ),
                                  },
                                  {
                                    v: "private",
                                    icon: "lock",
                                    label: t(
                                      "createList.visibility.private",
                                      "Privada",
                                    ),
                                  },
                                  {
                                    v: "friends",
                                    icon: "group",
                                    label: t(
                                      "createList.visibility.friends",
                                      "Amics",
                                    ),
                                  },
                                ].map(({ v, icon, label }) => (
                                  <button
                                    key={v}
                                    onClick={() => setListVisibility(v)}
                                    className={`py-2 rounded-lg text-xs font-bold transition-all border flex flex-col items-center gap-1 ${listVisibility === v ? "bg-primary border-primary text-primary-text" : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-black/50 dark:text-white/40"}`}
                                  >
                                    <span className="material-symbols-outlined text-sm">
                                      {icon}
                                    </span>
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Lado Derecho: Itinerario / Puntos */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between px-1">
                            <h4 className="text-xs font-bold text-black/50 dark:text-white/50 font-display">
                              {t("createList.points", "Puntos")}
                            </h4>
                            <span className="text-xs font-bold text-primary">
                              {focusedListId
                                ? otherLists.find(
                                    (l) => l.id_lista === focusedListId,
                                  )?.pois.length
                                : selectedPoisForList.length}{" "}
                              total
                            </span>
                          </div>

                          <div className="space-y-2 overflow-y-auto pr-1 no-scrollbar">
                            {(focusedListId
                              ? otherLists.find(
                                  (l) => l.id_lista === focusedListId,
                                )?.pois
                              : selectedPoisForList
                            ).map((poi, idx) => (
                              <div
                                key={poi.id_poi}
                                onClick={() =>
                                  !focusedListId && setActivePoiIndex(idx)
                                }
                                className={`group flex items-center gap-3 p-2.5 rounded-xl border transition-all ${!focusedListId ? "cursor-pointer" : ""} ${!focusedListId && activePoiIndex === idx ? "bg-primary/20 border-primary" : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-black/80 dark:text-white/80"}`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-black ${!focusedListId && activePoiIndex === idx ? "bg-primary text-primary-text" : "bg-black/10 dark:bg-white/10 text-black dark:text-white"}`}
                                >
                                  {idx + 1}
                                </div>
                                <span className="text-sm font-bold truncate flex-1 font-display">
                                  {poi.nombre}
                                </span>
                                {!focusedListId && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemovePoi(idx);
                                    }}
                                    className="text-red-500/40 hover:text-red-500"
                                  >
                                    <span className="material-symbols-outlined text-sm">
                                      delete
                                    </span>
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                          {focusedListId ? (
                            <button
                              onClick={() => {
                                const list = otherLists.find(
                                  (l) => l.id_lista === focusedListId,
                                );
                                if (list) {
                                  setSelectedPoisForList(list.pois);
                                  setListName(
                                    list.id_usuario === currentUserId
                                      ? list.nombre
                                      : `Copia de ${list.nombre}`,
                                  );
                                  setListDesc(list.descripcion || "");
                                  if (list.id_usuario === currentUserId) {
                                    setEditingListId(list.id_lista);
                                  } else {
                                    setEditingListId(null);
                                  }
                                  setFocusedListId(null);
                                  setIsSheetMinimized(false);
                                }
                              }}
                              className="w-full bg-primary text-primary-text py-3.5 rounded-xl text-sm font-bold shadow-xl transition-all active:scale-95"
                            >
                              {otherLists.find(
                                (l) => l.id_lista === focusedListId,
                              )?.id_usuario === currentUserId
                                ? t("createList.editRoute", "Editar ruta")
                                : t(
                                    "createList.useAsTemplate",
                                    "Usar como plantilla",
                                  )}
                            </button>
                          ) : (
                            <div className="flex flex-col gap-2 w-full">
                              {(!listName || selectedPoisForList.length < 2) && (
                                <p className="text-[10px] text-red-500 font-bold text-center italic">
                                  {!listName ? t("createList.missingName", "Ponle un nombre a la lista") : t("createList.missingPoints", "Añade al menos 2 puntos al itinerario")}
                                </p>
                              )}
                              <button
                                onClick={handleSaveList}
                                disabled={
                                  selectedPoisForList.length < 2 || !listName || isProcessingList
                                }
                                className={`w-full py-3.5 rounded-xl font-bold text-sm ${editingListId ? "bg-primary text-primary-text" : "bg-black dark:bg-white text-white dark:text-black"} ${isProcessingList ? 'opacity-50 cursor-not-allowed' : 'disabled:opacity-20 disabled:cursor-not-allowed active:scale-95 hover:opacity-90'} transition-all flex items-center justify-center gap-2`}
                              >
                                {isProcessingList && <span className="material-symbols-outlined animate-spin text-sm">refresh</span>}
                                {editingListId
                                  ? t("createList.saveChanges", "Guardar cambios")
                                  : t("createList.save", "Guardar ruta")}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      {showCloseConfirm && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCloseConfirm(false)}
          />
          {/* Modal card */}
          <div className="relative z-10 w-full max-w-xs bg-white dark:bg-[#111] rounded-3xl p-6 shadow-2xl border border-black/5 dark:border-white/10 font-display flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-bold text-black dark:text-white">
                {t("createList.confirmCloseTitle", "¿Descartar ruta?")}
              </h2>
              <p className="text-sm text-black/50 dark:text-white/50">
                {t(
                  "createList.confirmClose",
                  "¿Estás seguro? Se perderá la ruta que estás creando.",
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCloseConfirm(false)}
                className="flex-1 py-3 rounded-2xl text-sm font-bold bg-black/5 dark:bg-white/10 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-all active:scale-95"
              >
                {t("common.cancel", "Cancelar")}
              </button>
              <button
                onClick={() => {
                  setShowCloseConfirm(false);
                  setEditingListId(null);
                  setSelectedPoisForList([]);
                  setListName("");
                  setListDesc("");
                  setImagePreview(null);
                  setIsSheetMinimized(false);
                }}
                className="flex-1 py-3 rounded-2xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-all active:scale-95"
              >
                {t("createList.confirmCloseBtn", "Sí, descartar")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Navbar />
    </div>
  );
};

export default CreateList;
