import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  Circle,
} from "react-leaflet";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../layouts/Navbar"; // Import the new Navbar component
import Header from "../../layouts/Header"; // Import the global header
import UserAvatar from "../../components/UserAvatar";
import { getPois, getRoute, getCategorias, getListas, getUsuarioListas, createLista, getUsuarios } from "../../services/communicationManager";
import socket from "../../services/socketManager";
import MapLayers from "../../components/MapLayers";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMapEvents } from "react-leaflet";

const MapEvents = ({ setCurrentZoom }) => {
  useMapEvents({
    zoomend(e) {
      setCurrentZoom(e.target.getZoom());
    },
  });
  return null;
};

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons matching the aesthetic (circular image with text below)
const createCustomIcon = (label, imageUrl) => {
  return L.divIcon({
    className: "custom-map-icon",
    html: `
      <div class="flex flex-col items-center justify-center" style="width: 100px; margin-left: -50px; margin-top: -20px;">
        <div class="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden bg-white flex-shrink-0">
          <img src="${imageUrl || 'https://via.placeholder.com/40'}" class="w-full h-full object-cover" />
        </div>
        <div class="mt-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-lg text-black dark:text-white text-[9px] font-black uppercase tracking-tight text-center leading-tight shadow-xl border border-white/20 whitespace-nowrap max-w-[120px] truncate">
          ${label || ''}
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

// User Location Icon
const UserIcon = L.divIcon({
  className: "user-location-icon",
  html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const Map = () => {
  const mapRef = useRef(null);
  const initialCenter = [41.3864, 2.1058];
  const [userPosition, setUserPosition] = useState(null);
  const [isLegendOpen, setIsLegendOpen] = useState(false); // State for collapsible legend
  const [isSatelliteView, setIsSatelliteView] = useState(false); // State for satellite view toggle
  const [isSheetExpanded, setIsSheetExpanded] = useState(true); // State for bottom sheet toggle
  const [userLists, setUserLists] = useState([]);
  const [discoverLists, setDiscoverLists] = useState([]);
  const [realCurators, setRealCurators] = useState([]); // Real users for discovery
  const [focusedListId, setFocusedListId] = useState(null);
  const [otherListGeometries, setOtherListGeometries] = useState({});
  const [userToPoiRoute, setUserToPoiRoute] = useState(null); // Ruta desde usuario a POI
  const [currentZoom, setCurrentZoom] = useState(17);

  // eslint-disable-next-line no-unused-vars
  const [imageBounds, setImageBounds] = useState([
    [41.57 - 0.008, 2.2611 - 0.012],
    [41.57 + 0.008, 2.2611 + 0.012],
  ]);

  // State for future logic
  const [selectedFeature, setSelectedFeature] = useState(null); // To store clicking on a marker
  const [originFeature, setOriginFeature] = useState(null); // POI de origen manual
  const [destinationFeature, setDestinationFeature] = useState(null); // POI de destino manual
  const [markers, setMarkers] = useState([]);
  const [categories, setCategories] = useState([]); // Categorias de la BD para la leyenda
  const [activeFilter, setActiveFilter] = useState(null); // null = mostrar todos, id_categoria = filtrar
  const [route, setRoute] = useState(null); // Array de [lat, lng] para Dijkstra Polyline
  const [distance, setDistance] = useState(null); // Distancia de la ruta

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchPois = async () => {
      try {
        // 1. Obtenemos las categorias de la base de datos
        const catRes = await getCategorias();
        const categorias = catRes.success ? catRes.data : [];

        // 2. Guardamos las categorias en el estado para usarlas en la leyenda
        setCategories(categorias);

        // 3. Obtenemos los POIs
        const data = await getPois();

        if (data.success && data.data) {
          const fetchedMarkers = [];

          // 4. Construimos cada marker manualmente para que sea facil de leer
          for (let i = 0; i < data.data.length; i++) {
            const poi = data.data[i];

            // Buscamos la categoria de este POI
            let iconName = null;
            let bgColor = '#64748b'; // color gris por defecto
            for (let j = 0; j < categorias.length; j++) {
              if (categorias[j].id_categoria === poi.id_categoria) {
                iconName = categorias[j].icono_url;
                bgColor = categorias[j].color_hex || '#64748b';
                break;
              }
            }

            const marker = {
              id: poi.id_poi,
              id_categoria: poi.id_categoria,
              position: [parseFloat(poi.latitud), parseFloat(poi.longitud)],
              name: poi.nombre,
              description: poi.descripcion,
              iconName: iconName,
              bgColor: bgColor
            };

            fetchedMarkers.push(marker);
          }

          setMarkers(fetchedMarkers);
        }
      } catch (error) {
        console.error("Error fetching POIs or Categories:", error);
      }
    };

    const fetchUserLists = async () => {
      try {
        const userStr = localStorage.getItem("usuario");
        let userId = null;
        if (userStr) {
          const userObj = JSON.parse(userStr);
          userId = userObj.id_usuario;
        }

        if (!userId && !location.state?.focusedList) {
          setUserLists([]);
          return;
        }

        // Fetch only user lists if logged in
        const res = await getUsuarioListas(userId);

        if (res.success && res.data) {
          let lists = res.data;

          // If we came from Home with a specific public list, make sure it's in the array
          if (location.state?.focusedList) {
            const externalList = location.state.focusedList;
            if (!lists.find(l => l.id_lista === externalList.id_lista)) {
              lists = [externalList, ...lists];
            }
            // Auto-focus it after a short delay to ensure map is ready
            setTimeout(() => handleFocusList(externalList), 500);
          }

          setUserLists(lists);
        }
      } catch (error) {
        console.error("Error fetching User Lists:", error);
      }
    };

    const fetchDiscoverLists = async () => {
      try {
        const res = await getListas();
        if (res.success && res.data) {
          const shuffled = [...res.data].sort(() => 0.5 - Math.random());
          setDiscoverLists(shuffled.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching Discover Lists:", error);
      }
    };

    const fetchRealCurators = async () => {
      try {
        const res = await getUsuarios();
        if (res.success && res.data) {
          // Shuffle and pick 6 random users
          const shuffled = [...res.data].sort(() => 0.5 - Math.random());
          setRealCurators(shuffled.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching Real Curators:", error);
      }
    };

    fetchPois();
    fetchUserLists();
    fetchDiscoverLists();
    fetchRealCurators();

    // Listen to real-time map updates from WebSockets
    socket.on('mapa_actualizado', () => {
      console.log("WebSocket Notice: Map updated! Refreshing POIs...");
      fetchPois();
      fetchUserLists();
      fetchDiscoverLists();
      fetchRealCurators();
    });

    return () => {
      socket.off('mapa_actualizado');
    };
  }, []);

  const handleIncludeInMyLists = async (list) => {
    const userStr = localStorage.getItem("usuario");
    if (!userStr) {
      alert("Debes iniciar sesión para guardar listas.");
      navigate("/login");
      return;
    }
    const user = JSON.parse(userStr);

    try {
      const newListData = {
        id_usuario: user.id_usuario,
        nombre: list.nombre,
        descripcion: list.descripcion || "Copiada de la comunidad",
        visibilidad: "private",
        pois: list.pois.map(p => p.id_poi)
      };
      const res = await createLista(newListData);
      if (res.success) {
        alert("¡Lista añadida a tus listas!");
        const userListsRes = await getUsuarioListas(user.id_usuario);
        if (userListsRes.success) setUserLists(userListsRes.data);
      }
    } catch (error) {
      console.error("Error copying list:", error);
      alert("Hubo un error al guardar la lista.");
    }
  };

  const handleGoToFirstPoi = (list) => {
    if (!userPosition || !list || !list.pois || list.pois.length === 0) {
      alert("Necesitamos tu ubicación y una lista con puntos.");
      return;
    }
    handleGoToPoi(list.pois[0]);
  };

  const handleFocusList = async (list) => {
    if (focusedListId === list.id_lista) {
      setFocusedListId(null);
      setUserToPoiRoute(null);
      return;
    }
    setFocusedListId(list.id_lista);
    setIsSheetExpanded(false);

    if (list.pois && list.pois.length >= 2) {
      // Append first POI to the end to close the loop
      const closedPois = [...list.pois, list.pois[0]];
      const coordsString = closedPois.map(p => `${p.longitud},${p.latitud}`).join(';');
      try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/foot/${coordsString}?overview=full&geometries=geojson`);
        const data = await res.json();
        if (data.code === "Ok") {
          const geom = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setOtherListGeometries(prev => ({ ...prev, [list.id_lista]: { geom, distance: data.routes[0].distance } }));

          const bounds = L.latLngBounds(geom);
          mapRef.current.fitBounds(bounds, { padding: [50, 50], animate: true });
        }
      } catch (err) { console.error(err); }
    }
  };

  const handleGoToNearestPoi = () => {
    if (!userPosition || !focusedListId) {
      alert("Necesitamos tu ubicación y una ruta seleccionada.");
      return;
    }

    const list = userLists.find(l => l.id_lista === focusedListId);
    if (!list || !list.pois || list.pois.length === 0) return;

    let nearestPoi = list.pois[0];
    let minDistance = L.latLng(userPosition).distanceTo(L.latLng(parseFloat(nearestPoi.latitud), parseFloat(nearestPoi.longitud)));

    list.pois.forEach(poi => {
      const d = L.latLng(userPosition).distanceTo(L.latLng(parseFloat(poi.latitud), parseFloat(poi.longitud)));
      if (d < minDistance) {
        minDistance = d;
        nearestPoi = poi;
      }
    });

    handleGetRouteToPoi(nearestPoi);
  };

  const handleGetRouteToPoi = async (poi) => {
    if (!userPosition) {
      alert("Necesitamos tu ubicación para calcular la ruta.");
      return;
    }

    const start = `${userPosition[1]},${userPosition[0]}`;
    const end = `${poi.longitud},${poi.latitud}`;

    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/foot/${start};${end}?overview=full&geometries=geojson`);
      const data = await res.json();
      if (data.code === "Ok") {
        const geom = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        setUserToPoiRoute({ geom, distance: data.routes[0].distance, poiId: poi.id_poi });

        const bounds = L.latLngBounds([userPosition, [parseFloat(poi.latitud), parseFloat(poi.longitud)]]);
        mapRef.current.fitBounds(bounds, { padding: [100, 100], animate: true });
      }
    } catch (err) { console.error(err); }
  };

  // Real-time location tracking
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(newPos);

        // If we have an active route to a POI, refresh it automatically
        if (userToPoiRoute?.poiId) {
          const poi = userLists.flatMap(l => l.pois).find(p => p.id_poi === userToPoiRoute.poiId);
          if (poi) {
            // We don't want to flyTo every second, maybe only if user moves significantly
            // or just update the geometry silently.
            silentUpdateRouteToPoi(newPos, poi);
          }
        }
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userToPoiRoute?.poiId, userLists]);

  const silentUpdateRouteToPoi = async (uPos, poi) => {
    const start = `${uPos[1]},${uPos[0]}`;
    const end = `${poi.longitud},${poi.latitud}`;
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/foot/${start};${end}?overview=full&geometries=geojson`);
      const data = await res.json();
      if (data.code === "Ok") {
        const geom = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        setUserToPoiRoute({ geom, distance: data.routes[0].distance, poiId: poi.id_poi });
      }
    } catch (err) { console.error(err); }
  };

  // Auto-locate and fly on startup
  useEffect(() => {
    handleLocate();
  }, []);



  // Transformation of Dijkstra Output to Leaflet Polyline Coordinates
  const fetchRoute = async (origenId, destinoId, coords = null) => {
    try {
      const result = await getRoute(origenId, destinoId, coords);

      if (result.success && result.data && result.data.detalles) {
        // El endpoint devuelve detalles (arreglo de objetos con latitud, longitud)
        const polylineCoords = result.data.detalles.map(nodo => [
          parseFloat(nodo.latitud),
          parseFloat(nodo.longitud)
        ]);
        setRoute(polylineCoords);

        // Calcular distancia total de la ruta
        let totalDistance = 0;
        for (let i = 0; i < polylineCoords.length - 1; i++) {
          totalDistance += L.latLng(polylineCoords[i]).distanceTo(polylineCoords[i + 1]);
        }
        setDistance(totalDistance);

        // Si tenemos el ref del mapa, ajustamos la vista para que quepa toda la ruta
        if (mapRef.current && polylineCoords.length > 0) {
          // Si hay posición de usuario, la incluimos en los límites para que la ruta empiece desde él
          const bounds = userPosition
            ? L.latLngBounds([userPosition, ...polylineCoords])
            : L.latLngBounds(polylineCoords);

          mapRef.current.fitBounds(bounds, {
            padding: [50, 50],
            animate: true,
            duration: 1.5
          });
        }
      }
    } catch (error) {
      console.error("Error fetching Route:", error);
    }
  };

  const watchIdRef = useRef(null);

  const startWatchingLocation = () => {
    if (!navigator.geolocation) {
      alert("La geolocalización no es compatible con este navegador.");
      return;
    }

    // Limpiar si ya hay un observador activo
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = [latitude, longitude];
        setUserPosition(newPos);
        console.log("Posición actualizada:", newPos);
      },
      (error) => {
        console.error("Error de geolocalización:", error);
        if (error.code === 1) {
          alert("Permiso de ubicación denegado. Por favor, habilita la ubicación en tu navegador para usar el seguimiento en tiempo real y la navegación.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleLocate = () => {
    startWatchingLocation();

    // Si tenemos posición, volamos hacia ella
    if (userPosition && mapRef.current) {
      mapRef.current.flyTo(userPosition, 16, { animate: true, duration: 1.5 });
    } else {
      // Si no, forzamos un getCurrentPosition rápido solo para el flyTo inicial
      navigator.geolocation.getCurrentPosition((pos) => {
        const p = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(p);
        if (mapRef.current) mapRef.current.flyTo(p, 16, { animate: true, duration: 1.5 });
      });
    }
  };

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  useEffect(() => { }, []);

  const legendItems = [
    { color: "bg-primary", label: "Grandstands" },
    { color: "bg-indigo-500", label: "Fan Zone" },
    { color: "bg-slate-500", label: "WC" },
    { color: "bg-orange-400", label: "Food" },
    { color: "bg-blue-500", label: "You" },
  ];


  return (
    <div
      className="relative h-[100dvh] w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-display overflow-hidden select-none transition-colors duration-300 overscroll-none"
      style={{ overscrollBehavior: 'none', touchAction: 'none' }} // Prevent pull-to-refresh / overscroll
    >
      {/* Background Map */}
      <div className="absolute inset-0 z-0 map-container-bg w-full h-full">
        <MapContainer
          ref={mapRef}
          center={initialCenter}
          zoom={17}
          minZoom={3}
          maxZoom={21}
          scrollWheelZoom={true}
          className="w-full h-full outline-none"
          zoomControl={false}
          attributionControl={false}
        >
          <MapEvents setCurrentZoom={setCurrentZoom} />
          {console.log("DEBUG Map.jsx: currentZoom =", currentZoom, "| focusedListId =", focusedListId)}
          <MapLayers
            isSatelliteView={isSatelliteView}
            currentZoom={currentZoom}
            userLists={(() => {
              // Si la lista enfocada no está en userLists (es de descubrir), la añadimos temporalmente para que MapLayers la pinte
              const focusedInUser = userLists.find(l => l.id_lista === focusedListId);
              if (focusedListId && !focusedInUser) {
                const discoverList = discoverLists.find(l => l.id_lista === focusedListId);
                if (discoverList) return [...userLists, discoverList];
              }
              return userLists;
            })()}
            focusedListId={focusedListId}
            handleFocusList={handleFocusList}
            otherListGeometries={otherListGeometries}
            generalMarkers={markers}
            activeFilter={activeFilter}
            userPosition={userPosition}
            handleGetRouteToPoi={handleGetRouteToPoi}
            userToPoiRoute={userToPoiRoute}
            onPoiClick={(marker) => navigate(`/poi/${marker.id}`)}
          />

          {/* Location Focus Circle */}
          {userPosition && (
            <Circle
              center={userPosition}
              radius={20}
              pathOptions={{ fillColor: '#3b82f6', fillOpacity: 0.1, color: '#3b82f6', weight: 1 }}
            />
          )}
        </MapContainer>

        {/* Panel Inferior de Detalles de la Ruta (Bottom Sheet) */}
        {focusedListId && (
          <div className="fixed bottom-0 left-0 right-0 z-[1002] pointer-events-auto animate-slide-up">
            <div className="bg-slate-950/95 backdrop-blur-3xl border-t border-white/10 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[35vh]">

              {/* Drag Handle & Header */}
              <div className="flex flex-col items-center py-3 cursor-pointer" onClick={() => { setFocusedListId(null); setUserToPoiRoute(null); }}>
                <div className="w-10 h-1 bg-white/20 rounded-full mb-1"></div>
                <div className="w-full px-6 flex justify-between items-center">
                  <h3 className="text-[10px] font-black text-white italic tracking-widest uppercase">Navegando Ruta</h3>
                  <button onClick={() => { setFocusedListId(null); setUserToPoiRoute(null); }} className="w-8 h-8 bg-white/5 text-white rounded-full flex items-center justify-center hover:bg-white/10 transition-all border border-white/10">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              </div>

              <div className="px-6 pb-6 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Info de la Lista */}
                  <div className="space-y-3">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 flex flex-col items-end">
                        <span className="text-[8px] font-black uppercase text-pink-500 tracking-tighter italic">Total</span>
                        <span className="text-sm font-black text-white italic">
                          {otherListGeometries[focusedListId]?.distance
                            ? (otherListGeometries[focusedListId].distance / 1000).toFixed(1) + " km"
                            : "--"
                          }
                        </span>
                      </div>

                      <h4 className="text-lg font-black text-white italic mb-1 leading-tight pr-16">{userLists.find(l => l.id_lista === focusedListId)?.nombre}</h4>
                      <p className="text-[9px] text-white/40 leading-relaxed italic mb-3">
                        {userLists.find(l => l.id_lista === focusedListId)?.descripcion || "Explora este itinerario."}
                      </p>

                      {userToPoiRoute && (
                        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-400 text-sm animate-pulse">navigation</span>
                            <span className="text-[10px] font-bold text-blue-400 uppercase italic">Navegando...</span>
                          </div>
                          <span className="text-xs font-black text-white italic">
                            {(userToPoiRoute.distance / 1000).toFixed(2)} km restantes
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={handleGoToNearestPoi}
                        className="w-full bg-indigo-500 text-white py-3 rounded-xl text-[9px] font-black uppercase shadow-xl flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">navigation</span>
                        Ir a la ruta
                      </button>

                      {/* Navigation to first POI */}
                      <button
                        onClick={() => handleGoToFirstPoi(userLists.find(l => l.id_lista === focusedListId) || discoverLists.find(l => l.id_lista === focusedListId))}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl text-[9px] font-black uppercase shadow-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">directions</span>
                        Cómo llegar
                      </button>

                      {/* Include in My Lists (if not already owned) */}
                      {!userLists.find(l => l.id_lista === focusedListId) && (
                        <button
                          onClick={() => handleIncludeInMyLists(discoverLists.find(l => l.id_lista === focusedListId))}
                          className="w-full bg-pink-600 text-white py-3 rounded-xl text-[9px] font-black uppercase shadow-xl flex items-center justify-center gap-2 hover:bg-pink-700 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">add_circle</span>
                          Incluir en mis listas
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Itinerario */}
                  <div className="space-y-3">
                    <h5 className="text-[8px] font-black uppercase text-white/30 tracking-[0.2em] px-1 italic">Itinerario sugerido</h5>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 no-scrollbar">
                      {userLists.find(l => l.id_lista === focusedListId)?.pois.map((poi, idx) => (
                        <div
                          key={poi.id_poi}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-pink-500/30 transition-all group cursor-pointer active:scale-95"
                          onClick={() => handleGetRouteToPoi(poi)}
                        >
                          <div className="w-6 h-6 bg-pink-500 rounded-lg flex items-center justify-center text-[10px] font-black text-white">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h6 className="text-[11px] font-bold text-white truncate">{poi.nombre}</h6>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* UI Overlay */}
      <Header />
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between">
        {/* Top Area — empty, header is handled by fixed Header component */}
        <div className="w-full pt-32 px-5 pointer-events-auto flex flex-col items-center gap-4">
        </div>
        {/* Bottom Area */}
        <div className="w-full pointer-events-auto flex flex-col items-center">

          {/* Floating Actions Stack */}
          <div className="fixed bottom-24 right-6 z-[110] pointer-events-auto flex flex-col gap-3">
            {/* "centrar" button moved above + */}
            <button
              onClick={handleLocate}
              className="w-16 h-16 bg-white text-black rounded-full shadow-xl flex items-center justify-center hover:bg-gray-100 transition-all hover:scale-110 active:scale-95 border border-black/5"
            >
              <span className="material-symbols-outlined text-2xl">my_location</span>
            </button>

            {/* Create List Button */}
            <Link
              to="/create-list"
              className="w-16 h-16 rounded-full flex items-center justify-center bg-pink-500 text-white shadow-[0_8px_25px_-5px_rgba(236,72,153,0.5)] hover:bg-pink-600 transition-all hover:scale-110 active:scale-95"
            >
              <span className="material-symbols-outlined text-4xl">add</span>
            </Link>
          </div>


          {/* Bottom Sheet Modal */}
          <div className="w-full bg-white/90 dark:bg-black/90 rounded-t-[2rem] pt-1 pb-24 px-5 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] relative backdrop-blur-lg">

            {/* Drag Handle */}
            <div
              className="w-full flex justify-center cursor-pointer py-1.5"
              onClick={() => setIsSheetExpanded(!isSheetExpanded)}
            >
              <div className="w-10 h-1 bg-gray-300 dark:bg-white/30 rounded-full"></div>
            </div>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isSheetExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>

              {/* My Lists Section */}
              <div className="mb-8">
                <h2 className="text-black dark:text-white font-bold text-lg mb-4 tracking-tight uppercase italic text-[11px]">Mis Listas</h2>
                <div className="w-full overflow-x-auto no-scrollbar -mx-5 px-5">
                  <div className="flex gap-4 min-w-max">
                    {userLists.length > 0 ? userLists.map(c => (
                      <div
                        key={c.id_lista}
                        className={`relative w-36 h-48 rounded-2xl overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-800 cursor-pointer transition-transform hover:scale-105 active:scale-95 ${focusedListId === c.id_lista ? 'ring-4 ring-pink-500 shadow-xl scale-105' : ''}`}
                        onClick={() => handleFocusList(c)}
                      >
                        <img
                          src={c.imagen_url ? `http://localhost:3000${c.imagen_url}` : 'https://images.unsplash.com/photo-1498855926480-d98e83099315?w=300&q=80'}
                          alt={c.nombre}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-3">
                          <span className="text-white font-bold text-[14px] leading-tight">{c.nombre}</span>
                        </div>
                      </div>
                    )) : (
                      <div className="w-full text-center py-10 text-slate-400 text-sm italic">
                        No has creado ninguna lista todavía.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Discover Lists Section */}
              <div className="mb-8">
                <h2 className="text-black dark:text-white font-bold text-lg mb-4 tracking-tight uppercase italic text-[11px]">Listas para descubrir</h2>
                <div className="w-full overflow-x-auto no-scrollbar -mx-5 px-5">
                  <div className="flex gap-4 min-w-max">
                    {discoverLists.length > 0 ? discoverLists.map(c => (
                      <div
                        key={c.id_lista}
                        className={`relative w-36 h-48 rounded-2xl overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-800 cursor-pointer transition-transform hover:scale-105 active:scale-95 ${focusedListId === c.id_lista ? 'ring-4 ring-blue-500 shadow-xl scale-105' : ''}`}
                        onClick={() => handleFocusList(c)}
                      >
                        <img
                          src={c.imagen_url ? `http://localhost:3000${c.imagen_url}` : 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&q=80'}
                          alt={c.nombre}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-3">
                          <span className="text-white text-[10px] font-medium opacity-70">by {c.usuario_nombre || 'comunidad'}</span>
                          <span className="text-white font-bold text-[14px] leading-tight mt-0.5">{c.nombre}</span>
                        </div>
                      </div>
                    )) : (
                      <div className="w-full text-center py-10 text-slate-400 text-sm italic">
                        No hay listas públicas todavía.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Curators Section */}
              <div>
                <h2 className="text-black dark:text-white font-bold text-lg mb-4 tracking-tight uppercase italic text-[11px]">Usuarios para descubrir</h2>
                <div className="w-full overflow-x-auto no-scrollbar -mx-5 px-5">
                  <div className="flex gap-6 min-w-max">
                    {realCurators.map(c => (
                      <div key={c.id_usuario} className="flex flex-col items-center gap-2 w-16">
                        <div className="relative">
                          <UserAvatar user={{ 
                            foto_perfil: c.foto_perfil, 
                            nombre: c.nombre 
                          }} className="w-16 h-16" />
                        </div>
                        <span className="text-black dark:text-white text-[10px] font-bold mt-1 text-center truncate w-full uppercase italic">
                          {c.nombre}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Map;
