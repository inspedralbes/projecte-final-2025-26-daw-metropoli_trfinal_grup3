import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Polyline,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../layouts/Navbar";
import { getPois, getRoute, getCategorias, createLista, createPoi, getNodos } from "../../services/communicationManager";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

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
  const [isReviewing, setIsReviewing] = useState(false);
  const [listName, setListName] = useState("");
  const [listDesc, setListDesc] = useState("");
  const [listVisibility, setListVisibility] = useState("public");
  const [joinedRoute, setJoinedRoute] = useState(null);
  const [isSatelliteView, setIsSatelliteView] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [poiRes, catRes, nodeRes] = await Promise.all([
          getPois(),
          getCategorias(),
          getNodos()
        ]);
        console.log("CreateList: Fetched", poiRes.data?.length, "POIs and", nodeRes.data?.length, "nodes.");
        if (poiRes.success) setPois(poiRes.data);
        if (catRes.success) setCategories(catRes.data);
        if (nodeRes.success) setAllNodes(nodeRes.data);
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
    if (isReviewing) return;
    if (selectedPoisForList.find(p => p.id_poi === poi.id_poi)) return;
    setSelectedPoisForList(prev => [...prev, poi]);
  };

  const handleMarkNodeAsPoi = async (node) => {
    if (isReviewing) return;
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

  const handleFinishSelection = async () => {
    if (selectedPoisForList.length < 2) {
      alert(t("createList.errorMinPoints"));
      return;
    }
    setIsReviewing(true);

    const fullPath = [];
    try {
      for (let i = 0; i < selectedPoisForList.length - 1; i++) {
        const res = await getRoute(selectedPoisForList[i].id_nodo_acceso, selectedPoisForList[i + 1].id_nodo_acceso);
        if (res.success && res.data.detalles) {
          const segment = res.data.detalles.map(n => [parseFloat(n.latitud), parseFloat(n.longitud)]);
          fullPath.push(...segment);
        }
      }
      setJoinedRoute(fullPath);
    } catch (err) {
      console.error("Error calculating joined route:", err);
    }
  };

  const watchIdRef = useRef(null);

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
      const listaData = {
        id_usuario: 1, // FIXME: Real user ID
        nombre: listName,
        descripcion: listDesc,
        visibilidad: listVisibility,
        pois: selectedPoisForList.map(p => p.id_poi)
      };
      const res = await createLista(listaData);
      if (res.success) {
        alert(t("createList.success"));
        navigate("/");
      }
    } catch (err) {
      console.error("Error saving list:", err);
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
              : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            }
          />

          {joinedRoute && <Polyline positions={joinedRoute} color="#ec4899" weight={6} opacity={0.8} />}

          {!isReviewing && allNodes.map(node => (
            <Marker
              key={`node-${node.id_nodo}`}
              position={[parseFloat(node.latitud), parseFloat(node.longitud)]}
              icon={L.divIcon({
                className: "node-dot",
                html: `<div class="w-4 h-4 bg-white/80 rounded-full border-2 border-pink-500 shadow-lg hover:scale-150 transition-transform flex items-center justify-center"><div class="w-1.5 h-1.5 bg-pink-500 rounded-full"></div></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
              })}
              eventHandlers={{ click: () => handleMarkNodeAsPoi(node) }}
            />
          ))}

          {!isReviewing && pois.map(poi => (
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
                className: "selected-poi-marker",
                html: `<div class="w-8 h-8 bg-pink-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">${idx + 1}</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
              })}
            />
          ))}
        </MapContainer>
      </div>

      <div className="absolute top-0 left-0 right-0 p-6 z-10 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto bg-black/60 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-black italic uppercase tracking-tighter">{t("createList.title").split(' ')[0]} <span className="text-pink-500">{t("createList.title").split(' ')[1]}</span></h1>
            <button onClick={() => navigate("/")} className="text-white/50 hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <p className="text-xs text-white/60 mb-4">{t("createList.subtitle")}</p>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
            <button onClick={() => setIsSatelliteView(false)} className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${!isSatelliteView ? 'bg-white text-black' : 'text-white/40'}`}>{t("createList.map")}</button>
            <button onClick={() => setIsSatelliteView(true)} className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isSatelliteView ? 'bg-white text-black' : 'text-white/40'}`}>{t("createList.satellite")}</button>
          </div>

          <button onClick={handleLocate} className="mt-3 w-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest py-2 rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">my_location</span>
            {t("createList.center")}
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 z-10 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto bg-black/80 backdrop-blur-2xl p-6 rounded-[3rem] border border-white/10 shadow-2xl">
          {!isReviewing ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500 mb-1">{t("createList.selection")}</p>
                  <h2 className="text-lg font-bold">{selectedPoisForList.length} {t("createList.pointsSelected")}</h2>
                </div>
              </div>

              <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar py-2">
                {selectedPoisForList.map((poi, idx) => (
                  <div key={poi.id_poi} className="flex-shrink-0 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-3">
                    <span className="text-pink-500 font-black text-xs">#{idx + 1}</span>
                    <span className="text-xs font-medium truncate max-w-[100px]">{poi.nombre}</span>
                  </div>
                ))}
                {selectedPoisForList.length === 0 && <p className="text-white/30 text-xs italic">{t("createList.noPoints")}</p>}
              </div>

              <button
                onClick={handleFinishSelection}
                disabled={selectedPoisForList.length < 2}
                className="w-full bg-pink-500 text-white py-4 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-pink-500/20 disabled:opacity-20 disabled:grayscale transition-all active:scale-95"
              >
                {t("createList.generate")}
              </button>
            </>
          ) : (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-xl font-bold mb-2">{t("createList.finishTitle")}</h2>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-[1.5rem] p-4 border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 ml-1">{t("createList.nameLabel")}</p>
                  <input
                    type="text"
                    placeholder={t("createList.namePlaceholder")}
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-sm font-medium"
                  />
                </div>

                <div className="bg-white/5 rounded-[1.5rem] p-4 border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 ml-1">{t("createList.descLabel")}</p>
                  <textarea
                    placeholder={t("createList.descPlaceholder")}
                    value={listDesc}
                    onChange={(e) => setListDesc(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-sm font-medium h-20 resize-none"
                  />
                </div>

                <div className="flex gap-2 p-1 bg-white/5 rounded-[1.5rem] border border-white/10">
                  {['public', 'friends', 'private'].map(v => (
                    <button
                      key={v}
                      onClick={() => setListVisibility(v)}
                      className={`flex-1 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${listVisibility === v ? 'bg-pink-500 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsReviewing(false)}
                  className="flex-1 bg-white/5 text-white/60 py-4 rounded-[2rem] font-black uppercase tracking-widest border border-white/10 active:scale-95 transition-all"
                >
                  {t("createList.back")}
                </button>
                <button
                  onClick={handleSaveList}
                  className="flex-[2] bg-pink-500 text-white py-4 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-pink-500/20 active:scale-95 transition-all"
                >
                  {t("createList.save")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default CreateList;
