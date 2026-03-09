import poiService from '../services/poiService.js';
import poiModel from '../models/poiModel.js';
import { emitirMensaje } from '../config/socket.js';

// ─── Funciones de cálculo de distancia (Haversine) ───────────────────────────
// Devuelve la distancia en metros entre dos coordenadas
const calcularDistanciaMetros = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // radio de la Tierra en metros
    const rad = Math.PI / 180;

    const phi1 = lat1 * rad;
    const phi2 = lat2 * rad;
    const deltaPhi = (lat2 - lat1) * rad;
    const deltaLambda = (lon2 - lon1) * rad;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2)
        + Math.cos(phi1) * Math.cos(phi2)
        * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

// ─── Lógica difusa simple ─────────────────────────────────────────────────────
// Cuanto más bajo es el score, más prioritario es el POI.
// Penalizamos la distancia y damos un pequeño bonus si el POI es accesible.
const calcularScore = (distanciaMetros, esAccesible) => {
    // La distancia es el factor principal del score
    let score = distanciaMetros;

    // Si es accesible, restamos 50 metros de penalización (lo hacemos más prioritario)
    // No hacemos floor a 0 para que el bonus funcione correctamente cuando la distancia
    // es menor de 50m — sin esto todos los POIs cercanos tendrían score 0 y no se ordenarían
    if (esAccesible === 1 || esAccesible === true) {
        score = score - 50;
    }

    return score;
};

const createPoiSimple = async (req, res) => {
    try {
        const { nombre, descripcion, latitud, longitud, id_categoria, es_accesible, es_fijo, imagen_url, id_nodo_acceso } = req.body;
        const nuevoPoi = await poiService.createPoiSimple({ nombre, descripcion, latitud, longitud, id_categoria, es_accesible, es_fijo, imagen_url, id_nodo_acceso });
        res.status(201).json({
            success: true,
            message: 'POI creado',
            data: nuevoPoi
        });

        // Avisar a todos los clientes de que el mapa ha cambiado usando el modulo oficial de la radio
        emitirMensaje('mapa_actualizado', { type: 'create' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

const createPoiCompleto = async (req, res) => {
    try {
        const { nombre, descripcion, latitud, longitud, id_categoria, es_accesible, es_fijo, imagen_url, id_nodo_acceso, horarios, multimedia } = req.body;
        const result = await poiService.createPoiCompleto({ nombre, descripcion, latitud, longitud, id_categoria, es_accesible, es_fijo, imagen_url, id_nodo_acceso, horarios, multimedia });
        res.status(201).json({
            success: true,
            message: 'POI completo creado con detalles asociados',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

const getPois = async (req, res) => {
    try {
        const pois = await poiService.getAllPois();
        res.json({
            success: true,
            message: 'Lista de POIs recuperada',
            data: pois
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

const deletePoi = async (req, res) => {
    try {
        const { id } = req.params;
        await poiService.deletePoi(id);
        res.json({
            success: true,
            message: 'POI eliminado correctamente'
        });

        // Avisar a todos los clientes usando el modulo de radio
        emitirMensaje('mapa_actualizado', { type: 'delete' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};


// ─── GET /api/pois/cercanos?lat=X&lng=Y ──────────────────────────────────────
// Devuelve los 3 POIs más cercanos y relevantes al usuario usando lógica difusa.
const getPoisCercanos = async (req, res) => {
    try {
        const latUsuario = parseFloat(req.query.lat);
        const lngUsuario = parseFloat(req.query.lng);

        // Validación de parámetros
        if (isNaN(latUsuario) || isNaN(lngUsuario)) {
            return res.status(400).json({
                success: false,
                message: 'Los parámetros lat y lng son obligatorios y deben ser números.',
                error_code: 'PARAMETROS_INVALIDOS'
            });
        }

        // 1. Obtenemos todos los POIs de la base de datos
        const todosPois = await poiModel.getAll();

        // 2. Calculamos la distancia y el score de cada POI
        const poisConScore = [];

        for (let i = 0; i < todosPois.length; i++) {
            const poi = todosPois[i];
            const distancia = calcularDistanciaMetros(latUsuario, lngUsuario, poi.latitud, poi.longitud);
            const score = calcularScore(distancia, poi.es_accesible);

            // Formateamos la distancia para mostrarla en la UI
            let distanciaFormateada = '';
            if (distancia < 1000) {
                distanciaFormateada = `${Math.round(distancia)}m`;
            } else {
                distanciaFormateada = `${(distancia / 1000).toFixed(1)}km`;
            }

            poisConScore.push({
                id_poi: poi.id_poi,
                nombre: poi.nombre,
                descripcion: poi.descripcion,
                latitud: poi.latitud,
                longitud: poi.longitud,
                id_categoria: poi.id_categoria,
                es_accesible: poi.es_accesible,
                es_fijo: poi.es_fijo,
                imagen_url: poi.imagen_url,
                id_nodo_acceso: poi.id_nodo_acceso,
                distancia_metros: Math.round(distancia),
                distancia_formateada: distanciaFormateada,
                score: score
            });
        }

        // 3. Ordenamos de menor a mayor score (más cerca = mejor score = primero)
        // Usamos un bucle de burbuja para mantener el código legíble sin encadenar métodos
        for (let i = 0; i < poisConScore.length - 1; i++) {
            for (let j = 0; j < poisConScore.length - 1 - i; j++) {
                if (poisConScore[j].score > poisConScore[j + 1].score) {
                    const temp = poisConScore[j];
                    poisConScore[j] = poisConScore[j + 1];
                    poisConScore[j + 1] = temp;
                }
            }
        }

        // 4. Nos quedamos solo con los 3 primeros
        const top3 = [];
        for (let i = 0; i < poisConScore.length && i < 3; i++) {
            top3.push(poisConScore[i]);
        }

        res.json({
            success: true,
            message: 'Los 3 POIs más cercanos',
            data: top3
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

// ─── POST /api/pois/:id/imagen ────────────────────────────────────────────────
// Recibe una imagen subida por multer y actualiza el campo imagen_url del POI.
const uploadPoiImage = async (req, res) => {
    try {
        const { id } = req.params;

        // Multer adjunta el archivo en req.file si la subida fue bien
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No se ha recibido ninguna imagen.',
                error_code: 'ARCHIVO_REQUERIDO'
            });
        }

        // Construimos la ruta relativa que guardaremos en la BD
        // req.file.path devuelve algo como 'public/images/pois/poi-1234567890.jpg'
        // La convertimos a una ruta pública que el frontend puede usar
        const rutaRelativa = '/' + req.file.path.replace(/\\/g, '/');

        await poiModel.updateImageUrl(id, rutaRelativa);

        res.json({
            success: true,
            message: 'Imagen del POI actualizada correctamente',
            data: {
                id_poi: id,
                imagen_url: rutaRelativa
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

export default {
    createPoiSimple,
    createPoiCompleto,
    getPois,
    deletePoi,
    getPoisCercanos,
    uploadPoiImage
};
