const ubicacionService = require('../services/ubicacionService');

const createUbicacion = async (req, res) => {
    try {
        const { id_usuario, id_poi, latitud_guardada, longitud_guardada, tipo, nombre_personalizado } = req.body;
        const nuevaUbicacion = await ubicacionService.createUbicacion({ id_usuario, id_poi, latitud_guardada, longitud_guardada, tipo, nombre_personalizado });
        res.status(201).json({
            success: true,
            message: 'Ubicación guardada',
            data: nuevaUbicacion
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUbicaciones = async (req, res) => {
    try {
        const { id_usuario } = req.params; // Asumiendo que viene por URL, o req.user si hubiera auth
        if (!id_usuario) {
            return res.status(400).json({ success: false, message: 'ID de usuario requerido' });
        }
        const ubicaciones = await ubicacionService.getUbicacionesByUsuario(id_usuario);
        res.json({ success: true, data: ubicaciones });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createUbicacion,
    getUbicaciones
};
