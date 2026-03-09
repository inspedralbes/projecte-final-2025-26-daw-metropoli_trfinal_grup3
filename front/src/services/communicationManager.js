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

// Obtiene los 3 POIs más cercanos al usuario usando la lógica difusa del backend
export const getPoisCercanos = async (lat, lng) => {
  try {
    const response = await fetch(
      `${API_URL}/api/pois/cercanos?lat=${lat}&lng=${lng}`,
    );
    if (!response.ok) throw new Error("Failed to fetch POIs cercanos");
    return await response.json();
  } catch (error) {
    console.error("Error in getPoisCercanos:", error);
    throw error;
  }
};

// Sube una imagen para un POI ya creado y actualiza su imagen_url en la BD
export const uploadPoiImage = async (idPoi, file) => {
  try {
    // Usamos FormData para enviar el archivo como multipart/form-data
    // El campo se llama 'imagenPoi' que es el que espera multer en el backend
    const formData = new FormData();
    formData.append("imagenPoi", file);

    const response = await fetch(`${API_URL}/api/pois/${idPoi}/imagen`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to upload POI image");
    return await response.json();
  } catch (error) {
    console.error("Error in uploadPoiImage:", error);
    throw error;
  }
};

// ── Ruta Dijkstra ──
export const getRoute = async (origenId, destinoId, coords = null) => {
  try {
    let url = `${API_URL}/api/rutas/calcular?destino=${destinoId}`;
    if (coords && coords.lat && coords.lng) {
      url += `&lat=${coords.lat}&lng=${coords.lng}`;
    } else {
      url += `&origen=${origenId}`;
    }

    const response = await fetch(url);
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

// ── Tramos (Rutas) ──
export const getTramos = async () => {
  try {
    const response = await fetch(`${API_URL}/api/tramos`);
    if (!response.ok) throw new Error("Failed to search tramos");
    return await response.json();
  } catch (error) {
    console.error("Error in getTramos:", error);
    throw error;
  }
};

export const createTramosBulk = async (tramosArray) => {
  try {
    const response = await fetch(`${API_URL}/api/tramos/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tramos: tramosArray }),
    });
    if (!response.ok) throw new Error("Failed to create tramos in bulk");
    return await response.json();
  } catch (error) {
    console.error("Error in createTramosBulk:", error);
    throw error;
  }
};

export const createPath = async (coords, isBidirectional) => {
  try {
    const response = await fetch(`${API_URL}/api/tramos/path`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coords, isBidirectional }),
    });
    if (!response.ok) throw new Error("Failed to create path");
    return await response.json();
  } catch (error) {
    console.error("Error in createPath:", error);
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
    if (!response.ok) {
      // Leemos el JSON del servidor para obtener el mensaje real
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create Publicacion");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in createPublicacion:", error);
    throw error;
  }
};

export const createComentario = async (id, comentarioData) => {
  try {
    const response = await fetch(`${API_URL}/api/comunidad/${id}/comentarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comentarioData),
    });
    if (!response.ok) throw new Error("Failed to create Comentario");
    return await response.json();
  } catch (error) {
    console.error("Error in createComentario:", error);
    throw error;
  }
};

export const createRespuesta = async (id, cid, respuestaData) => {
  try {
    const response = await fetch(
      `${API_URL}/api/comunidad/${id}/comentarios/${cid}/respuestas`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(respuestaData),
      },
    );
    if (!response.ok) throw new Error("Failed to create Respuesta");
    return await response.json();
  } catch (error) {
    console.error("Error in createRespuesta:", error);
    throw error;
  }
};

export const toggleLike = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/comunidad/${id}/like`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to toggle Like");
    return await response.json();
  } catch (error) {
    console.error("Error in toggleLike:", error);
    throw error;
  }
};

export const uploadFotoComunidad = async (file) => {
  try {
    const formData = new FormData();
    formData.append("foto", file);
    const response = await fetch(`${API_URL}/api/upload/comunidad`, {
      method: "POST",
      // Omitimos Content-Type para que el navegador ponga el boundary correcto
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(
        `[Upload] Backend respondió con ${response.status}:`,
        errorData.message || "(sin mensaje)",
      );
      throw new Error(
        errorData.message ||
          `Failed to upload Community photo (${response.status})`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error in uploadFotoComunidad:", error);
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

export const createCategoria = async (categoriaData) => {
  try {
    const response = await fetch(`${API_URL}/api/categorias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoriaData),
    });
    if (!response.ok) throw new Error("Failed to create Categoria");
    return await response.json();
  } catch (error) {
    console.error("Error in createCategoria:", error);
    throw error;
  }
};
export const deleteNode = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/nodos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete Nodo");
    return await response.json();
  } catch (error) {
    console.error("Error in deleteNode:", error);
    throw error;
  }
};

export const deleteTramo = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/tramos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete Tramo");
    return await response.json();
  } catch (error) {
    console.error("Error in deleteTramo:", error);
    throw error;
  }
};

export const getTramosByNode = async (nodeId) => {
  try {
    const response = await fetch(`${API_URL}/api/tramos/node/${nodeId}`);
    if (!response.ok) throw new Error("Failed to fetch Tramos for Node");
    return await response.json();
  } catch (error) {
    console.error("Error in getTramosByNode:", error);
    throw error;
  }
};

// ── Incidencias ──

export const getIncidencias = async () => {
  try {
    const response = await fetch(`${API_URL}/api/incidencias`);
    if (!response.ok) throw new Error("Failed to fetch Incidencias");
    return await response.json();
  } catch (error) {
    console.error("Error in getIncidencias:", error);
    throw error;
  }
};

export const createIncidencia = async (incidenciaData) => {
  try {
    const response = await fetch(`${API_URL}/api/incidencias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(incidenciaData),
    });
    if (!response.ok) throw new Error("Failed to create Incidencia");
    return await response.json();
  } catch (error) {
    console.error("Error in createIncidencia:", error);
    throw error;
  }
};

// ── Usuarios ──

export const getUsuario = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/usuarios/${id}`);
    if (!response.ok) throw new Error("Failed to fetch Usuario");
    return await response.json();
  } catch (error) {
    console.error("Error in getUsuario:", error);
    throw error;
  }
};

export const getUsuarios = async () => {
  try {
    const response = await fetch(`${API_URL}/api/usuarios`);
    if (!response.ok) throw new Error("Failed to fetch Usuarios");
    return await response.json();
  } catch (error) {
    console.error("Error in getUsuarios:", error);
    throw error;
  }
};

export const createUsuario = async (usuarioData) => {
  try {
    const response = await fetch(`${API_URL}/api/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioData),
    });
    if (!response.ok) throw new Error("Failed to create Usuario");
    return await response.json();
  } catch (error) {
    console.error("Error in createUsuario:", error);
    throw error;
  }
};

export const updatePerfil = async (id, formData) => {
  try {
    const response = await fetch(`${API_URL}/api/usuarios/${id}/perfil`, {
      method: "PUT",
      // Note: When uploading files with fetch, omit Content-Type header
      // so the browser automatically sets it to multipart/form-data with boundary
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to update Perfil");
    return await response.json();
  } catch (error) {
    console.error("Error in updatePerfil:", error);
    throw error;
  }
};

// ── Amigos ──

export const getAmigos = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/api/amigos/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch Amigos");
    return await response.json();
  } catch (error) {
    console.error("Error in getAmigos:", error);
    throw error;
  }
};

export const addAmigo = async (userId, friendId) => {
  try {
    const response = await fetch(`${API_URL}/api/amigos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario: userId, id_amigo: friendId }),
    });
    if (!response.ok) throw new Error("Failed to add Amigo");
    return await response.json();
  } catch (error) {
    console.error("Error in addAmigo:", error);
    throw error;
  }
};

export const removeAmigo = async (userId, friendId) => {
  try {
    const response = await fetch(
      `${API_URL}/api/amigos/${userId}/${friendId}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) throw new Error("Failed to remove Amigo");
    return await response.json();
  } catch (error) {
    console.error("Error in removeAmigo:", error);
    throw error;
  }
};
