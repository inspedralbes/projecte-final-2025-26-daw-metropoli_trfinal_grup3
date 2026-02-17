const poiService = require('../services/poiService');

const createPoiSimple = async (req, res) => {
    try {
        const { nombre, descripcion, latitud, longitud, id_categoria, es_accesible, es_fijo, imagen_url, id_nodo_acceso } = req.body;
        const nuevoPoi = await poiService.createPoiSimple({ nombre, descripcion, latitud, longitud, id_categoria, es_accesible, es_fijo, imagen_url, id_nodo_acceso });
        res.status(201).json({
            success: true,
            message: 'POI creado',
            data: nuevoPoi
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createPoiCompleto = async (req, res) => {
    try {
        const { nombre, descripcion, latitud, longitud, id_categoria, es_accesible, es_fijo, imagen_url, id_nodo_acceso, horarios, multimedia } = req.body;
        const nuevoPoi = await poiService.createPoiCompleto({ nombre, descripcion, latitud, longitud, id_categoria, es_accesible, es_fijo, imagen_url, id_nodo_acceso, horarios, multimedia });
        res.status(201).json({
            success: true,
            message: 'POI completo creado con detalles asociados',
            data: nuevoPoi
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPois = async (req, res) => {
    try {
        const pois = await poiService.getAllPois();
        res.json({ success: true, data: pois });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createPoiSimple,
    createPoiCompleto,
    getPois
};
