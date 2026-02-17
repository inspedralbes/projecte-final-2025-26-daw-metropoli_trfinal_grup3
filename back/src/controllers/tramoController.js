import tramoService from '../services/tramoService.js';

const createTramo = async (req, res) => {
    try {
        const { id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno, es_bidireccional } = req.body;
        const nuevoTramo = await tramoService.createTramo({ id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno, es_bidireccional });
        res.status(201).json({
            success: true,
            message: 'Tramo de ruta creado',
            data: nuevoTramo
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

const getTramos = async (req, res) => {
    try {
        const tramos = await tramoService.getAllTramos();
        res.json({ 
            success: true, 
            message: 'Tramos recuperados',
            data: tramos 
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
    createTramo,
    getTramos
};
