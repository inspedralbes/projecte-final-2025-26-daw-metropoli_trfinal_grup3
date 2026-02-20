import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import Navbar from "../../layouts/Navbar";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";

registerLocale("es", es);

// Fix for default marker icon
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const createCustomIcon = (iconName, bgColor) =>
  L.divIcon({
    className: "custom-map-icon",
    html: `<div class="${bgColor} text-white p-2 rounded-full shadow-md border border-white/20 flex items-center justify-center w-8 h-8">
            <span class="material-symbols-outlined text-sm leading-none">${iconName}</span>
         </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

const LocationMarker = ({ setPosition, position }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        Selected Location: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
      </Popup>
    </Marker>
  );
};

const Admin = () => {
  // Map State
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [pointName, setPointName] = useState("");
  const [pointType, setPointType] = useState("grandstand");
  const [savedPoints, setSavedPoints] = useState([]);

  // Event State
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);

  const handleSavePoint = () => {
    if (!selectedPosition || !pointName) return;
    const newPoint = {
      id: Date.now(),
      name: pointName,
      type: pointType,
      position: selectedPosition,
    };
    setSavedPoints([...savedPoints, newPoint]);
    setPointName("");
    setSelectedPosition(null);
  };

  const handleSaveEvent = () => {
    if (!eventName || !eventDate) return;
    const newEvent = {
      id: Date.now(),
      name: eventName,
      date: eventDate.toISOString(),
    };
    setSavedEvents([...savedEvents, newEvent]);
    setEventName("");
    setEventDate(null);
  };

  return (
    <div className="relative h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-display overflow-hidden flex flex-col transition-colors duration-300">
      {/* Top Bar */}
      <div className="w-full pt-12 px-5 pb-4 bg-gray-50 dark:bg-slate-950 z-20 transition-colors duration-300 border-b border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src="/logo/logo.png"
              alt="Circuit Logo"
              className="h-12 w-auto object-contain"
            />
            <span className="text-xl font-bold uppercase tracking-wider text-slate-800 dark:text-white ml-2">
              Admin Panel
            </span>
          </div>
          <Link
            to="/profile"
            className="bg-white dark:bg-slate-900 p-2 rounded-full text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-800 active:bg-slate-100 dark:active:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl block">
              person
            </span>
          </Link>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto pb-32 px-5 space-y-8 pt-6">
        {/* Section 1: Map Management */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            Map Management
          </h3>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-5 h-64 relative z-0">
            <MapContainer
              center={[41.57, 2.2611]}
              zoom={14}
              className="w-full h-full"
              zoomControl={false}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              <LocationMarker
                position={selectedPosition}
                setPosition={setSelectedPosition}
              />

              {/* Render Saved Points */}
              {savedPoints.map((point) => (
                <Marker
                  key={point.id}
                  position={point.position}
                  icon={createCustomIcon(
                    point.type === "grandstand"
                      ? "event_seat"
                      : point.type === "food"
                        ? "restaurant"
                        : "wc",
                    point.type === "grandstand"
                      ? "bg-primary"
                      : point.type === "food"
                        ? "bg-orange-500"
                        : "bg-slate-500",
                  )}
                >
                  <Popup>{point.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">
                Point Name
              </label>
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="material-symbols-outlined text-slate-400">
                  edit
                </span>
                <input
                  type="text"
                  value={pointName}
                  onChange={(e) => setPointName(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-slate-700 dark:text-slate-200 text-sm font-medium placeholder-slate-400"
                  placeholder="e.g. Main Grandstand"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">
                Point Type
              </label>
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="material-symbols-outlined text-slate-400">
                  category
                </span>
                <select
                  value={pointType}
                  onChange={(e) => setPointType(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-slate-700 dark:text-slate-200 text-sm font-medium appearance-none"
                >
                  <option value="grandstand">Grandstand</option>
                  <option value="food">Food & Drink</option>
                  <option value="wc">WC</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSavePoint}
                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-transform flex items-center justify-center gap-2"
                disabled={!selectedPosition}
              >
                <span className="material-symbols-outlined">
                  add_location_alt
                </span>
                {selectedPosition ? "Save Point" : "Select Location on Map"}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Event Management */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            Event Management
          </h3>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">
                Event Name
              </label>
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="material-symbols-outlined text-slate-400">
                  event_note
                </span>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-slate-700 dark:text-slate-200 text-sm font-medium placeholder-slate-400"
                  placeholder="e.g. Qualifying Session"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">
                Date & Time
              </label>
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="material-symbols-outlined text-slate-400">
                  calendar_month
                </span>
                <DatePicker
                  selected={eventDate}
                  onChange={(date) => setEventDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  locale="es"
                  className="bg-transparent border-none outline-none w-full text-slate-700 dark:text-slate-200 text-sm font-medium placeholder-slate-400"
                  wrapperClassName="w-full"
                  popperClassName="shadow-xl rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700"
                  placeholderText="Select date and time"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSaveEvent}
                className="w-full bg-slate-800 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">save</span>
                Create Event
              </button>
            </div>
          </div>

          {/* Saved Events List */}
          {savedEvents.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
                Created Events
              </h3>
              <div className="space-y-3">
                {savedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined">event</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">
                          {event.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {new Date(event.date).toLocaleDateString()} •{" "}
                          {new Date(event.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:bg-red-100">
                      <span className="material-symbols-outlined text-lg">
                        delete
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Admin;
