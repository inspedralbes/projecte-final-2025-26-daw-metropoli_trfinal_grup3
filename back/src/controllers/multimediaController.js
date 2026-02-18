import multimediaService from '../services/multimediaService.js';

const createMultimedia = async (req, res) => {
    try {
        const { id_poi, url_archivo, tipo, titulo, orden } = req.body;
        const result = await multimediaService.createMultimedia({ id_poi, url_archivo, tipo, titulo, orden });
        res.status(201).json({
            success: true,
            message: 'Contenido multimedia añadido',
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

const getMultimediaByPoi = async (req, res) => {
    try {
        const { id_poi } = req.params;
        if (!id_poi) {
            return res.status(400).json({ 
                success: false, 
                message: 'ID de POI requerido',
                error_code: 'PARAMETROS_FALTANTES'
            });
        }
        const multimedia = await multimediaService.getMultimediaByPoi(id_poi);
        res.json({ 
            success: true, 
            message: 'Contenido multimedia recuperado',
            data: multimedia 
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
    createMultimedia,
    getMultimediaByPoi
};
