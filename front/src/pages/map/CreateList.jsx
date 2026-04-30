import React, { useState, useEffect, useRef, Fragment } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../layouts/Navbar";
import { getPois, getRoute, getCategorias, createLista, createPoi, getNodos, updatePoi, deletePoi, deleteNode, getListas, updateLista } from "../../services/communicationManager";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
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

  // State
  const [pois, setPois] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allNodes, setAllNodes] = useState([]);
  const [selectedPoisForList, setSelectedPoisForList] = useState([]);
  const [listName, setListName] = useState("");
  const [listDesc, setListDesc] = useState("");
  const [activePoiIndex, setActivePoiIndex] = useState(null);
  const [listVisibility, setListVisibility] = useState("public");
  const [joinedRoute, setJoinedRoute] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  const [otherLists, setOtherLists] = useState([]);
  const [otherListGeometries, setOtherListGeometries] = useState({});
  const [focusedListId, setFocusedListId] = useState(null);
  const [editingListId, setEditingListId] = useState(null);
  const [showOtherLists, setShowOtherLists] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(17);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [poiRes, catRes, nodeRes, listRes] = await Promise.all([
          getPois(),
          getCategorias(),
          getNodos(),
          getListas()
        ]);
        if (poiRes.success) setPois(poiRes.data);
        if (catRes.success) setCategories(catRes.data);
        if (nodeRes.success) setAllNodes(nodeRes.data);
        if (listRes.success) {
          setOtherLists(listRes.data);
          // Intentar precargar las geometrías de las otras rutas
          listRes.data.forEach(async (list) => {
            if (list.pois && list.pois.length >= 2) {
              try {
                const coords = list.pois.map(p => `${p.longitud},${p.latitud}`).join(";");
                const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
                const data = await res.json();
                if (data.code === "Ok") {
                  const route = data.routes[0];
                  const geom = route.geometry.coordinates.map(c => [c[1], c[0]]);
                  setOtherListGeometries(prev => ({ 
                    ...prev, 
                    [list.id_lista]: {
                      geom,
                      distance: route.distance,
                      waypoints: route.legs.map(leg => leg.distance) // Distancia entre puntos
                    }
                  }));
                }
              } catch (e) { console.error("Error precargando ruta:", e); }
            }
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (mapRef.current && (pois.length > 0 || allNodes.length > 0)) {
      const bounds = L.latLngBounds([
        ...pois.map(p => [parseFloat(p.latitud), parseFloat(p.longitud)]),
        ...allNodes.map(n => [parseFloat(n.latitud), parseFloat(n.longitud)])
      ]);
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [pois, allNodes]);

  const handleSelectPoi = (poi) => {
    const existingIndex = selectedPoisForList.findIndex(p => p.id_poi === poi.id_poi);
    if (existingIndex === -1) {
      const newSelected = [...selectedPoisForList, poi];
      setSelectedPoisForList(newSelected);
      setActivePoiIndex(newSelected.length - 1);
    } else {
      setActivePoiIndex(existingIndex);
    }
  };

  const handleMarkNodeAsPoi = async (node) => {
    try {
      const poiData = {
        nombre: `Punto ${selectedPoisForList.length + 1}`,
        descripcion: "Punto creado por usuario",
        latitud: node.latitud,
        longitud: node.longitud,
        id_categoria: categories[0]?.id_categoria || 1,
        es_accesible: 1,
        es_fijo: 0,
        id_nodo_acceso: node.id_nodo,
        visibilidad: 'private'
      };
      const res = await createPoi(poiData);
      if (res.success) {
        handleSelectPoi(res.data);
      }
    } catch (err) {
      console.error("Error marking node as POI:", err);
    }
  };

  const handleMapClick = async (latlng) => {
    try {
      const poiData = {
        nombre: `Punto ${selectedPoisForList.length + 1}`,
        descripcion: "Punto creado por usuario",
        latitud: latlng.lat,
        longitud: latlng.lng,
        id_categoria: categories[0]?.id_categoria || 1,
        es_accesible: 1,
        es_fijo: 0,
        visibilidad: 'private'
      };
      const res = await createPoi(poiData);
      if (res.success) {
        const newPoi = res.data;
        setSelectedPoisForList(prev => [...prev, newPoi]);
        setPois(prev => [...prev, newPoi]);
        setActivePoiIndex(selectedPoisForList.length); // Seleccionar automáticamente el nuevo punto
      }
    } catch (err) {
      console.error("Error creating POI from map click:", err);
    }
  };

  const handleRemovePoi = async (index) => {
    const poiToRemove = selectedPoisForList[index];
    if (!poiToRemove) return;

    // --- ACTUALIZACIÓN INSTANTÁNEA ---
    setSelectedPoisForList(prev => prev.filter((_, i) => i !== index));
    setPois(prev => prev.filter(p => p.id_poi !== poiToRemove.id_poi));

    if (activePoiIndex === index) setActivePoiIndex(null);
    else if (activePoiIndex > index) setActivePoiIndex(activePoiIndex - 1);

    // --- BORRADO REAL EN DB ---
    try {
      // 1. Borramos el POI
      await deletePoi(poiToRemove.id_poi);

      // 2. Borramos también su nodo de navegación asociado para que no queden residuos
      if (poiToRemove.id_nodo_acceso) {
        await deleteNode(poiToRemove.id_nodo_acceso).catch(err => {
          console.warn("El nodo no se pudo borrar (posiblemente sea un nodo compartido):", err);
        });
        // Actualizamos la lista de nodos local para que desaparezca del mapa si la red está visible
        setAllNodes(prev => prev.filter(n => n.id_nodo !== poiToRemove.id_nodo_acceso));
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
        descripcion: newDesc
      });
    } catch (err) {
      console.error("Error updating POI description:", err);
    }
  };

  useEffect(() => {
    const updateRoute = async () => {
      if (selectedPoisForList.length < 2) {
        setJoinedRoute(null);
        setTotalDistance(0);
        return;
      }

      try {
        const coords = selectedPoisForList
          .map(p => `${p.longitud},${p.latitud}`)
          .join(";");

        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.code === "Ok" && data.routes.length > 0) {
          const route = data.routes[0];
          const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
          setJoinedRoute(coordinates);
          setTotalDistance(route.distance);
        } else {
          throw new Error(`OSRM error: ${data.code}`);
        }
      } catch (err) {
        console.error("OSRM error, falling back to straight lines:", err);
        const straightLines = [];
        let dist = 0;
        for (let i = 0; i < selectedPoisForList.length - 1; i++) {
          const p1 = selectedPoisForList[i];
          const p2 = selectedPoisForList[i + 1];
          straightLines.push([parseFloat(p1.latitud), parseFloat(p1.longitud)]);
          straightLines.push([parseFloat(p2.latitud), parseFloat(p2.longitud)]);
          dist += L.latLng(p1.latitud, p1.longitud).distanceTo(L.latLng(p2.latitud, p2.longitud));
        }
        setJoinedRoute(straightLines);
        setTotalDistance(dist);
      }
    };
    updateRoute();
  }, [selectedPoisForList]);

  const handleFocusList = (list) => {
    setFocusedListId(list.id_lista);
    if (list.pois && list.pois.length > 0) {
      const bounds = L.latLngBounds(list.pois.map(p => [parseFloat(p.latitud), parseFloat(p.longitud)]));
      if (mapRef.current) mapRef.current.fitBounds(bounds, { padding: [100, 100] });
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const p = [pos.coords.latitude, pos.coords.longitude];
      if (mapRef.current) mapRef.current.flyTo(p, 17, { animate: true, duration: 1.5 });
    });
  };

  const handleSaveList = async () => {
    if (!listName) {
      alert(t("createList.errorNoName"));
      return;
    }

    try {
      // --- Lógica de Optimización Automática (Ruta más corta) ---
      let optimizedPois = [...selectedPoisForList];

      if (optimizedPois.length >= 3) {
        const points = [...optimizedPois];
        const result = [points.shift()]; 

        while (points.length > 0) {
          const lastPoint = result[result.length - 1];
          let nearestIdx = 0;
          let minDistance = L.latLng(parseFloat(lastPoint.latitud), parseFloat(lastPoint.longitud))
            .distanceTo(L.latLng(parseFloat(points[0].latitud), parseFloat(points[0].longitud)));

          for (let i = 1; i < points.length; i++) {
            const d = L.latLng(parseFloat(lastPoint.latitud), parseFloat(lastPoint.longitud))
              .distanceTo(L.latLng(parseFloat(points[i].latitud), parseFloat(points[i].longitud)));
            if (d < minDistance) {
              minDistance = d;
              nearestIdx = i;
            }
          }
          result.push(points.splice(nearestIdx, 1)[0]);
        }
        optimizedPois = result;
      }

      const listaData = {
        id_usuario: 1, 
        nombre: listName,
        descripcion: listDesc,
        visibilidad: listVisibility,
        pois: optimizedPois.map(p => p.id_poi)
      };

      let res;
      if (editingListId) {
        res = await updateLista(editingListId, listaData);
      } else {
        res = await createLista(listaData);
      }

      if (res.success) {
        alert(editingListId ? "¡Lista actualizada!" : t("createList.success"));
        navigate("/");
      }
    } catch (err) {
      console.error("Error saving/updating list:", err);
    }
  };

  return (
    <div className="relative h-screen w-full bg-slate-950 text-white font-display overflow-hidden select-none">
      <div className="absolute inset-0 z-0">
        <MapContainer
          ref={mapRef}
          center={initialCenter}
          zoom={17}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            url={isSatelliteView
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            }
          />

          {joinedRoute && <Polyline positions={joinedRoute} color="var(--theme-color, #ec4899)" weight={6} opacity={0.8} />}

          {/* Rendering Other User Lists */}
          {showOtherLists && otherLists
            .filter(list => !focusedListId || list.id_lista === focusedListId)
            .map(list => {
            if (!list.pois || list.pois.length === 0) return null;
            
            const isFocused = focusedListId === list.id_lista;

            // Zoom out logic: Show a single representative marker
            if (currentZoom < 13 && !isFocused) {
              const firstPoi = list.pois[0];
              return (
                <Marker
                  key={`list-cluster-${list.id_lista}`}
                  position={[parseFloat(firstPoi.latitud), parseFloat(firstPoi.longitud)]}
                  icon={L.divIcon({
                    className: "list-cluster-marker",
                    html: `<div class="w-10 h-10 bg-slate-800/90 rounded-full border-2 border-white/50 shadow-2xl flex items-center justify-center text-white scale-75 group transition-all">
                            <span class="material-symbols-outlined text-lg">format_list_bulleted</span>
                          </div>`,
                    iconSize: [40, 40],
                    iconAnchor: [20, 20]
                  })}
                  eventHandlers={{ click: () => handleFocusList(list) }}
                />
              );
            }

            // Zoom in logic: Show individual POIs and a polyline
            const listData = otherListGeometries[list.id_lista];
            const geom = listData?.geom || list.pois.map(p => [parseFloat(p.latitud), parseFloat(p.longitud)]);
            
            return (
              <Fragment key={`list-full-${list.id_lista}`}>
                <Polyline 
                  positions={geom} 
                  color={isFocused ? "var(--theme-color, #6366f1)" : "#94a3b8"} 
                  weight={isFocused ? 4 : 2} 
                  dashArray={isFocused ? "" : "5, 10"} 
                  opacity={isFocused ? 1 : 0.5} 
                  eventHandlers={{ click: () => handleFocusList(list) }}
                />
                {list.pois.map((poi, idx) => (
                  <Marker
                    key={`other-poi-${list.id_lista}-${poi.id_poi}`}
                    position={[parseFloat(poi.latitud), parseFloat(poi.longitud)]}
                    icon={L.divIcon({
                      className: "other-list-poi",
                      html: `<div class="w-5 h-5 ${isFocused ? 'bg-indigo-500 scale-125' : 'bg-slate-500'} rounded-full border-2 border-white shadow-md flex items-center justify-center text-[9px] text-white font-bold transition-all">${idx + 1}</div>`,
                      iconSize: [20, 20],
                      iconAnchor: [10, 10]
                    })}
                    eventHandlers={{ click: () => handleFocusList(list) }}
                  />
                ))}
              </Fragment>
            );
          })}

          {pois.filter(p => !selectedPoisForList.find(sp => sp.id_poi === p.id_poi)).map(poi => (
            <Marker
              key={`poi-${poi.id_poi}`}
              position={[parseFloat(poi.latitud), parseFloat(poi.longitud)]}
              icon={L.divIcon({
                className: "existing-poi-marker",
                html: `<div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-[8px] font-bold italic">POI</div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              })}
              eventHandlers={{ click: () => handleSelectPoi(poi) }}
            />
          ))}

          {selectedPoisForList.map((poi, idx) => (
            <Marker
              key={`selected-${poi.id_poi}`}
              position={[parseFloat(poi.latitud), parseFloat(poi.longitud)]}
              icon={L.divIcon({
                className: `selected-poi-marker transition-all ${activePoiIndex === idx ? 'scale-125 z-[100]' : ''}`,
                html: `<div class="w-8 h-8 ${idx === 0 ? 'bg-green-500 text-white border-white' :
                  activePoiIndex === idx ? 'bg-primary-text text-primary border-primary' :
                    'bg-primary text-primary-text border-white'
                  } rounded-full border-4 shadow-lg flex items-center justify-center text-xs font-bold transition-all">
                  ${idx === 0 ? '<span class="material-symbols-outlined text-[14px]">play_arrow</span>' : idx + 1}
                </div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
              })}
              eventHandlers={{ click: () => setActivePoiIndex(idx) }}
            />
          ))}

          <MapEvents onMapClick={handleMapClick} setCurrentZoom={setCurrentZoom} />
        </MapContainer>

        {/* Floating Toggle for Map Style - On the right side */}
        <div className="absolute top-1/2 -translate-y-1/2 right-4 flex flex-col gap-3 z-[1000]">
          <button
            onClick={() => setIsSatelliteView(!isSatelliteView)}
            className="w-12 h-12 bg-white text-black rounded-2xl shadow-2xl flex flex-col items-center justify-center border-2 border-white transition-all hover:scale-110 active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">
              {isSatelliteView ? 'map' : 'layers'}
            </span>
            <span className="text-[7px] font-black uppercase tracking-tighter">
              {isSatelliteView ? t("createList.map") : t("createList.satellite")}
            </span>
          </button>

          <button
            onClick={handleLocate}
            className="w-12 h-12 bg-primary text-primary-text rounded-2xl shadow-2xl flex items-center justify-center hover:opacity-90 transition-all hover:scale-110 active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">my_location</span>
          </button>

          <button
            onClick={() => setShowOtherLists(!showOtherLists)}
            className={`w-12 h-12 rounded-2xl shadow-2xl flex flex-col items-center justify-center border-2 transition-all hover:scale-110 active:scale-95 ${
              showOtherLists ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-white text-indigo-600 border-white'
            }`}
            title={t("createList.showOtherLists", "Mostrar/Ocultar Otras Listas")}
          >
            <span className="material-symbols-outlined text-xl">explore</span>
            <span className="text-[7px] font-black uppercase tracking-tighter">{t("createList.other", "Otras")}</span>
          </button>
        </div>
      </div>

      {/* Close button in top right */}
      <div className="absolute top-6 right-6 z-20 pointer-events-auto">
        <button
          onClick={() => navigate("/")}
          className="w-12 h-12 bg-black/60 backdrop-blur-xl text-white rounded-full flex items-center justify-center border border-white/10 shadow-2xl hover:bg-black/80 transition-all hover:scale-110 active:scale-95"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Sidebar de Creación / Edición / Inspección (Lateral Izquierdo) */}
      {(selectedPoisForList.length > 0 || editingListId || focusedListId) && (
        <div className="absolute top-0 left-0 bottom-0 w-[400px] bg-slate-950/90 backdrop-blur-3xl border-r border-white/10 z-[1001] p-8 overflow-y-auto no-scrollbar animate-slide-right pointer-events-auto shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
          
          {/* Caso 1: Creando o Editando mi propia lista */}
          {!focusedListId && (selectedPoisForList.length > 0 || editingListId) && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none italic">
                  {editingListId ? t("createList.finishTitle", "Finalizar Lista") : t("createList.title", "Crear Lista")}<span className="text-primary">.</span>
                </h2>
                <p className="text-[9px] text-white/40 uppercase font-bold tracking-[0.2em]">{t("createList.subtitle", "Selecciona puntos en el mapa para crear tu itinerario personalizado.")}</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">{t("createList.nameLabel", "Nombre")}</label>
                  <input
                    type="text"
                    placeholder={t("createList.namePlaceholder", "Escribe un título...")}
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">{t("createList.descLabel", "Descripción")}</label>
                  <textarea
                    placeholder={t("createList.descPlaceholder", "¿De qué trata esta lista?")}
                    value={listDesc}
                    onChange={(e) => setListDesc(e.target.value)}
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-primary/5 transition-all outline-none h-32 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">{t("editProfile.dangerZone", "Privacidad")}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['public', 'private', 'friends'].map((v) => (
                      <button
                        key={v}
                        onClick={() => setListVisibility(v)}
                        className={`py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border-2 ${
                          listVisibility === v 
                          ? 'bg-primary border-primary text-primary-text shadow-lg shadow-primary/20' 
                          : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                        }`}
                      >
                        {v === 'public' ? t("community.tabs.official", "Pública") : v === 'private' ? t("nav.darkMode", "Privada") : t("community.friends", "Amigos")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{t("createList.selection", "Tu Selección")}</h3>
                  <span className="px-2 py-0.5 bg-primary/20 rounded text-[9px] font-bold text-primary border border-primary/20">{selectedPoisForList.length}</span>
                </div>
                
                <div className="space-y-2 max-h-[200px] overflow-y-auto no-scrollbar pr-2">
                  {selectedPoisForList.map((poi, idx) => (
                    <div
                      key={poi.id_poi}
                      onClick={() => setActivePoiIndex(idx)}
                      className={`group flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                        activePoiIndex === idx
                          ? 'bg-primary/20 border-primary shadow-lg'
                          : 'bg-white/5 border-white/5 text-white/80 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${activePoiIndex === idx ? 'bg-primary text-primary-text' : 'bg-white/10 text-white'}`}>
                        {idx + 1}
                      </div>
                      <span className="text-[11px] font-bold truncate flex-1">{poi.nombre}</span>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemovePoi(idx); }}
                        className="w-5 h-5 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                      >
                        <span className="material-symbols-outlined text-[12px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>

                {totalDistance > 0 && (
                  <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-text rounded-2xl shadow-xl shadow-primary/20">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase tracking-widest opacity-60">{t("createList.distanceTotal", "Distancia Total")}</span>
                      <span className="text-sm font-black">
                        {totalDistance > 1000
                          ? `${(totalDistance / 1000).toFixed(2)} km`
                          : `${Math.round(totalDistance)} m`}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-xl opacity-40">route</span>
                  </div>
                )}
              </div>

              <div className="pt-6 space-y-3">
                <button
                  onClick={handleSaveList}
                  disabled={selectedPoisForList.length < 1 || !listName}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                    editingListId ? 'bg-primary text-primary-text shadow-primary/40' : 'bg-white text-black'
                  } disabled:opacity-20 disabled:grayscale`}
                >
                  <span className="material-symbols-outlined">{editingListId ? 'save_as' : 'cloud_upload'}</span>
                  {editingListId ? t("common.save", "Actualizar Lista") : t("createList.save", "Guardar y Publicar")}
                </button>
                
                {(editingListId || selectedPoisForList.length > 0) && (
                  <button 
                    onClick={() => {
                      setEditingListId(null);
                      setSelectedPoisForList([]);
                      setListName("");
                      setListDesc("");
                    }}
                    className="w-full text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all py-2"
                  >
                    {t("common.cancel", "Descartar cambios")}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Caso 2: Inspeccionando una lista ajena */}
          {focusedListId && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-primary text-[8px] font-black uppercase rounded text-primary-text shadow-lg shadow-primary/20">{t("createList.inspectMode", "Modo Inspección")}</span>
                  <h3 className="text-2xl font-black text-white italic truncate max-w-[250px] leading-tight">
                    {otherLists.find(l => l.id_lista === focusedListId)?.nombre}
                  </h3>
                </div>
                <button 
                  onClick={() => setFocusedListId(null)}
                  className="w-10 h-10 bg-white/5 text-white rounded-full flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[11px] text-white/60 leading-relaxed italic">
                  {otherLists.find(l => l.id_lista === focusedListId)?.descripcion || t("createList.noDesc", "Sin descripción disponible.")}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{t("createList.suggestedRoute", "Recorrido sugerido")}</h4>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                  {otherLists.find(l => l.id_lista === focusedListId)?.pois.map((poi, idx, arr) => (
                    <div key={poi.id_poi} className="relative pl-8">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/20 ml-2.5">
                        {idx === arr.length - 1 && <div className="absolute top-0 bottom-0 w-full bg-slate-950" style={{top: '12px'}} />}
                      </div>
                      <div className="absolute left-0 top-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[9px] font-bold text-primary-text border-2 border-slate-950 z-10">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold text-white leading-none">{poi.nombre}</h4>
                        {idx < arr.length - 1 && (
                          <div className="flex items-center gap-1.5 py-2">
                            <span className="material-symbols-outlined text-[12px] text-primary">directions_walk</span>
                            <span className="text-[9px] text-primary font-black uppercase">
                              {otherListGeometries[focusedListId]?.waypoints?.[idx] 
                                ? `${Math.round(otherListGeometries[focusedListId].waypoints[idx])} m`
                                : "..."}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-end px-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/40 uppercase font-black tracking-widest">{t("createList.distanceTotal", "Longitud Total")}</span>
                    <span className="text-3xl font-black text-primary">
                      {otherListGeometries[focusedListId]?.distance 
                        ? `${(otherListGeometries[focusedListId].distance / 1000).toFixed(2)} km`
                        : "..."}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      const list = otherLists.find(l => l.id_lista === focusedListId);
                      if (list) {
                        setSelectedPoisForList(list.pois);
                        setListName(list.nombre);
                        setListDesc(list.descripcion || "");
                        setListVisibility(list.visibilidad || "public");
                        setEditingListId(list.id_lista);
                        setFocusedListId(null);
                      }
                    }}
                    className="flex-1 bg-primary hover:opacity-90 text-primary-text py-4 rounded-2xl text-[11px] font-black uppercase transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    {t("common.edit", "Editar")}
                  </button>
                  <button 
                    onClick={() => {
                      const list = otherLists.find(l => l.id_lista === focusedListId);
                      if (list) {
                        setSelectedPoisForList(list.pois);
                        setListName(`${list.nombre} (Copia)`);
                        setListDesc(list.descripcion || "");
                        setEditingListId(null);
                        setFocusedListId(null);
                      }
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl text-[11px] font-black uppercase transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    {t("common.copy", "Copiar")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Ficha de detalle de un punto seleccionado (siempre visible en el sidebar si hay punto activo) */}
          {activePoiIndex !== null && selectedPoisForList[activePoiIndex] && !focusedListId && (
            <div className="mt-8 pt-8 border-t border-white/10 animate-fade-in">
              <div className="bg-white/5 rounded-3xl p-5 border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setActivePoiIndex(null)}
                    className="text-white/40 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-pink-500 rounded-xl flex items-center justify-center text-xs font-black shadow-lg shadow-pink-500/20">
                    {activePoiIndex + 1}
                  </div>
                  <h3 className="text-sm font-black text-white">{selectedPoisForList[activePoiIndex].nombre}</h3>
                </div>

                <textarea
                  value={selectedPoisForList[activePoiIndex].descripcion || ""}
                  onChange={(e) => handleUpdatePoiDesc(activePoiIndex, e.target.value)}
                  placeholder="Nota personal sobre este sitio..."
                  className="w-full bg-black/20 border-none outline-none rounded-xl p-3 text-[11px] text-white/60 leading-relaxed italic resize-none h-24 no-scrollbar"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default CreateList;
