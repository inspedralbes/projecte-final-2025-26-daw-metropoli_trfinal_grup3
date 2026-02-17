const traduccionService = require('../services/traduccionService');

const createTraduccion = async (req, res) => {
    try {
        const { tabla_origen, id_registro_origen, codigo_idioma, campo_traducido, texto } = req.body;
        const nuevaTraduccion = await traduccionService.createTraduccion({ tabla_origen, id_registro_origen, codigo_idioma, campo_traducido, texto });
        res.status(201).json({
            success: true,
            message: 'Traducción guardada',
            data: nuevaTraduccion
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTraducciones = async (req, res) => {
    try {
        const traducciones = await traduccionService.getAllTraducciones();
        res.json({ success: true, data: traducciones });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createTraduccion,
    getTraducciones
};
