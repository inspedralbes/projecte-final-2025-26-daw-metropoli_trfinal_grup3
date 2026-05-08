import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
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
import Toast from "../../components/Toast";
import MapLayers from "../../components/MapLayers";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMapEvents } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";

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
  const { t } = useTranslation();
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
  const [toast, setToast] = useState(null);

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

  // Handle POI focusing from URL search params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const poiId = queryParams.get('poi');
    
    if (poiId && markers.length > 0) {
      const poi = markers.find(m => m.id === parseInt(poiId));
      if (poi && mapRef.current) {
        setTimeout(() => {
          mapRef.current.flyTo(poi.position, 18, { animate: true, duration: 1.5 });
          // Optionally show details
          setSelectedFeature(poi);
        }, 600);
      }
    }
  }, [location.search, markers]);

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
        setToast({ message: "¡Lista añadida a tus listas!", type: "success" });
        const userListsRes = await getUsuarioListas(user.id_usuario);
        if (userListsRes.success) setUserLists(userListsRes.data);
      }
    } catch (error) {
      console.error("Error copying list:", error);
      setToast({ message: "Hubo un error al guardar la lista.", type: "error" });
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

  // Mini Components for the Drawer
  const MiniRouteCard = ({ route, onFocus }) => (
    <div 
      className={`relative min-w-[280px] h-32 rounded-3xl overflow-hidden shadow-md group cursor-pointer active:scale-95 transition-all ${focusedListId === route.id_lista ? 'ring-2 ring-primary' : ''}`}
      onClick={() => onFocus(route)}
    >
      <img 
        src={route.imagen_url ? (route.imagen_url.startsWith('http') ? route.imagen_url : `http://localhost:3000${route.imagen_url}`) : 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400&q=80'} 
        alt={route.nombre} 
        className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
        <div className="flex justify-between items-end">
          <h4 className="text-white text-xs font-black truncate pr-2 font-display">{route.nombre}</h4>
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg border border-primary/20 group-hover:border-primary transition-colors">
            <span className="material-symbols-outlined text-black text-[18px] font-bold">arrow_forward</span>
          </div>
        </div>
      </div>
    </div>
  );

  const MiniDiscoverCard = ({ col, onFocus }) => (
    <div 
      className={`relative min-w-[140px] h-40 rounded-[3rem] overflow-hidden shadow-md group cursor-pointer active:scale-95 transition-all ${focusedListId === col.id_lista ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onFocus(col)}
    >
      <img 
        src={col.imagen_url ? (col.imagen_url.startsWith('http') ? col.imagen_url : `http://localhost:3000${col.imagen_url}`) : 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=400&q=80'} 
        className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" 
      />
      <div className="absolute inset-0 bg-black/50 p-4 flex flex-col justify-between items-center text-center">
        <UserAvatar user={{ avatar: col.foto_perfil, nombre: col.usuario_nombre || col.nombre_usuario || "Comunidad" }} className="w-10 h-10 ring-2 ring-white/20" />
        <div>
          <h4 className="text-white text-[10px] font-bold leading-tight font-display">{col.nombre}</h4>
          <p className="text-[8px] text-white/40 font-display mt-0.5">por {col.usuario_nombre || col.nombre_usuario || "Comunidad"}</p>
        </div>
      </div>
    </div>
  );

  const legendItems = [
    { color: "bg-primary", label: t("home.dining", "Bares") },
    { color: "bg-indigo-500", label: t("home.fanZone", "Esdeveniments") },
    { color: "bg-slate-500", label: "WC" },
    { color: "bg-orange-400", label: "Food" },
    { color: "bg-blue-500", label: "You" },
  ];


  return (
    <div
      className="relative h-[100dvh] w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-display overflow-hidden select-none md:pl-20 transition-colors duration-300 overscroll-none flex"
      style={{ overscrollBehavior: 'none', touchAction: 'none' }} // Prevent pull-to-refresh / overscroll
    >
      {/* DESKTOP SIDEBAR: EXPLORER (Left side) */}
      <aside className="hidden md:flex flex-col w-80 bg-white dark:bg-black border-r border-gray-100 dark:border-white/5 pt-24 z-[40] transition-all duration-300">
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
          <section>
            <h2 className="text-sm font-bold text-gray-500 dark:text-white mb-4 px-1 lowercase">
              les meves rutes
            </h2>
            <div className="space-y-4">
              {userLists.length > 0 ? (
                userLists.map(route => (
                  <div 
                    key={route.id_lista}
                    onClick={() => handleFocusList(route)}
                    className={`group relative h-28 rounded-3xl overflow-hidden cursor-pointer transition-all ${focusedListId === route.id_lista ? 'ring-2 ring-primary scale-[0.98]' : 'hover:scale-[1.02]'}`}
                  >
                    <img 
                      src={route.imagen_url ? (route.imagen_url.startsWith('http') ? route.imagen_url : `http://localhost:3000${route.imagen_url}`) : 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400&q=80'} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                      <h4 className="text-white text-sm font-bold truncate">{route.nombre}</h4>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs opacity-40 italic">Encara no has creat cap llista.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-500 dark:text-white mb-4 px-1 lowercase">
              descobrir
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {discoverLists.map(col => (
                <div 
                  key={col.id_lista}
                  onClick={() => handleFocusList(col)}
                  className={`group relative aspect-square rounded-3xl overflow-hidden cursor-pointer transition-all ${focusedListId === col.id_lista ? 'ring-2 ring-blue-500 scale-[0.98]' : 'hover:scale-[1.02]'}`}
                >
                  <img 
                    src={col.imagen_url ? (col.imagen_url.startsWith('http') ? col.imagen_url : `http://localhost:3000${col.imagen_url}`) : 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=400&q=80'} 
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-black/40 p-3 flex flex-col justify-between items-center text-center">
                    <UserAvatar user={{ avatar: col.foto_perfil, nombre: col.usuario_nombre || col.nombre_usuario }} className="w-8 h-8" />
                    <h4 className="text-white text-[10px] font-bold leading-tight">{col.nombre}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>

      {/* Main Map Area */}
      <div className="relative flex-1 h-full">
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

      {/* DESKTOP ROUTE PANEL (Right side or floating) */}
      <AnimatePresence>
        {focusedListId && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="hidden md:flex fixed top-24 right-6 bottom-24 w-96 z-[1002] pointer-events-none"
          >
            <div className="w-full bg-white dark:bg-slate-900/95 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 flex flex-col overflow-hidden pointer-events-auto">
              <div className="p-8 pb-4 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary italic">Detalls de la Ruta</h3>
                <button 
                  onClick={() => { setFocusedListId(null); setUserToPoiRoute(null); }}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-8 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-tight">
                    {userLists.find(l => l.id_lista === focusedListId)?.nombre || discoverLists.find(l => l.id_lista === focusedListId)?.nombre}
                  </h2>
                  <p className="text-sm opacity-60 italic">
                    {userLists.find(l => l.id_lista === focusedListId)?.descripcion || "Explora aquest itinerari seleccionat."}
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 bg-gray-50 dark:bg-white/5 p-4 rounded-3xl border border-gray-100 dark:border-white/5">
                    <p className="text-[10px] font-bold uppercase opacity-40 mb-1">Distància</p>
                    <p className="text-xl font-black italic">
                      {otherListGeometries[focusedListId]?.distance
                        ? (otherListGeometries[focusedListId].distance / 1000).toFixed(1) + " km"
                        : "--"}
                    </p>
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-white/5 p-4 rounded-3xl border border-gray-100 dark:border-white/5">
                    <p className="text-[10px] font-bold uppercase opacity-40 mb-1">Punts</p>
                    <p className="text-xl font-black italic">
                      {(userLists.find(l => l.id_lista === focusedListId) || discoverLists.find(l => l.id_lista === focusedListId))?.pois.length || 0}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleGoToNearestPoi}
                    className="w-full bg-primary text-primary-text py-5 rounded-[2rem] font-black uppercase italic tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <span className="material-symbols-outlined">navigation</span>
                    Començar Ruta
                  </button>
                  
                  {!userLists.find(l => l.id_lista === focusedListId) && (
                    <button 
                      onClick={() => handleIncludeInMyLists(discoverLists.find(l => l.id_lista === focusedListId))}
                      className="w-full bg-white dark:bg-white/5 text-black dark:text-white py-4 rounded-[2rem] font-bold border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">add_circle</span>
                      Guardar a les meves llistes
                    </button>
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Itinerari</h4>
                  <div className="space-y-3">
                    {(userLists.find(l => l.id_lista === focusedListId) || discoverLists.find(l => l.id_lista === focusedListId))?.pois.map((poi, idx) => (
                      <div 
                        key={poi.id_poi}
                        onClick={() => handleGetRouteToPoi(poi)}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-3xl border border-transparent hover:border-primary/30 cursor-pointer transition-all group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-primary text-primary-text flex items-center justify-center text-xs font-black italic">
                          {idx + 1}
                        </div>
                        <span className="flex-1 font-bold text-sm truncate">{poi.nombre}</span>
                        <span className="material-symbols-outlined text-gray-300 dark:text-white/10 group-hover:text-primary transition-colors">arrow_forward</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Panel Inferior de Detalles de la Ruta (Bottom Sheet) - MOBILE ONLY */}
        {focusedListId && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-[1002] pointer-events-auto animate-slide-up">
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

                      {(() => {
                        const currentList = userLists.find(l => l.id_lista === focusedListId) 
                                         || discoverLists.find(l => l.id_lista === focusedListId)
                                         || (location.state?.focusedList?.id_lista === focusedListId ? location.state.focusedList : null);
                        return (
                          <>
                            <h4 className="text-lg font-black text-white italic mb-1 leading-tight pr-16">{currentList?.nombre}</h4>
                            <p className="text-[9px] text-white/40 leading-relaxed italic mb-3">
                              {currentList?.descripcion || "Explora este itinerario."}
                            </p>
                          </>
                        );
                      })()}

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
                        onClick={() => {
                          const currentList = userLists.find(l => l.id_lista === focusedListId) 
                                           || discoverLists.find(l => l.id_lista === focusedListId)
                                           || (location.state?.focusedList?.id_lista === focusedListId ? location.state.focusedList : null);
                          if (currentList) handleGoToFirstPoi(currentList);
                        }}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl text-[9px] font-black uppercase shadow-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">directions</span>
                        Cómo llegar
                      </button>

                      {/* Include in My Lists (if not already owned) */}
                      {!userLists.find(l => l.id_lista === focusedListId) && (
                        <button
                          onClick={() => {
                            const currentList = discoverLists.find(l => l.id_lista === focusedListId)
                                             || (location.state?.focusedList?.id_lista === focusedListId ? location.state.focusedList : null);
                            if (currentList) handleIncludeInMyLists(currentList);
                          }}
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
                      {(() => {
                        const currentList = userLists.find(l => l.id_lista === focusedListId) 
                                         || discoverLists.find(l => l.id_lista === focusedListId)
                                         || (location.state?.focusedList?.id_lista === focusedListId ? location.state.focusedList : null);
                        return currentList?.pois?.map((poi, idx) => (
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
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* UI Overlay */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Header />
      
      {/* DESKTOP CONTROLS: Top corners */}
      <div className="hidden md:flex fixed top-24 right-6 left-96 z-[1001] pointer-events-none flex-col items-end gap-3">
        <button
          onClick={handleLocate}
          className="pointer-events-auto w-12 h-12 bg-white dark:bg-slate-900 text-black dark:text-white rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">my_location</span>
        </button>
        <Link
          to="/create-list"
          className="pointer-events-auto w-12 h-12 bg-primary text-primary-text rounded-2xl shadow-primary-glow flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-2xl font-bold">add</span>
        </Link>
      </div>

      <div className="fixed inset-x-0 bottom-[85px] z-[1001] pointer-events-none md:hidden">
        {/* Floating Pill Buttons Centered Above Drawer */}
        {!focusedListId && (
          <div className="flex justify-center gap-2 px-5 mb-4 translate-y-2">
            <button
              onClick={handleLocate}
              className="pointer-events-auto flex items-center gap-2 bg-white dark:bg-slate-900 text-black dark:text-white px-5 py-2.5 rounded-full shadow-2xl border border-black/5 dark:border-white/5 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-xl">my_location</span>
              <span className="text-[11px] font-black tracking-wider font-display">centrar</span>
            </button>
            <Link
              to="/create-list"
              className="pointer-events-auto w-12 h-12 bg-primary text-primary-text rounded-full shadow-primary-glow flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-2xl font-bold">add</span>
            </Link>
          </div>
        )}

        {/* Drawer Content */}
        <div className="w-full bg-white/90 dark:bg-black/90 rounded-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.2)] backdrop-blur-lg border border-white/10 overflow-hidden font-display pointer-events-auto mx-auto max-w-[95%]">
          {/* Drag Handle (Now click handle) */}
          <div 
            className="w-full flex justify-center py-4 cursor-pointer"
            onClick={() => setIsSheetExpanded(!isSheetExpanded)}
          >
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/40 rounded-full"></div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isSheetExpanded ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-6 pb-6 no-scrollbar overflow-y-auto max-h-[60vh]">
              {/* My Lists Section */}
              <section className="mb-4 mt-2">
                <h2 className="text-[12px] font-black text-black dark:text-white tracking-wide mb-3 px-1 font-display">
                  Mis listas
                </h2>
                <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-2 px-2">
                  {userLists.length > 0 ? (
                    userLists.map(route => (
                      <MiniRouteCard key={route.id_lista} route={route} onFocus={handleFocusList} />
                    ))
                  ) : (
                    <p className="text-sm opacity-40 italic py-4 font-display">No has creado ninguna lista todavía.</p>
                  )}
                </div>
              </section>

              {/* Discover Section */}
              <section className="mb-2">
                <h2 className="text-[12px] font-black text-black dark:text-white tracking-wide mb-3 px-1 font-display">
                  Listas para descubrir
                </h2>
                <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-2 px-2">
                  {discoverLists.length > 0 ? (
                    discoverLists.map(col => (
                      <MiniDiscoverCard key={col.id_lista} col={col} onFocus={handleFocusList} />
                    ))
                  ) : (
                    <p className="text-sm opacity-40 italic py-4 font-display">No hay listas públicas todavía.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Map;
