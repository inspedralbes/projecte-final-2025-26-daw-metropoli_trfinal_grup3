import { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
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

// Custom Icon for the Car
const CarIcon = L.divIcon({
  className: 'custom-car-icon',
  html: '<div style="font-size: 24px;">🏎️</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// Component to update map center when needed (optional, effectively just for initial load here)
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
}

const Map = () => {
  const initialCenter = [41.5700, 2.2611];
  
  // State for Car Position
  const [carPosition, setCarPosition] = useState(initialCenter);
  
  // State for Image Alignment
  // Initial bounds
  const [imageBounds, setImageBounds] = useState([
    [41.5700 - 0.008, 2.2611 - 0.012], // South-West
    [41.5700 + 0.008, 2.2611 + 0.012]  // North-East
  ]);
  
  const [editMode, setEditMode] = useState(false); // Toggle between Drive and Edit

  useEffect(() => {
    const handleKeyDown = (e) => {
      const step = 0.00005; // Fine adjustment step
      const bigStep = 0.0005; // Faster resizing step
      const moveStep = e.shiftKey ? bigStep : step;

      if (editMode) {
        // IMAGE ALIGNMENT MODE
        e.preventDefault(); // Prevent scrolling
        setImageBounds(prev => {
          const [[s, w], [n, e_lng]] = prev;
          
          if (e.shiftKey) {
             // Resize (Expand/Shrink) logic could go here, 
             // but user asked to MOVE with arrows.
             // Let's make Shift+Arrows RESIZE.
             switch (e.key) {
               case 'ArrowUp': // Taller
                 return [[s - step, w], [n + step, e_lng]];
               case 'ArrowDown': // Shorter
                 return [[s + step, w], [n - step, e_lng]];
               case 'ArrowRight': // Wider
                 return [[s, w - step], [n, e_lng + step]];
               case 'ArrowLeft': // Narrower
                 return [[s, w + step], [n, e_lng - step]];
               default:
                 return prev;
             }
          } else {
            // Move (Translate)
            switch (e.key) {
              case 'ArrowUp':
                return [[s + step, w], [n + step, e_lng]];
              case 'ArrowDown':
                return [[s - step, w], [n - step, e_lng]];
              case 'ArrowLeft':
                return [[s, w - step], [n, e_lng - step]];
              case 'ArrowRight':
                return [[s, w + step], [n, e_lng + step]];
              default:
                return prev;
            }
          }
        });
      } else {
        // DRIVE MODE (Car control)
        const carStep = 0.0001;
        
        switch (e.key) {
          case 'ArrowUp':
            setCarPosition(([lat, lng]) => [lat + carStep, lng]);
            break;
          case 'ArrowDown':
             setCarPosition(([lat, lng]) => [lat - carStep, lng]);
            break;
          case 'ArrowLeft':
             setCarPosition(([lat, lng]) => [lat, lng - carStep]);
            break;
          case 'ArrowRight':
             setCarPosition(([lat, lng]) => [lat, lng + carStep]);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editMode]);

  return (
    <div className="test-page-container">
      <MapContainer 
        center={initialCenter} 
        zoom={14} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", background: "#e5e7eb" }}
        minZoom={12}
        attributionControl={false}
      >
        {/* Standard OpenStreetMap Layer */}
         <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ImageOverlay
          url="/circuit_map_final.png"
          bounds={imageBounds}
          opacity={0.8}
          zIndex={10}
        />
        
        {/* Car Marker */}
        <Marker position={carPosition} icon={CarIcon}>
          <Popup>Driver</Popup>
        </Marker>
      </MapContainer>
      
      {/* Controls / Info Panel */}
      <div className="controls-panel">
        <div className="header-row">
            <h3>{editMode ? "🛠️ EDIT MODE" : "🏎️ DRIVE MODE"}</h3>
            <button onClick={() => setEditMode(!editMode)}>
                Switch to {editMode ? "Drive" : "Edit"}
            </button>
        </div>
        
        {editMode ? (
            <div className="info-content">
                <p>Use <strong>Arrows</strong> to MOVE the image.</p>
                <p>Use <strong>Shift + Arrows</strong> to RESIZE.</p>
                <div className="code-block">
                    <pre>
{`const bounds = [
  [${imageBounds[0][0].toFixed(5)}, ${imageBounds[0][1].toFixed(5)}],
  [${imageBounds[1][0].toFixed(5)}, ${imageBounds[1][1].toFixed(5)}]
];`}
                    </pre>
                </div>
                <small>Copy these values when aligned.</small>
            </div>
        ) : (
             <div className="info-content">
                <p>Use <strong>Arrows</strong> to move the car.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Map;
