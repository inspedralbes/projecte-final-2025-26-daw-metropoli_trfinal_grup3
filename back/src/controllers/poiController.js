import poiService from '../services/poiService.js';
import { emitirMensaje } from '../config/socket.js';

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

export default {
    createPoiSimple,
    createPoiCompleto,
    getPois,
    deletePoi
};
