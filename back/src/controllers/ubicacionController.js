import ubicacionService from '../services/ubicacionService.js';

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
        res.status(500).json({ 
            success: false, 
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

const getUbicaciones = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        if (!id_usuario) {
             return res.status(400).json({ 
                 success: false, 
                 message: 'ID de usuario requerido',
                 error_code: 'PARAMETROS_FALTANTES'
             });
        }
        const ubicaciones = await ubicacionService.getUbicacionesByUsuario(id_usuario);
        res.json({ 
            success: true, 
            message: 'Ubicaciones del usuario recuperadas',
            data: ubicaciones 
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
    createUbicacion,
    getUbicaciones
};
