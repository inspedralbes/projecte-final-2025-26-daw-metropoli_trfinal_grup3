import tramoService from '../services/tramoService.js';

const createTramo = async (req, res) => {
    try {
        const { id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno } = req.body;
        const nuevoTramo = await tramoService.createTramo({ id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno });
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

const createTramosBulk = async (req, res) => {
    try {
        const { tramos } = req.body;
        if (!tramos || !Array.isArray(tramos)) {
            return res.status(400).json({ success: false, message: 'Format_invalido. Se espera un array "tramos".' });
        }

        const count = await tramoService.createTramosBulk(tramos);
        res.status(201).json({
            success: true,
            message: `Se crearon ${count} tramos correctamente.`,
            count: count
        });
    } catch (error) {
        console.error("Error bulk creating tramos:", error);
        res.status(500).json({
            success: false,
            message: 'Error interno al crear rutas masivas.',
            error: error.message
        });
    }
};

export default {
    createTramo,
    getTramos,
    createTramosBulk
};
