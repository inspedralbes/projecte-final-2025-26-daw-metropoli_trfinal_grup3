import { Fragment } from "react";
import { Marker, Popup, Polyline, TileLayer } from "react-leaflet";
import L from "leaflet";

/**
 * Componente unificado para las capas del mapa.
 * Se encarga de renderizar listas, POIs generales, rutas y posición del usuario.
 */
const MapLayers = ({
  isSatelliteView,
  currentZoom,
  userLists,
  focusedListId,
  handleFocusList,
  otherListGeometries = {},
  generalMarkers = [],
  activeFilter = null,
  userPosition = null,
  handleGetRouteToPoi = null,
  userToPoiRoute = null,
  // Props adicionales para modo edición/creación (opcionales)
  selectedPoisForList = [],
  joinedRoute = null,
  onPoiClick = null,
  activePoiIndex = null,
  setActivePoiIndex = null,
  currentUser = null,
  t = null,
}) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  return (
    <Fragment>
      {/* ... previous content ... */}
      {/* (I will only replace the user position marker part below) */}

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

      {/* 1. Renderizado de Listas Existentes */}
      {userLists && userLists
        .filter(list => !focusedListId || list.id_lista === focusedListId)
        .map(list => {
          if (!list.pois || list.pois.length === 0) {
            return null;
          }
          const isFocused = focusedListId === list.id_lista;

          // Si NO está enfocada, mostramos el CLUSTER
          if (!isFocused) {
            const firstPoi = list.pois[0];
            return (
              <Marker
                key={`list-cluster-${list.id_lista}`}
                position={[parseFloat(firstPoi.latitud), parseFloat(firstPoi.longitud)]}
                icon={L.divIcon({
                  className: "list-cluster-marker",
                  html: `<div class="w-10 h-10 bg-slate-800/90 rounded-full border-2 border-white/50 shadow-2xl flex items-center justify-center text-white scale-75 group transition-all overflow-hidden cursor-pointer">
                        ${list.imagen_url
                      ? `<img src="${API_URL}${list.imagen_url}" class="w-full h-full object-cover" />`
                      : `<span class="material-symbols-outlined text-lg">format_list_bulleted</span>`
                    }
                      </div>`,
                  iconSize: [40, 40],
                  iconAnchor: [20, 20]
                })}
                eventHandlers={{ click: () => handleFocusList(list) }}
              />
            );
          }

          // Si ESTÁ enfocada, mostramos el DETALLE (Polilínea y POIs numerados)
          const listData = otherListGeometries[list.id_lista];
          let geom = listData?.geom;
          
          if (!geom) {
            // Fallback: connect points directly, closing the loop
            const points = list.pois.map(p => [parseFloat(p.latitud), parseFloat(p.longitud)]);
            geom = [...points, points[0]];
          }

          return (
            <Fragment key={`list-full-${list.id_lista}`}>
              <Polyline
                positions={geom}
                color="#6366f1"
                weight={4}
                opacity={1}
                eventHandlers={{ click: () => handleFocusList(list) }}
              />
              {list.pois.map((poi, idx) => (
                <Marker
                  key={`list-poi-${list.id_lista}-${poi.id_poi}`}
                  position={[parseFloat(poi.latitud), parseFloat(poi.longitud)]}
                  zIndexOffset={2000}
                  icon={L.divIcon({
                    className: "other-list-poi",
                    html: `<div class="w-5 h-5 bg-indigo-500 scale-125 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[9px] text-white font-bold transition-all">
                      ${idx + 1}
                    </div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                  })}
                >
                  <Popup>
                    <div className="p-2 flex flex-col gap-2 text-black">
                      <h3 className="font-bold">{poi.nombre}</h3>
                      <p className="text-xs text-gray-500">{list.nombre}</p>
                      {handleGetRouteToPoi && (
                        <button
                          onClick={() => handleGetRouteToPoi(poi)}
                          className="bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-lg font-bold"
                        >
                          ¿Cómo llegar?
                        </button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </Fragment>
          );
        })}

      {/* 2. POIs Generales */}
      {(() => {
        // Ocultar POIs generales si no hay onPoiClick (ej. en el mapa principal)
        if (!onPoiClick) return null;

        if (focusedListId) return null;

        const filtered = generalMarkers?.filter(marker => {
          // Ocultar si hay una lista enfocada (navegación)
          if (focusedListId) return false;
          
          // Compatibilidad de IDs entre Map (id) y CreateList (id_poi)
          const mId = marker.id_poi || marker.id;
          
          // Ocultar si ya está seleccionado en la lista actual (Modo Creación)
          const isSelected = selectedPoisForList.some(sp => (sp.id_poi || sp.id) === mId);
          if (isSelected) return false;

          // Filtro por categoría
          if (activeFilter !== null && marker.id_categoria !== activeFilter) return false;

          // Mostrar si es "nuevo" o si tenemos suficiente zoom
          return marker.isNew || currentZoom >= 16;
        }) || [];

        return filtered.map((marker, index) => {
          const mId = marker.id_poi || marker.id;
          const pos = marker.position || [parseFloat(marker.latitud), parseFloat(marker.longitud)];
          return (
            <Marker
              key={`poi-general-${mId || index}`}
              position={pos}
              interactive={!!onPoiClick}
              icon={L.divIcon({
                className: "existing-poi-marker",
                html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[8px] text-white font-bold opacity-80 ${!onPoiClick ? 'pointer-events-none' : ''}"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
              })}
              eventHandlers={{
                click: onPoiClick ? () => onPoiClick(marker) : undefined
              }}
            />
          );
        });
      })()}

      {/* 3. Lógica específica de Creación (Lista actual siendo editada) */}
      {selectedPoisForList.length > 0 && (
        <Fragment>
          {joinedRoute && (
            <Polyline
              positions={joinedRoute}
              color="#6366f1"
              weight={6}
              opacity={0.8}
            />
          )}
          {selectedPoisForList.map((poi, idx) => (
            <Marker
              key={`new-list-poi-${poi.id_poi || poi.id}`}
              position={[parseFloat(poi.latitud), parseFloat(poi.longitud)]}
              zIndexOffset={3000}
              icon={L.divIcon({
                className: `selected-poi-marker ${activePoiIndex === idx ? 'z-[100]' : ''}`,
                html: `<div class="w-8 h-8 ${activePoiIndex === idx ? 'bg-white text-pink-500 border-pink-500' : 'bg-pink-500 text-white border-white'
                  } rounded-full border-4 shadow-xl flex items-center justify-center text-xs font-black transition-all">
                  ${idx + 1}
                </div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
              })}
              eventHandlers={{
                click: setActivePoiIndex ? () => setActivePoiIndex(idx) : () => { }
              }}
            />
          ))}
        </Fragment>
      )}

      {/* 4. Posición del Usuario y Ruta Activa */}
      {userPosition && (
        <Marker
          position={userPosition}
          zIndexOffset={5000}
          icon={L.divIcon({
            className: "user-position-marker",
            html: currentUser?.foto_perfil 
              ? `<div class="flex flex-col items-center justify-center" style="width: 100px; margin-left: -50px; margin-top: -20px;">
                  <div class="w-10 h-10 rounded-full border-2 border-primary shadow-lg overflow-hidden bg-white flex-shrink-0 animate-pulse">
                    <img src="${API_URL}${currentUser.foto_perfil}" class="w-full h-full object-cover" />
                  </div>
                  <div class="mt-1 bg-primary/90 backdrop-blur-sm px-2 py-0.5 rounded-lg text-white text-[9px] font-black uppercase tracking-tight text-center leading-tight shadow-xl border border-white/20 whitespace-nowrap">
                    ${t?.('map.you', 'Tú') || 'Tú'}
                  </div>
                </div>`
              : `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
            iconSize: currentUser?.foto_perfil ? [0, 0] : [16, 16],
            iconAnchor: currentUser?.foto_perfil ? [0, 0] : [8, 8]
          })}
        >
          <Popup><span className="text-black font-bold">Estás aquí</span></Popup>
        </Marker>
      )}

      {userToPoiRoute && (
        <Polyline
          positions={userToPoiRoute.geom || userToPoiRoute}
          color="#3b82f6"
          weight={6}
          dashArray="1, 10"
          opacity={0.8}
        />
      )}
    </Fragment>
  );
};

export default MapLayers;
