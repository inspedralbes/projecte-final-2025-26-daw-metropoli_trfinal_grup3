const BASE_URL = import.meta.env.VITE_API_URL;
console.log("API URL Configurada:", BASE_URL);
// --- Métodos genéricos ---

const get = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok)
    throw new Error(`Error GET ${endpoint}: ${response.status}`);
  return response.json();
};

const post = async (endpoint, body) => {
  const isFormData = body instanceof FormData;
  const options = {
    method: "POST",
    body: isFormData ? body : JSON.stringify(body),
  };

  // Solo añadimos el content-type si no es FormData (el navegador lo añade solo para FormData con su boundary)
  if (!isFormData) {
    options.headers = { "Content-Type": "application/json" };
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    // Intentamos leer el mensaje de error del cuerpo de la respuesta
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Error POST ${endpoint}: ${response.status}`,
    );
  }
  return response.json();
};

const put = async (endpoint, body) => {
  const isFormData = body instanceof FormData;
  const options = {
    method: "PUT",
    body: isFormData ? body : JSON.stringify(body),
  };

  // Solo añadimos el content-type si no es FormData (el navegador lo añade solo para FormData con su boundary)
  if (!isFormData) {
    options.headers = { "Content-Type": "application/json" };
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!response.ok)
    throw new Error(`Error PUT ${endpoint}: ${response.status}`);
  return response.json();
};

const del = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
  });
  if (!response.ok)
    throw new Error(`Error DELETE ${endpoint}: ${response.status}`);
  return response.json();
};

// --- Comunidad ---

export const getPublicaciones = () => get("/api/comunidad");
export const createPublicacion = (data) => post("/api/comunidad", data);
export const createComentario = (id, data) =>
  post(`/api/comunidad/${id}/comentarios`, data);
export const createRespuesta = (id, cid, data) =>
  post(`/api/comunidad/${id}/comentarios/${cid}/respuestas`, data);
export const toggleLike = (id, data) => post(`/api/comunidad/${id}/like`, data);

// --- Eventos ---

export const getEventos = () => get("/api/eventos");
export const getNextEvento = () => get("/api/eventos/proximo");
export const createEvento = (data) => post("/api/eventos", data);
export const updateEvento = (id, data) => put(`/api/eventos/${id}`, data);

// --- Tiempo ---

export const getTiempo = () => get("/api/tiempo");

// --- POIs ---

export const getPois = () => get("/api/pois");
export const createPoi = (data) => post("/api/pois", data);

// --- Incidencias ---

export const getIncidencias = () => get("/api/incidencias");
export const createIncidencia = (data) => post("/api/incidencias", data);

// --- Usuarios ---

export const getUsuario = (id) => get(`/api/usuarios/${id}`);
export const getUsuarios = () => get("/api/usuarios");
export const createUsuario = (data) => post("/api/usuarios", data);
export const updatePerfil = (id, formData) =>
  put(`/api/usuarios/${id}/perfil`, formData);

// --- Amigos ---
// TODO: cuando haya login, pasar el token JWT en los headers

export const getAmigos = (userId) => get(`/api/amigos/${userId}`);
export const addAmigo = (userId, friendId) =>
  post("/api/amigos", { id_usuario: userId, id_amigo: friendId });
export const removeAmigo = (userId, friendId) =>
  del(`/api/amigos/${userId}/${friendId}`);
export default { get, post, put, del };
