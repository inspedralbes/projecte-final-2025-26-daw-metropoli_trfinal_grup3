const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// --- Named exports para uso con destructuring ---

// ── POIs ──
export const getPois = async () => {
  try {
    const response = await fetch(`${API_URL}/api/pois`);
    if (!response.ok) throw new Error("Failed to fetch POIs");
    return await response.json();
  } catch (error) {
    console.error("Error in getPois:", error);
    throw error;
  }
};

export const createPoi = async (poiData) => {
  try {
    const response = await fetch(`${API_URL}/api/pois`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(poiData),
    });
    if (!response.ok) throw new Error("Failed to create POI");
    return await response.json();
  } catch (error) {
    console.error("Error in createPoi:", error);
    throw error;
  }
};

export const deletePoi = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/pois/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete POI");
    return await response.json();
  } catch (error) {
    console.error("Error in deletePoi:", error);
    throw error;
  }
};

// ── Ruta Dijkstra ──
export const getRoute = async (origenId, destinoId) => {
  try {
    const response = await fetch(
      `${API_URL}/api/calculo-ruta?origen=${origenId}&destino=${destinoId}`
    );
    if (!response.ok) throw new Error("Failed to fetch Route");
    return await response.json();
  } catch (error) {
    console.error("Error in getRoute:", error);
    throw error;
  }
};

// ── QR Codes ──
export const getQrCodes = async () => {
  try {
    const response = await fetch(`${API_URL}/api/qrs`);
    if (!response.ok) throw new Error("Failed to fetch QR Codes");
    return await response.json();
  } catch (error) {
    console.error("Error in getQrCodes:", error);
    throw error;
  }
};

export const generateQrCode = async (id_nodo, zona) => {
  try {
    const params = zona ? `?zona=${encodeURIComponent(zona)}` : "";
    const response = await fetch(`${API_URL}/api/qrs/${id_nodo}${params}`);
    if (!response.ok) throw new Error("Failed to generate QR Code");
    return await response.json();
  } catch (error) {
    console.error("Error in generateQrCode:", error);
    throw error;
  }
};

export const recalculateCache = async () => {
  try {
    const response = await fetch(`${API_URL}/api/admin/recalcular`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to recalculate cache");
    return await response.json();
  } catch (error) {
    console.error("Error in recalculateCache:", error);
    throw error;
  }
};

// ── Nodos de navegación ──
export const getNodos = async () => {
  try {
    const response = await fetch(`${API_URL}/api/nodos`);
    if (!response.ok) throw new Error("Failed to fetch Nodos");
    return await response.json();
  } catch (error) {
    console.error("Error in getNodos:", error);
    throw error;
  }
};

export const getPoiNodes = async () => {
  try {
    const response = await fetch(`${API_URL}/api/nodos/poi`);
    if (!response.ok) throw new Error("Failed to fetch POI Nodos");
    return await response.json();
  } catch (error) {
    console.error("Error in getPoiNodes:", error);
    throw error;
  }
};

// ── Eventos ──
export const getEventos = async () => {
  try {
    const response = await fetch(`${API_URL}/api/eventos`);
    if (!response.ok) throw new Error("Failed to fetch Eventos");
    return await response.json();
  } catch (error) {
    console.error("Error in getEventos:", error);
    throw error;
  }
};

export const getNextEvento = async () => {
  try {
    const response = await fetch(`${API_URL}/api/eventos/proximo`);
    if (!response.ok) throw new Error("Failed to fetch next Evento");
    return await response.json();
  } catch (error) {
    console.error("Error in getNextEvento:", error);
    throw error;
  }
};

export const createEvento = async (eventoData) => {
  try {
    const response = await fetch(`${API_URL}/api/eventos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventoData),
    });
    if (!response.ok) throw new Error("Failed to create Evento");
    return await response.json();
  } catch (error) {
    console.error("Error in createEvento:", error);
    throw error;
  }
};

export const updateEvento = async (id, eventoData) => {
  try {
    const response = await fetch(`${API_URL}/api/eventos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventoData),
    });
    if (!response.ok) throw new Error("Failed to update Evento");
    return await response.json();
  } catch (error) {
    console.error("Error in updateEvento:", error);
    throw error;
  }
};

// ── Tiempo (Weather) ──
export const getTiempo = async () => {
  try {
    const response = await fetch(`${API_URL}/api/tiempo`);
    if (!response.ok) throw new Error("Failed to fetch Tiempo");
    return await response.json();
  } catch (error) {
    console.error("Error in getTiempo:", error);
    throw error;
  }
};

// ── Comunidad ──
export const getPublicaciones = async () => {
  try {
    const response = await fetch(`${API_URL}/api/comunidad`);
    if (!response.ok) throw new Error("Failed to fetch Publicaciones");
    return await response.json();
  } catch (error) {
    console.error("Error in getPublicaciones:", error);
    throw error;
  }
};

export const createPublicacion = async (publicacionData) => {
  try {
    const response = await fetch(`${API_URL}/api/comunidad`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(publicacionData),
    });
    if (!response.ok) throw new Error("Failed to create Publicacion");
    return await response.json();
  } catch (error) {
    console.error("Error in createPublicacion:", error);
    throw error;
  }
};

// ── Categorías ──
export const getCategorias = async () => {
  try {
    const response = await fetch(`${API_URL}/api/categorias`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  } catch (error) {
    console.error("Error in getCategorias:", error);
    throw error;
  }
};
