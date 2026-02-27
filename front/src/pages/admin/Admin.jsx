import { useState, useEffect } from "react";
import { getEventos, createEvento, updateEvento, getPois, createPoi, deletePoi, getCategorias, getTramos, createTramosBulk, getNodos, createPath, deleteNode, deleteTramo, getTramosByNode } from "../../services/communicationManager";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import Navbar from "../../layouts/Navbar";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AdminQRTab from "../../components/admin/AdminQRTab";
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

// Es crea un icona personalitzada per al mapa segons el tipus de punt
const createCustomIcon = (iconName, bgColor) =>
  L.divIcon({
    className: "custom-map-icon",
    html: `<div class="${bgColor} text-white p-2 rounded-full shadow-md border border-white/20 flex items-center justify-center w-8 h-8">
            <span class="material-symbols-outlined text-sm leading-none">${iconName}</span>
         </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

// Es crea un marcador que es posiciona on l'usuari fa click
// lat es l'eix vertical i lng es l'eix horitzontal
const LocationMarker = ({ setPosition, position, isPathMode, onMapClick }) => {
  useMapEvents({
    click(e) {
      if (isPathMode) {
        onMapClick(e.latlng);
      } else {
        setPosition(e.latlng);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        Selected Location: {Number(position.lat).toFixed(5)}, {Number(position.lng).toFixed(5)}
      </Popup>
    </Marker>
  );
};

const Admin = () => {
  // Map State
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [pointName, setPointName] = useState("");
  const [pointType, setPointType] = useState(""); // Ahora será un id_categoria
  const [savedPoints, setSavedPoints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [targetNodeIdForPoi, setTargetNodeIdForPoi] = useState(null); // Para convertir nodo en POI

  // Route Drawing State
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [existingTramos, setExistingTramos] = useState([]);
  const [pendingTramos, setPendingTramos] = useState([]);
  const [currentRouteNodes, setCurrentRouteNodes] = useState([]); // [id_nodo1, id_nodo2, ...]
  const [allNodes, setAllNodes] = useState([]); // Necesitamos nodos puros para pintar las conexiones
  const [nodeTramos, setNodeTramos] = useState([]); // Tramos asociados al nodo seleccionado en un popup

  // Custom Path Drawing State
  const [isPathDrawMode, setIsPathDrawMode] = useState(false);
  const [currentPathCoords, setCurrentPathCoords] = useState([]); // [{lat, lng}, ...]

  // Event State — camps que coincideixen amb el backend
  const [eventNombre, setEventNombre] = useState("");
  const [eventDescripcion, setEventDescripcion] = useState("");
  const [eventFoto, setEventFoto] = useState("");
  const [eventFechaInicio, setEventFechaInicio] = useState(null);
  const [eventFechaFin, setEventFechaFin] = useState(null);
  const [eventEstado, setEventEstado] = useState("activo");
  const [savedEvents, setSavedEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [activeTab, setActiveTab] = useState("events"); // 'map' or 'events'

  // Cargar eventos del backend
  const fetchEvents = () => {
    getEventos()
      .then(res => {
        if (res.success && res.data) {
          // Filtrar eventos cancelados o inactivos para que no se muestren en la lista
          setSavedEvents(res.data.filter(e => e.estado !== 'cancelado'));
        }
      })
      .catch(err => console.error("Error fetching eventos:", err));
  };

  // Cargar POIs del backend
  const fetchPois = () => {
    getPois()
      .then(res => {
        if (res.success && res.data) {
          setSavedPoints(res.data);
        }
      })
      .catch(err => console.error("Error fetching POIs:", err));
  };

  // Cargar categorías del backend
  const fetchCategories = () => {
    getCategorias()
      .then(res => {
        if (res.success && res.data) {
          setCategories(res.data);
          if (res.data.length > 0) setPointType(res.data[0].id_categoria);
        }
      })
      .catch(err => console.error("Error fetching categories:", err));
  };

  // Cargar Tramos y Nodos para renderizar la red
  const fetchNetworkData = async () => {
    try {
      const [tramosRes, nodosRes] = await Promise.all([getTramos(), getNodos()]);
      if (tramosRes.success && tramosRes.data) {
        setExistingTramos(tramosRes.data);
      }
      if (nodosRes.success && nodosRes.data) {
        setAllNodes(nodosRes.data);
      }
    } catch (err) {
      console.error("Error fetching network data:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchPois();
    fetchCategories();
    fetchNetworkData();
  }, []);

  const handleEditEvent = (event) => {
    setEditingEventId(event.id_evento);
    setEventNombre(event.nombre);
    setEventDescripcion(event.descripcion || "");
    setEventFoto(event.foto || "");
    setEventFechaInicio(new Date(event.fecha_inicio));
    setEventFechaFin(new Date(event.fecha_fin));
    setEventEstado(event.estado || "activo");
    setActiveTab("events");
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm("¿Seguro que quieres borrar (ocultar) este evento?")) {
      updateEvento(id, { estado: 'cancelado' })
        .then(() => fetchEvents())
        .catch(err => console.error("Error deleting event:", err));
    }
  };

  // Funció per guardar un punt al mapa
  const handleSavePoint = () => {
    if (!selectedPosition) {
      alert("Haz clic en el mapa para seleccionar una ubicación.");
      return;
    }
    if (!pointName) {
      alert("Por favor, introduce un nombre para el punto.");
      return;
    }
    if (!pointType) {
      alert("Por favor, selecciona una categoría.");
      return;
    }

    const poiData = {
      nombre: pointName,
      descripcion: "", // Opcional por ahora
      latitud: selectedPosition.lat,
      longitud: selectedPosition.lng,
      id_categoria: pointType,
      es_accesible: 1,
      es_fijo: 1,
      imagen_url: "",
      id_nodo_acceso: targetNodeIdForPoi // Si venimos de un nodo existente
    };

    createPoi(poiData)
      .then(() => {
        fetchPois();
        fetchNetworkData(); // Recargar nodos ya que ahora uno es POI
        setPointName("");
        setSelectedPosition(null);
        setTargetNodeIdForPoi(null);
      })
      .catch(err => {
        console.error("Error saving POI:", err);
        alert("Error al guardar el punto. Comprueba la conexión o consola.");
      });
  };

  const handleDeletePoint = (id) => {
    if (window.confirm("¿Seguro que quieres borrar este punto?")) {
      deletePoi(id)
        .then(() => fetchPois())
        .catch(err => console.error("Error deleting POI:", err));
    }
  };

  // Funció per guardar un esdeveniment
  const handleSaveEvent = () => {
    if (!eventNombre || !eventFechaInicio || !eventFechaFin) return;

    const eventData = {
      nombre: eventNombre,
      descripcion: eventDescripcion,
      foto: eventFoto,
      fecha_inicio: eventFechaInicio.toISOString(),
      fecha_fin: eventFechaFin.toISOString(),
      estado: eventEstado,
    };

    if (editingEventId) {
      updateEvento(editingEventId, eventData)
        .then(() => {
          fetchEvents();
          resetEventForm();
        })
        .catch(err => console.error("Error al actualizar: ", err));
    } else {
      createEvento(eventData)
        .then(() => {
          fetchEvents();
          resetEventForm();
        })
        .catch(err => console.error("Error al crear: ", err));
    }
  };

  const resetEventForm = () => {
    setEditingEventId(null);
    setEventNombre("");
    setEventDescripcion("");
    setEventFoto("");
    setEventFechaInicio(null);
    setEventFechaFin(null);
    setEventEstado("activo");
  };

  // --- Lógica de Modo Red (Dibujo Unificado) ---
  const toggleNetworkMode = () => {
    const newMode = !isDrawMode;
    setIsDrawMode(newMode);
    setIsPathDrawMode(newMode); // Sincronizamos ambos para comportamiento unificado
    if (!newMode) {
      setPendingTramos([]);
      setCurrentRouteNodes([]);
      setCurrentPathCoords([]);
      setTargetNodeIdForPoi(null);
    }
  };

  const handleNodeInteraction = (nodeId, latlng) => {
    if (!isDrawMode) return;

    // Modo Conexión: Obtenemos el último nodo antes de actualizar el estado
    const lastNodeId = currentRouteNodes[currentRouteNodes.length - 1];

    if (currentRouteNodes.length >= 1 && lastNodeId !== nodeId) {
      // Preguntamos al usuario fuera del setter de estado
      const isDobleVia = window.confirm("¿Tramo de DOBLE VÍA?");

      setPendingTramos(ts => [...ts, {
        id_nodo_origen: lastNodeId,
        id_nodo_destino: nodeId,
        es_doble_via: isDobleVia
      }]);
    }

    // Actualizamos la secuencia de nodos actual
    setCurrentRouteNodes(prev => [...prev, nodeId]);
  };

  const handleConvertNodeToPoi = (node) => {
    setActiveTab("map");
    setSelectedPosition({ lat: node.latitud, lng: node.longitud });
    setPointName(node.descripcion === 'Punto de ruta dibujado' ? "" : node.descripcion);
    setTargetNodeIdForPoi(node.id_nodo);

    // Forzamos el scroll después de un pequeño delay para asegurar que el tab está renderizado/visible
    setTimeout(() => {
      const form = document.querySelector('.poi-form');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleFetchNodeTramos = async (nodeId) => {
    if (!nodeId) return;
    setNodeTramos([]); // Limpiar para evitar mostrar datos del nodo anterior
    try {
      const res = await getTramosByNode(nodeId);
      if (res.success) {
        setNodeTramos(res.data);
      }
    } catch (err) {
      console.error("Error fetching node tramos:", err);
    }
  };

  const handleDeleteNode = async (nodeId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este nodo? Se eliminarán todos los tramos conectados a él.")) return;
    try {
      const res = await deleteNode(nodeId);
      if (res.success) {
        alert("Nodo eliminado");
        fetchNetworkData();
      }
    } catch (err) {
      console.error("Error deleting node:", err);
    }
  };

  const handleDeleteTramo = async (tramoId, nodeId) => {
    if (!window.confirm("¿Eliminar este tramo?")) return;
    try {
      const res = await deleteTramo(tramoId);
      if (res.success) {
        handleFetchNodeTramos(nodeId); // Recargar la lista de tramos del nodo
        fetchNetworkData(); // Recargar el mapa
      }
    } catch (err) {
      console.error("Error deleting tramo:", err);
    }
  };

  const handleSaveRoute = async () => {
    if (pendingTramos.length === 0) return;

    try {
      const res = await createTramosBulk(pendingTramos);
      if (res.success) {
        alert(`Se han guardado ${res.count} tramos.`);
        setPendingTramos([]);
        setCurrentRouteNodes([]);
        fetchNetworkData(); // Recargar los tramos consolidados
        setIsDrawMode(false);
        setIsPathDrawMode(false);
      }
    } catch (err) {
      console.error("Error saving route:", err);
      alert("Error al guardar la ruta.");
    }
  };

  const handleMapClickForPath = (latlng) => {
    setCurrentPathCoords(prev => [...prev, latlng]);
  };

  const handleSavePath = async () => {
    if (currentPathCoords.length < 2) {
      alert("Debes dibujar al menos 2 puntos para crear un camino.");
      return;
    }

    const isBidirectional = window.confirm("¿Este camino es de DOBLE VÍA?\n\nPulsa 'Aceptar' para doble vía (A<->B) o 'Cancelar' para UNA SOLA VÍA (A->B).");

    try {
      const res = await createPath(currentPathCoords, isBidirectional);
      if (res.success) {
        alert(`Camino guardado con ${res.count} segmentos.`);
        setCurrentPathCoords([]);
        setIsPathDrawMode(false);
        fetchNetworkData();
      }
    } catch (err) {
      console.error("Error saving path:", err);
      alert("Error al guardar el camino.");
    }
  };

  const clearCurrentPath = () => {
    setCurrentPathCoords([]);
    setCurrentRouteNodes([]);
  };

  return (
    <div className="relative min-h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-display select-none transition-colors duration-300 md:pl-16">
      {/* Top Bar */}
      <div className="w-full pt-6 px-5 pb-4 bg-gray-50 dark:bg-slate-950 z-20 transition-colors duration-300 border-b border-slate-200 dark:border-slate-800 md:max-w-6xl md:mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo/logo.png" alt="Circuit Logo" className="h-10 w-auto object-contain block dark:hidden" />
            <img src="/logo/logo1.png" alt="Circuit Logo" className="h-10 w-auto object-contain hidden dark:block" />
            <div>
              <h1 className="text-xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white leading-none">
                Admin <span className="text-primary">Panel</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Circuit de Catalunya</p>
            </div>
          </div>
          <Link
            to="/profile"
            className="bg-white dark:bg-slate-900 p-2 rounded-full text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl block">person</span>
          </Link>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto no-scrollbar pb-24 md:pb-10 px-5 pt-6 md:max-w-6xl md:mx-auto">

        {/* Tabs Navigation */}
        <div className="flex p-1 bg-slate-200/50 dark:bg-slate-900 rounded-2xl mb-6 shadow-inner w-full custom-tabs mx-auto lg:max-w-2xl">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'events' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <span className="material-symbols-outlined text-lg">event</span>
            Eventos
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'map' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <span className="material-symbols-outlined text-lg">map</span>
            Mapa
          </button>
          <button
            onClick={() => setActiveTab('qrs')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'qrs' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <span className="material-symbols-outlined text-lg">qr_code_2</span>
            Códigos QR
          </button>
        </div>

        <div className="w-full transition-all duration-300">
          {/* Section 1: Map Management */}
          {activeTab === 'map' && (
            <div className="animate-fade-in max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  Map Management
                </h3>

                {/* Botones de Modo Dibujo */}
                <div className="flex gap-2">
                  <button
                    onClick={toggleNetworkMode}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border ${isDrawMode
                      ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                      : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100'
                      }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isDrawMode ? 'close' : 'polyline'}
                    </span>
                    {isDrawMode ? 'Salir Modo Red' : 'Modo Red (Dibujar/Conectar)'}
                  </button>

                  {isDrawMode && (currentPathCoords.length > 0 || pendingTramos.length > 0) && (
                    <>
                      <button
                        onClick={clearCurrentPath}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1 border border-slate-200"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                        Limpiar
                      </button>
                      {(currentPathCoords.length >= 2 || pendingTramos.length > 0) && (
                        <button
                          onClick={currentPathCoords.length >= 2 ? handleSavePath : handleSaveRoute}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[16px]">save</span>
                          Guardar Red
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {isDrawMode && (
                <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs px-3 py-2 rounded-xl mb-3 flex items-start gap-2">
                  <span className="material-symbols-outlined text-indigo-500 text-sm mt-0.5">info</span>
                  <p><strong>Modo Red:</strong> Pincha en el asfalto para crear caminos nuevos o pulsa en los nodos/POIs para conectarlos entre sí.</p>
                </div>
              )}

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
                    isPathMode={isDrawMode}
                    onMapClick={handleMapClickForPath}
                  />

                  {/* Render Existing Tramos (Saved) */}
                  {existingTramos.map(tramo => {
                    const origen = allNodes.find(n => n.id_nodo === tramo.id_nodo_origen);
                    const destino = allNodes.find(n => n.id_nodo === tramo.id_nodo_destino);
                    if (origen && destino) {
                      return (
                        <Polyline
                          key={`tramo-${tramo.id_tramo}`}
                          positions={[[origen.latitud, origen.longitud], [destino.latitud, destino.longitud]]}
                          color="#64748b" // Slate 500
                          weight={3}
                          opacity={0.6}
                        />
                      )
                    }
                    return null;
                  })}

                  {/* Render Pending Tramos (Drawing Mode) */}
                  {pendingTramos.map((tramo, idx) => {
                    const origen = allNodes.find(n => n.id_nodo === tramo.id_nodo_origen);
                    const destino = allNodes.find(n => n.id_nodo === tramo.id_nodo_destino);
                    if (origen && destino) {
                      return (
                        <Polyline
                          key={`pending-${idx}`}
                          positions={[[origen.latitud, origen.longitud], [destino.latitud, destino.longitud]]}
                          color="#f59e0b" // Amber 500
                          weight={4}
                        />
                      )
                    }
                    return null;
                  })}

                  {/* Render Current Path being drawn */}
                  {currentPathCoords.length >= 2 && (
                    <Polyline
                      positions={currentPathCoords}
                      color="#6366f1" // Indigo 500
                      weight={5}
                    />
                  )}

                  {/* Render points of current path */}
                  {currentPathCoords.map((coord, idx) => (
                    <Marker
                      key={`path-point-${idx}`}
                      position={coord}
                      icon={L.divIcon({
                        className: "path-dot",
                        html: `<div class="w-3 h-3 bg-indigo-600 rounded-full border-2 border-white shadow-sm"></div>`,
                        iconSize: [12, 12],
                        iconAnchor: [6, 6]
                      })}
                    />
                  ))}

                  {/* Render Saved Points (POIs) */}
                  {savedPoints.map((point) => {
                    const cat = categories.find(c => c.id_categoria === point.id_categoria);
                    const iconName = cat?.nombre.toLowerCase().includes('seat') || cat?.nombre.toLowerCase().includes('tribuna') ? 'event_seat' :
                      cat?.nombre.toLowerCase().includes('food') || cat?.nombre.toLowerCase().includes('comida') ? 'restaurant' :
                        cat?.nombre.toLowerCase().includes('wc') || cat?.nombre.toLowerCase().includes('baño') ? 'wc' : 'location_on';
                    const bgColor = cat?.color_hex || 'bg-slate-500';

                    return (
                      <Marker
                        key={`poi-${point.id_poi}`}
                        position={[point.latitud, point.longitud]}
                        icon={createCustomIcon(
                          iconName,
                          bgColor.startsWith('#') ? "" : bgColor
                        )}
                        eventHandlers={{
                          click: (e) => {
                            if (isDrawMode) {
                              handleNodeInteraction(point.id_nodo_acceso, e.latlng);
                            }
                          },
                          add: (e) => {
                            if (bgColor.startsWith('#')) {
                              const el = e.target.getElement();
                              if (el && el.querySelector('div')) el.querySelector('div').style.backgroundColor = bgColor;
                            }
                            // Estilo visual si está seleccionado en modo dibujo
                            if (isDrawMode && currentRouteNodes.includes(point.id_nodo_acceso)) {
                              const el = e.target.getElement();
                              if (el && el.querySelector('div')) {
                                el.querySelector('div').style.border = '2px solid #ef4444';
                                el.querySelector('div').style.transform = 'scale(1.1)';
                              }
                            }
                          }
                        }}
                      >
                        {!isDrawMode && (
                          <Popup eventHandlers={{ add: () => handleFetchNodeTramos(point.id_nodo_acceso) }}>
                            <div className="p-1 w-48">
                              <h4 className="font-bold border-b mb-2">{point.nombre}</h4>

                              <div className="mb-3">
                                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Tramos Conectados</p>
                                {nodeTramos.length > 0 ? (
                                  <ul className="space-y-1 max-h-24 overflow-y-auto">
                                    {nodeTramos.map(t => (
                                      <li key={t.id_tramo} className="text-[10px] flex justify-between items-center bg-slate-50 p-1 rounded">
                                        <span>#{t.id_tramo} (Dist: {t.distancia_metros}m)</span>
                                        <button
                                          onClick={() => handleDeleteTramo(t.id_tramo, point.id_nodo_acceso)}
                                          className="text-red-500 hover:text-red-700 font-bold"
                                        >
                                          ×
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-[10px] italic text-slate-400">Sin tramos</p>
                                )}
                              </div>

                              <button
                                onClick={() => handleDeletePoint(point.id_poi)}
                                className="text-xs text-red-500 font-bold hover:underline"
                              >
                                Eliminar Punto
                              </button>
                            </div>
                          </Popup>
                        )}
                      </Marker>
                    );
                  })}

                  {/* Render All Navigation Nodes (Tiny circles) */}
                  {allNodes.map(node => {
                    const isPoiNode = savedPoints.some(p => p.id_nodo_acceso === node.id_nodo);
                    if (isPoiNode) return null; // Ya se pinta el POI

                    return (
                      <Marker
                        key={`node-${node.id_nodo}`}
                        position={[node.latitud, node.longitud]}
                        icon={L.divIcon({
                          className: "node-dot",
                          html: `<div class="w-2.5 h-2.5 bg-slate-400 rounded-full border border-white shadow-sm hover:scale-125 transition-transform ${currentRouteNodes.includes(node.id_nodo) ? 'bg-red-500 ring-4 ring-red-500/20' : ''}"></div>`,
                          iconSize: [10, 10],
                          iconAnchor: [5, 5]
                        })}
                        eventHandlers={{
                          click: (e) => {
                            if (isDrawMode) {
                              handleNodeInteraction(node.id_nodo, e.latlng);
                            }
                          }
                        }}
                      >
                        {!isDrawMode && (
                          <Popup eventHandlers={{ add: () => handleFetchNodeTramos(node.id_nodo) }}>
                            <div className="p-1 w-48 space-y-2">
                              <h4 className="font-bold text-xs text-slate-400 italic">Nodo #{node.id_nodo}</h4>
                              <p className="text-xs">{node.descripcion || 'Sin descripción'}</p>

                              <div className="border-t pt-2">
                                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Tramos Conectados</p>
                                {nodeTramos.length > 0 ? (
                                  <ul className="space-y-1 max-h-24 overflow-y-auto">
                                    {nodeTramos.map(t => (
                                      <li key={t.id_tramo} className="text-[10px] flex justify-between items-center bg-slate-50 p-1 rounded">
                                        <span>#{t.id_tramo} ({t.id_nodo_origen} \u2192 {t.id_nodo_destino})</span>
                                        <button
                                          onClick={() => handleDeleteTramo(t.id_tramo, node.id_nodo)}
                                          className="text-red-500 hover:text-red-700 font-bold"
                                        >
                                          ×
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-[10px] italic text-slate-400">Sin tramos</p>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                                <button
                                  onClick={() => handleConvertNodeToPoi(node)}
                                  className="bg-primary text-white text-[9px] font-bold py-1 px-2 rounded hover:bg-primary/90 transition-colors"
                                >
                                  Pasar a POI
                                </button>
                                <button
                                  onClick={() => handleDeleteNode(node.id_nodo)}
                                  className="bg-red-500 text-white text-[9px] font-bold py-1 px-2 rounded hover:bg-red-600 transition-colors"
                                >
                                  Borrar Nodo
                                </button>
                              </div>
                            </div>
                          </Popup>
                        )}
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 space-y-4 poi-form">
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
                      {categories.map(cat => (
                        <option key={cat.id_categoria} value={cat.id_categoria}>
                          {cat.nombre}
                        </option>
                      ))}
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
          )}

          {/* Section 2: Event Management */}
          {activeTab === 'events' && (
            <div className="animate-fade-in lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start space-y-8 lg:space-y-0">

              {/* Left Column: List */}
              <div className="order-2 lg:order-1">
                <div className="mt-6 lg:mt-0">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1 lg:mb-3">
                    Eventos Creados
                  </h3>
                  {savedEvents.length > 0 ? (
                    <div className="space-y-3">
                      {savedEvents.map((event) => (
                        <div
                          key={event.id_evento || event.id}
                          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center group"
                        >
                          <div className="flex items-center gap-4">
                            {event.foto ? (
                              <img
                                src={event.foto}
                                alt={event.nombre}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined">
                                  event
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-slate-800 dark:text-white text-sm">
                                  {event.nombre}
                                </p>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${event.estado === "activo"
                                    ? "bg-emerald-100 text-emerald-600"
                                    : event.estado === "cancelado"
                                      ? "bg-red-100 text-red-500"
                                      : "bg-slate-100 text-slate-500"
                                    }`}
                                >
                                  {event.estado}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                {new Date(event.fecha_inicio).toLocaleDateString(
                                  "es",
                                  { day: "numeric", month: "short" },
                                )}{" "}
                                →{" "}
                                {new Date(event.fecha_fin).toLocaleDateString("es", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center active:bg-blue-100"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id_evento || event.id)}
                              className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center active:bg-red-100"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">event_busy</span>
                      <p className="font-medium text-sm">No hay eventos activos.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="order-1 lg:order-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  Event Management
                </h3>

                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">
                      Nombre
                    </label>
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                      <span className="material-symbols-outlined text-slate-400">
                        event_note
                      </span>
                      <input
                        type="text"
                        value={eventNombre}
                        onChange={(e) => setEventNombre(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-slate-700 dark:text-slate-200 text-sm font-medium placeholder-slate-400"
                        placeholder="e.g. Qualifying Session"
                      />
                    </div>
                  </div>

                  {/* Descripcion */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">
                      Descripción
                    </label>
                    <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                      <span className="material-symbols-outlined text-slate-400 mt-0.5">
                        description
                      </span>
                      <textarea
                        value={eventDescripcion}
                        onChange={(e) => setEventDescripcion(e.target.value)}
                        rows={3}
                        className="bg-transparent border-none outline-none w-full text-slate-700 dark:text-slate-200 text-sm font-medium placeholder-slate-400 resize-none"
                        placeholder="Descripción del evento..."
                      />
                    </div>
                  </div>

                  {/* Foto (URL) */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">
                      Foto (URL)
                    </label>
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                      <span className="material-symbols-outlined text-slate-400">
                        image
                      </span>
                      <input
                        type="text"
                        value={eventFoto}
                        onChange={(e) => setEventFoto(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-slate-700 dark:text-slate-200 text-sm font-medium placeholder-slate-400"
                        placeholder="https://..."
                      />
                    </div>
                    {/* Preview de la foto si hay URL */}
                    {eventFoto && (
                      <img
                        src={eventFoto}
                        alt="preview"
                        className="mt-2 w-full h-32 object-cover rounded-xl border border-slate-100 dark:border-slate-700"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}
                  </div>

                  {/* Fecha Inicio */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">
                      Fecha Inicio
                    </label>
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                      <span className="material-symbols-outlined text-slate-400">
                        calendar_month
                      </span>
                      <DatePicker
                        selected={eventFechaInicio}
                        onChange={(date) => setEventFechaInicio(date)}
                        showTimeSelect
                        dateFormat="Pp"
                        locale="es"
                        selectsStart
                        startDate={eventFechaInicio}
                        endDate={eventFechaFin}
                        className="bg-transparent border-none outline-none w-full text-slate-700 dark:text-slate-200 text-sm font-medium placeholder-slate-400"
                        wrapperClassName="w-full"
                        popperClassName="shadow-xl rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700"
                        placeholderText="Selecciona fecha y hora de inicio"
                      />
                    </div>
                  </div>

                  {/* Fecha Fin */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">
                      Fecha Fin
                    </label>
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                      <span className="material-symbols-outlined text-slate-400">
                        event_available
                      </span>
                      <DatePicker
                        selected={eventFechaFin}
                        onChange={(date) => setEventFechaFin(date)}
                        showTimeSelect
                        dateFormat="Pp"
                        locale="es"
                        selectsEnd
                        startDate={eventFechaInicio}
                        endDate={eventFechaFin}
                        minDate={eventFechaInicio}
                        className="bg-transparent border-none outline-none w-full text-slate-700 dark:text-slate-200 text-sm font-medium placeholder-slate-400"
                        wrapperClassName="w-full"
                        popperClassName="shadow-xl rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700"
                        placeholderText="Selecciona fecha y hora de fin"
                      />
                    </div>
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">
                      Estado
                    </label>
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                      <span className="material-symbols-outlined text-slate-400">
                        toggle_on
                      </span>
                      <select
                        value={eventEstado}
                        onChange={(e) => setEventEstado(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-slate-700 dark:text-slate-200 text-sm font-medium appearance-none"
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={handleSaveEvent}
                      disabled={!eventNombre || !eventFechaInicio || !eventFechaFin}
                      className="flex-1 bg-slate-800 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined">{editingEventId ? 'update' : 'save'}</span>
                      {editingEventId ? 'Actualizar Evento' : 'Crear Evento'}
                    </button>
                    {editingEventId && (
                      <button
                        onClick={resetEventForm}
                        className="px-5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center border border-slate-300 dark:border-slate-700"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Section 3: QR Code Management */}
          {activeTab === 'qrs' && (
            <AdminQRTab />
          )}

        </div>

      </div>

      <Navbar />
    </div>
  );
};

export default Admin;
