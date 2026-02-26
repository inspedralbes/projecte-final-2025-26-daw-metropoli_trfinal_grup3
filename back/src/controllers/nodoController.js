import nodoService from '../services/nodoService.js';

const createNodo = async (req, res) => {
    try {
        const { latitud, longitud, descripcion } = req.body;
        const nuevoNodo = await nodoService.createNodo({ latitud, longitud, descripcion });
        res.status(201).json({
            success: true,
            message: 'Nodo de navegación creado',
            data: nuevoNodo
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

const getNodos = async (req, res) => {
    try {
        const nodos = await nodoService.getAllNodos();
        res.json({ 
            success: true, 
            message: 'Nodos recuperados',
            data: nodos 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

const getNodoById = async (req, res) => {
    try {
        const nodo = await nodoService.getNodoById(req.params.id);
        if (!nodo) {
            return res.status(404).json({ 
                success: false, 
                message: 'Nodo no encontrado',
                error_code: 'RECURSO_NO_ENCONTRADO'
            });
        }
        res.json({ 
            success: true, 
            message: 'Nodo recuperado en detalle',
            data: nodo 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

const getPoiNodes = async (req, res) => {
    try {
        const nodos = await nodoService.getNodesWithPoi();
        res.json({ 
            success: true, 
            message: 'Nodos con POI recuperados',
            data: nodos 
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
    createNodo,
    getNodos,
    getNodoById,
    getPoiNodes
};
