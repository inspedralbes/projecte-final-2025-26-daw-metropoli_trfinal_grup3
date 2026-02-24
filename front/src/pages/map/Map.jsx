import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polyline,
} from "react-leaflet";
import { Link } from "react-router-dom";
import Navbar from "../../layouts/Navbar"; // Import the new Navbar component
import communicationManager from "../../services/communicationManager"; // API
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons using Material Symbols for Light Mode
const createCustomIcon = (iconName, bgColor) =>
  L.divIcon({
    className: "custom-map-icon",
    html: `<div class="${bgColor} text-white p-2 rounded-full shadow-md border border-white/20 flex items-center justify-center w-8 h-8">
            <span class="material-symbols-outlined text-sm leading-none">${iconName}</span>
         </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

// Icons available for future use
const GrandstandIcon = createCustomIcon('event_seat', 'bg-primary');
const FanZoneIcon = createCustomIcon('stars', 'bg-indigo-500');
const WCIcon = createCustomIcon('wc', 'bg-slate-600');
const FoodIcon = createCustomIcon('restaurant', 'bg-orange-400');

// User Location Icon
const UserIcon = L.divIcon({
  className: "user-location-icon",
  html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const Map = () => {
  const mapRef = useRef(null);
  const initialCenter = [41.57, 2.2611];
  const [userPosition, setUserPosition] = useState(null);
  const [isLegendOpen, setIsLegendOpen] = useState(false); // State for collapsible legend
  const [isSatelliteView, setIsSatelliteView] = useState(false); // State for satellite view toggle

  // eslint-disable-next-line no-unused-vars
  const [imageBounds, setImageBounds] = useState([
    [41.57 - 0.008, 2.2611 - 0.012],
    [41.57 + 0.008, 2.2611 + 0.012],
  ]);

  // State for future logic
  const [selectedFeature, setSelectedFeature] = useState(null); // To store clicking on a marker
  const [markers, setMarkers] = useState([]); // Empty for now, to be populated by API/logic
  const [route, setRoute] = useState(null); // Array of [lat, lng] para Dijkstra Polyline

  useEffect(() => {
    // Fetch POIs dynamically
    const fetchPois = async () => {
      try {
        const data = await communicationManager.getPois();

        if (data.success && data.data) {
          const fetchedMarkers = data.data.map(poi => {
            let icon = DefaultIcon;
            if (poi.id_categoria === 1) icon = GrandstandIcon;
            else if (poi.id_categoria === 2) icon = FanZoneIcon;
            else if (poi.id_categoria === 3) icon = WCIcon;
            else if (poi.id_categoria === 4) icon = FoodIcon;

            return {
              id: poi.id_poi,
              position: [parseFloat(poi.latitud), parseFloat(poi.longitud)],
              name: poi.nombre,
              description: poi.descripcion,
              icon: icon
            };
          });
          setMarkers(fetchedMarkers);
        }
      } catch (error) {
        console.error("Error fetching POIs:", error);
      }
    };

    fetchPois();
  }, []);

  // Transformation of Dijkstra Output to Leaflet Polyline Coordinates
  const fetchRoute = async (origenId, destinoId) => {
    try {
      const result = await communicationManager.getRoute(origenId, destinoId);

      if (result.success && result.data && result.data.detalles) {
        // TRANSFORMAR RESULTADO: El endpoint devuelve detalles (detalles is array with objects having latitud, longitud)
        const polylineCoords = result.data.detalles.map(nodo => [
          parseFloat(nodo.latitud),
          parseFloat(nodo.longitud)
        ]);
        setRoute(polylineCoords);
      }
    } catch (error) {
      console.error("Error fetching Route:", error);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = [latitude, longitude];
        setUserPosition(newPos);

        // Fly to user location using the map instance
        if (mapRef.current) {
          mapRef.current.flyTo(newPos, 16, {
            animate: true,
            duration: 1.5
          });
        }
      },
      (error) => { console.error(error); alert("Unable to retrieve your location."); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

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
          zoom={15}
          minZoom={13}
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
          {route && <Polyline positions={route} color="#3b82f6" weight={5} opacity={0.8} dashArray="10, 10" />}

          {/* Dynamic Markers rendering */}
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              icon={marker.icon}
              eventHandlers={{
                click: () => setSelectedFeature(marker),
              }}
            >
              <Popup>
                <div className="text-center font-display">
                  <h3 className="font-bold text-slate-800">{marker.name}</h3>
                  <p className="text-xs text-slate-500 mb-2">{marker.description}</p>
                  <button
                    onClick={() => {
                      // Ejemplo de ruta desde el POI id 1 (entrada) hasta este POI
                      // fetchRoute(1, marker.id); 
                    }}
                    className="mt-1 text-xs bg-primary text-white px-3 py-1.5 rounded shadow hover:bg-red-600 transition-colors"
                  >
                    Navegar hasta aquí
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
          {userPosition && (
            <Marker position={userPosition} icon={UserIcon}>
              <Popup>You are here</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* UI Overlay */}
      <div className="relative z-30 flex flex-col h-full pointer-events-none">
        {/* Top Bar */}
        <div className="w-full pt-6 px-5 pointer-events-auto touch-none">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Link to="/">
                <img
                  src="/logo/logo1.png"
                  alt="Circuit Logo"
                  className="h-12 w-auto object-contain block dark:hidden"
                />
                <img
                  src="/logo/logo.png"
                  alt="Circuit Logo"
                  className="h-12 w-auto object-contain hidden dark:block"
                />
              </Link>
            </div>
            <Link
              to="/profile"
              className="w-10 h-10 rounded-full border-2 border-primary p-0.5 overflow-hidden shadow-sm bg-white dark:bg-slate-900"
            >
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="w-full md:max-w-sm">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl flex items-center px-4 py-3.5 gap-3 pointer-events-auto border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <span className="material-symbols-outlined text-primary text-xl">search</span>
              <input
                className="bg-transparent border-none outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 w-full text-sm font-medium focus:ring-0 p-0"
                placeholder="Search Grandstand, Food, WC..."
                type="text"
              />
            </div>
          </div>
        </div>

        {/* Legend Toggle Tab (Left Side) */}
        <button
          onClick={() => setIsLegendOpen(!isLegendOpen)}
          className={`absolute top-1/2 -translate-y-1/2 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-700 dark:text-slate-200 py-6 px-1.5 rounded-r-2xl border-y border-r border-slate-200 dark:border-slate-800 shadow-xl active:scale-95 transition-all duration-300 flex items-center justify-center pointer-events-auto ${isLegendOpen ? 'translate-x-[16rem]' : 'translate-x-0'} left-0`}
          aria-label="Toggle Legend"
        >
          <span className="material-symbols-outlined text-xl">{isLegendOpen ? "chevron_left" : "chevron_right"}</span>
        </button>

        {/* Collapsible Sidebar Legend */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-300 z-40 pointer-events-auto flex flex-col justify-center px-6 ${isLegendOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest font-bold text-slate-400 block mb-6 border-b border-slate-100 dark:border-slate-800 pb-2">
              Map Legend
            </span>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-sm"></div>
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Grandstands</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm"></div>
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Fan Zone</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center group-hover:bg-slate-500/20 transition-colors">
                  <div className="w-3 h-3 rounded-full bg-slate-500 shadow-sm"></div>
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">WC</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-orange-400/10 flex items-center justify-center group-hover:bg-orange-400/20 transition-colors">
                  <div className="w-3 h-3 rounded-full bg-orange-400 shadow-sm"></div>
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Food</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">You</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow"></div>

        {/* Right Side Controls (FABs) */}
        <div className="absolute right-5 bottom-32 flex flex-col gap-4 pointer-events-auto z-40">
          <Link
            to="/escaneo"
            className="bg-indigo-600 text-white p-3.5 rounded-xl shadow-lg shadow-indigo-600/30 active:scale-95 transition-transform flex items-center justify-center animate-bounce"
          >
            <span className="material-symbols-outlined text-2xl">
              qr_code_scanner
            </span>
          </Link>
          <button
            onClick={handleLocate}
            className="bg-primary text-white p-3.5 rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-transform flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-2xl">my_location</span>
          </button>
          <button
            onClick={() => setIsSatelliteView(!isSatelliteView)}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-700 dark:text-slate-200 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg active:scale-95 transition-transform flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-2xl">{isSatelliteView ? "map" : "satellite_alt"}</span>
          </button>
        </div>

        {/* Info Card */}
        {selectedFeature && (
          <div className="px-4 mb-24 pointer-events-auto">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">{selectedFeature.name || "Selected Item"}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selectedFeature.description || "Details unavailable"}</p>
                </div>
                <button onClick={() => setSelectedFeature(null)} className="text-slate-400 hover:text-slate-600">
                  <span className="material-icons">close</span>
                </button>
              </div>
              <button className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                <span className="material-icons text-sm">navigation</span>
                Navigate
              </button>
            </div>
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
};

export default Map;
