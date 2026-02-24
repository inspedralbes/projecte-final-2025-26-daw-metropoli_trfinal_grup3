const BASE_URL = import.meta.env.VITE_API_URL;

// --- Métodos genéricos ---

const get = async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`Error GET ${endpoint}: ${response.status}`);
    return response.json();
};

const post = async (endpoint, body) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`Error POST ${endpoint}: ${response.status}`);
    return response.json();
};

const put = async (endpoint, body) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`Error PUT ${endpoint}: ${response.status}`);
    return response.json();
};

const del = async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Error DELETE ${endpoint}: ${response.status}`);
    return response.json();
};

// --- Comunidad ---

export const getPublicaciones = () => get('/api/comunidad');
export const createPublicacion = (data) => post('/api/comunidad', data);

// --- Eventos ---

export const getEventos = () => get('/api/eventos');
export const getNextEvento = () => get('/api/eventos/proximo');
export const createEvento = (data) => post('/api/eventos', data);

// --- Tiempo ---

export const getTiempo = () => get('/api/tiempo');

// --- POIs ---

export const getPois = () => get('/api/pois');
export const createPoi = (data) => post('/api/pois', data);

// --- Incidencias ---

export const getIncidencias = () => get('/api/incidencias');
export const createIncidencia = (data) => post('/api/incidencias', data);

// --- Usuarios ---

export const getUsuarios = () => get('/api/usuarios');
export const createUsuario = (data) => post('/api/usuarios', data);

export default { get, post, put, del };
