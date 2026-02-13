import { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons using Material Symbols for Light Mode
const createCustomIcon = (iconName, bgColor) => L.divIcon({
  className: 'custom-map-icon',
  html: `<div class="${bgColor} text-white p-2 rounded-full shadow-md border border-white/20 flex items-center justify-center w-8 h-8">
            <span class="material-symbols-outlined text-sm leading-none">${iconName}</span>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

// Icons available for future use
const GrandstandIcon = createCustomIcon('event_seat', 'bg-primary');
const FanZoneIcon = createCustomIcon('stars', 'bg-indigo-500'); 
const WCIcon = createCustomIcon('wc', 'bg-slate-600');
const FoodIcon = createCustomIcon('restaurant', 'bg-slate-600');

// Car Icon
const CarIcon = L.divIcon({
  className: 'custom-car-icon',
  html: '<div style="font-size: 24px;">🏎️</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// Circuit Bounds for navigation lock
const circuitBounds = [
  [41.5496, 2.2330], // South-West corner
  [41.5855, 2.2858]  // North-East corner
];

const Map = () => {
  const initialCenter = [41.5700, 2.2611];
  const [carPosition, setCarPosition] = useState(initialCenter);
  const [imageBounds, setImageBounds] = useState([
    [41.5700 - 0.008, 2.2611 - 0.012], 
    [41.5700 + 0.008, 2.2611 + 0.012]
  ]);
  
  // State for future logic
  const [selectedFeature, setSelectedFeature] = useState(null); // To store clicking on a marker
  const [markers, setMarkers] = useState([]); // Empty for now, to be populated by API/logic

  useEffect(() => {
    const handleKeyDown = (e) => {
        const carStep = 0.0001;
        switch (e.key) {
          case 'ArrowUp': setCarPosition(([lat, lng]) => [lat + carStep, lng]); break;
          case 'ArrowDown': setCarPosition(([lat, lng]) => [lat - carStep, lng]); break;
          case 'ArrowLeft': setCarPosition(([lat, lng]) => [lat, lng - carStep]); break;
          case 'ArrowRight': setCarPosition(([lat, lng]) => [lat, lng + carStep]); break;
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative h-screen w-full bg-gray-50 text-slate-800 font-display overflow-hidden select-none">
      
      {/* Background Map Container */}
      <div className="absolute inset-0 z-0 map-container-bg w-full h-full">
        <MapContainer 
            center={initialCenter} 
            zoom={15} 
            minZoom={14}
            maxBounds={circuitBounds}
            maxBoundsViscosity={1.0}
            scrollWheelZoom={true} 
            className="w-full h-full outline-none"
            zoomControl={false}
            attributionControl={false}
        >
            {/* Light Mode Tiles (Carto Positron or OSM Standard) */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; OSM &copy; CARTO'
            />
            <ImageOverlay
                url="/circuit_map_final.png"
                bounds={imageBounds}
                opacity={0.7} 
                zIndex={10}
            />
            
            {/* Dynamic Markers rendering (currently empty) */}
            {markers.map((marker, index) => (
                <Marker key={index} position={marker.position} icon={marker.icon}>
                    <Popup>{marker.name}</Popup>
                </Marker>
            ))}

            <Marker position={carPosition} icon={CarIcon}>
                <Popup>Driver</Popup>
            </Marker>
        </MapContainer>
      </div>

      {/* UI Overlay */}
      <div className="relative z-30 flex flex-col h-full pointer-events-none">
        
        {/* Top Bar */}
        <div className="w-full pt-12 px-5 pointer-events-auto">
            <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-2">
                    <img src="/logo/logo.png" alt="Circuit Logo" className="h-12 w-auto object-contain" />
                </div>
                <button className="bg-white/80 backdrop-blur-md p-2 rounded-full text-slate-700 shadow-sm border border-slate-200 active:bg-slate-100">
                    <span className="material-symbols-outlined text-2xl block">person</span>
                </button>
            </div>

            {/* Search Bar (Light) */}
            <div className="w-full">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl flex items-center px-4 py-3.5 gap-3 pointer-events-auto border border-slate-200 shadow-xl shadow-slate-200/50">
                    <span className="material-symbols-outlined text-primary text-xl">search</span>
                    <input className="bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 w-full text-sm font-medium focus:ring-0 p-0" placeholder="Search Grandstand, Food, WC..." type="text"/>
                    <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-xl">tune</span>
                    </button>
                </div>
            </div>
        </div>

        <div className="flex-grow"></div>

        {/* Right Side Controls (FABs) */}
        <div className="absolute right-5 bottom-48 flex flex-col gap-4 pointer-events-auto z-40">
            <button className="bg-primary text-white p-3.5 rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-transform flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">my_location</span>
            </button>
            <button className="bg-white/90 backdrop-blur-md text-slate-700 p-3.5 rounded-xl border border-slate-200 shadow-lg shadow-slate-200/50 active:scale-95 transition-transform flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">layers</span>
            </button>
        </div>

        {/* Info Card - Only shows when a feature is selected */}
        {selectedFeature && (
            <div className="px-4 mb-4 pointer-events-auto animate-[slideUp_0.3s_ease-out]">
                <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl p-5 shadow-2xl shadow-slate-200/50">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">{selectedFeature.name || 'Selected Item'}</h3>
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                <span className="material-icons text-xs text-primary">place</span>
                                {selectedFeature.description || 'Details unavailable'}
                            </p>
                        </div>
                        <button onClick={() => setSelectedFeature(null)} className="text-slate-400 hover:text-slate-600">
                            <span className="material-icons">close</span>
                        </button>
                    </div>
                    {/* Placeholder for future images/details */}
                    <div className="flex gap-2 mb-4">
                         <div className="h-20 w-32 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 text-xs">
                            No Image
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 bg-primary text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:bg-red-600 transition-colors">
                            <span className="material-icons text-sm">navigation</span>
                            Navigate
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Bottom Legend Card (Light) */}
        <div className="px-4 mb-24 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl p-5 shadow-2xl shadow-slate-200/50">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Map Legend</span>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wide">Points of Interest</span>
                </div>
                <div className="flex gap-6 overflow-x-auto no-scrollbar items-center">
                     <div className="flex items-center gap-2 shrink-0">
                        <div className="w-3 h-3 rounded-full bg-primary/90 shadow-sm"></div>
                        <span className="text-sm font-medium text-slate-600">Grandstands</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm"></div>
                        <span className="text-sm font-medium text-slate-600">Fan Zone</span>
                    </div>
                     <div className="flex items-center gap-2 shrink-0">
                        <div className="w-3 h-3 rounded-full bg-slate-500 shadow-sm"></div>
                        <span className="text-sm font-medium text-slate-600">WC</span>
                    </div>
                     <div className="flex items-center gap-2 shrink-0">
                        <div className="w-3 h-3 rounded-full bg-slate-500 shadow-sm"></div>
                        <span className="text-sm font-medium text-slate-600">Food</span>
                    </div>
                </div>
            </div>
        </div>

      </div>

       {/* Bottom Navigation (Light) */}
       <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto">
            {/* Nav Bar Background */}
            <div className="bg-white border-t border-slate-100 px-6 pt-2 pb-6 flex justify-between items-center relative shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                
                {/* Left Links */}
                <div className="flex gap-8">
                     <Link to="/home" className="flex flex-col items-center gap-1.5 text-slate-400 active:text-primary group">
                        <span className="material-symbols-outlined text-2xl group-active:scale-110 transition-transform">home</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider opacity-0 group-active:opacity-100 transition-opacity absolute -bottom-3 text-primary">Home</span>
                    </Link>
                    <Link to="/events" className="flex flex-col items-center gap-1.5 text-slate-400 active:text-primary group">
                        <span className="material-symbols-outlined text-2xl group-active:scale-110 transition-transform">calendar_month</span>
                         <span className="text-[9px] font-bold uppercase tracking-wider opacity-0 group-active:opacity-100 transition-opacity absolute -bottom-3 text-primary">Events</span>
                    </Link>
                </div>

                {/* Central Map Button - Floats Above */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-12">
                     <div className="relative group">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <button className="relative bg-gradient-to-br from-[#ff3355] to-[#cc1133] text-white w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-2xl shadow-primary/40 active:scale-95 transition-all duration-200 border-[6px] border-white ring-1 ring-slate-100">
                            <span className="material-symbols-outlined text-[32px] fill-1 leading-none drop-shadow-md">map</span>
                            <span className="text-[9px] font-black uppercase tracking-widest mt-0.5 drop-shadow-sm">Map</span>
                        </button>
                    </div>
                </div>

                {/* Right Links */}
                <div className="flex gap-8">
                    <Link to="/community" className="flex flex-col items-center gap-1.5 text-slate-400 active:text-primary group">
                        <span className="material-symbols-outlined text-2xl group-active:scale-110 transition-transform">groups</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider opacity-0 group-active:opacity-100 transition-opacity absolute -bottom-3 text-primary">Community</span>
                    </Link>
                    <Link to="/settings" className="flex flex-col items-center gap-1.5 text-slate-400 active:text-primary group">
                        <span className="material-symbols-outlined text-2xl group-active:scale-110 transition-transform">settings</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider opacity-0 group-active:opacity-100 transition-opacity absolute -bottom-3 text-primary">Settings</span>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Map;
