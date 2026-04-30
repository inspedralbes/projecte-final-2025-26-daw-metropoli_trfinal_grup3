import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polyline,
} from "react-leaflet";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../layouts/Navbar"; // Import the new Navbar component
import Header from "../../layouts/Header"; // Import the global header
import UserAvatar from "../../components/UserAvatar";
import { getPois, getRoute, getCategorias, getListas } from "../../services/communicationManager";
import socket from "../../services/socketManager";
import "leaflet/dist/leaflet.css";
import L from "leaflet";




import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons matching the aesthetic (circular image with text below)
const createCustomIcon = (label, imageUrl) => {
  return L.divIcon({
    className: "custom-map-icon",
    html: `
      <div class="flex flex-col items-center pointer-events-auto" style="width: 120px; transform: translateX(-40px);">
        <div class="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden bg-white">
          <img src="${imageUrl || 'https://via.placeholder.com/40'}" class="w-full h-full object-cover" />
        </div>
        <div class="mt-1 bg-white/80 dark:bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded text-black dark:text-white text-[10px] font-bold uppercase tracking-tight text-center leading-tight shadow-sm" style="max-width: 100%; word-wrap: break-word;">
          ${label || ''}
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
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
        const res = await getListas();
        if (res.success) setUserLists(res.data);
      } catch (err) {
        console.error("Error fetching lists:", err);
      }
    };

    fetchPois();
    fetchUserLists();

    // Listen to real-time map updates from WebSockets
    socket.on('mapa_actualizado', () => {
      console.log("WebSocket Notice: Map updated! Refreshing POIs...");
      fetchPois();
      fetchUserLists();
    });

    return () => {
      socket.off('mapa_actualizado');
    };
  }, []);

  // Auto-locate on startup
  useEffect(() => {
    handleLocate();
  }, []);

  const [userLists, setUserLists] = useState([]);


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

  const curations = [
    { id: 1, title: 'chinatown & les', user: '@tasha', image: 'https://images.unsplash.com/photo-1498855926480-d98e83099315?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
    { id: 2, title: 'nyc', user: '@martini22', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
    { id: 3, title: 'brooklyn vibes', user: '@jake', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' }
  ];

  const curators = [
    { id: 1, name: 'eliza', score: 92, image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 2, name: 'gndclouds', score: 68, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 3, name: 'michelle', score: 44, image: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { id: 4, name: 'weber', score: 42, image: 'https://randomuser.me/api/portraits/men/46.jpg' }
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
          minZoom={15}
          maxZoom={19}
          scrollWheelZoom={true}
          className="w-full h-full outline-none"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            key={isSatelliteView ? "satellite" : "standard"}
            url={isSatelliteView
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            }
            attribution={isSatelliteView
              ? "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS..."
              : "&copy; OSM &copy; CARTO"
            }
          />
          {/* <ImageOverlay
            url="/circuit_map_final.png"
            bounds={imageBounds}
            opacity={0.7}
            zIndex={10}
          /> */}

          {/* Dynamic Markers rendering (currently empty) */}
          {/* Dijkstra Route rendering */}
          {route && (
            <>
              {/* Connector line from user to the path */}
              {userPosition && (
                <Polyline
                  positions={[userPosition, route[0]]}
                  color="#3b82f6"
                  weight={4}
                  opacity={0.6}
                  dashArray="5, 10"
                />
              )}
              {/* Main path */}
              <Polyline positions={route} color="#3b82f6" weight={6} opacity={0.9} />
            </>
          )}


          {/* Dynamic Markers rendering — si hay filtro activo, solo mostramos los de esa categoria */}
          {markers.map((marker, index) => {
            // Si hay un filtro activo y este marker no es de esa categoria, lo saltamos
            if (activeFilter !== null && marker.id_categoria !== activeFilter) {
              return null;
            }

            const placeholderImages = [
              "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&q=80",
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&q=80",
              "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&q=80",
              "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&q=80",
              "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=100&q=80"
            ];
            const randomImg = placeholderImages[index % placeholderImages.length];

            return (
              <Marker
                key={marker.id || index}
                position={marker.position}
                icon={createCustomIcon(marker.name, randomImg)}
                eventHandlers={{
                  click: () => {
                    setSelectedFeature(marker);
                  }
                }}
              >
              </Marker>
            );
          })}
          {userPosition && (
            <Marker position={userPosition} icon={UserIcon}>
              <Popup>You are here</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* UI Overlay */}
      <Header />
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between">
        {/* Top Area — empty, header is handled by fixed Header component */}
        <div className="w-full pt-32 px-5 pointer-events-auto flex flex-col items-center gap-4">
        </div>

        {/* Bottom Area */}
        <div className="w-full pointer-events-auto flex flex-col items-center">

          {/* "centrar" button */}
          <button onClick={handleLocate} className="bg-white text-black font-bold text-sm px-5 py-2.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center gap-2 mb-4 hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined text-lg">my_location</span>
            centrar
          </button>

          {/* Floating Action Button for Creating List - Fixed position for visibility */}
          <div className="fixed bottom-24 right-6 z-[110] pointer-events-auto">
            <Link
              to="/create-list"
              className="w-16 h-16 rounded-full flex items-center justify-center bg-pink-500 text-white shadow-[0_8px_25px_-5px_rgba(236,72,153,0.5)] hover:bg-pink-600 transition-all hover:scale-110 active:scale-95"
            >
              <span className="material-symbols-outlined text-4xl">add</span>
            </Link>
          </div>

          {/* Filters Bar */}
          <div className="w-full overflow-x-auto no-scrollbar px-5 mb-4">
            <div className="flex gap-2 min-w-max">
              <button className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-md border border-gray-800">
                <span className="material-symbols-outlined text-sm">public</span>
                discover
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              <button className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-md">
                <span className="material-symbols-outlined text-sm text-gray-500">restaurant</span>
                eat
              </button>
              <button className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-md">
                <span className="material-symbols-outlined text-sm text-gray-500">local_cafe</span>
                café
              </button>
              <button className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-md">
                <span className="material-symbols-outlined text-sm text-gray-500">local_bar</span>
                bar
              </button>

            </div>
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

              {/* Curations Section */}
              <div className="mb-8">
                <h2 className="text-black dark:text-white font-bold text-lg mb-4 tracking-tight">curations for you</h2>
                <div className="w-full overflow-x-auto no-scrollbar -mx-5 px-5">
                  <div className="flex gap-4 min-w-max">
                    {userLists.length > 0 ? userLists.map(c => (
                      <div key={c.id_lista} className="relative w-36 h-48 rounded-2xl overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-800">
                        <img src={c.image || 'https://images.unsplash.com/photo-1498855926480-d98e83099315?w=300&q=80'} alt={c.nombre} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                          <span className="text-white text-[10px] font-medium opacity-70">User #{c.id_usuario}</span>
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
                <h2 className="text-black dark:text-white font-bold text-lg mb-4 tracking-tight">curators for you</h2>
                <div className="w-full overflow-x-auto no-scrollbar -mx-5 px-5">
                  <div className="flex gap-6 min-w-max">
                    {curators.map(c => (
                      <div key={c.id} className="flex flex-col items-center gap-2 w-16">
                        <div className="relative">
                          <UserAvatar user={{ avatar: c.image, nombre: c.name }} className="w-16 h-16" />
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 text-black dark:text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow border border-gray-100 dark:border-gray-700 flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[10px]">visibility</span>
                            {c.score}
                          </div>
                        </div>
                        <span className="text-black dark:text-white text-xs font-medium mt-2 text-center truncate w-full">{c.name}</span>
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
