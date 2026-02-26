import comunidadService from '../services/comunidadService.js';
import { emitirMensaje } from '../config/socket.js'; // Traemos nuestra antena de radio

const createPublicacion = async (req, res) => {
    try {
        const { id_usuario, texto, foto, likes, tipo_publicacion, ubicacion } = req.body;
        const nuevaPublicacion = await comunidadService.createPublicacion({ id_usuario, texto, foto, likes, tipo_publicacion, ubicacion });

        // 📻 Anunciamos el cambio por el canal "nueva_publicacion" a toda la gente conectada
        emitirMensaje('nueva_publicacion', nuevaPublicacion);

        res.status(201).json({
            success: true,
            message: 'Publicación creada',
            data: nuevaPublicacion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

const getPublicaciones = async (req, res) => {
    try {
        const publicaciones = await comunidadService.getAllPublicaciones();
        res.json({
            success: true,
            message: 'Publicaciones recuperadas',
            data: publicaciones
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
    createPublicacion,
    getPublicaciones
};
