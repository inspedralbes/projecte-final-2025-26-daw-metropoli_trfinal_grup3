const navegacionService = require('../services/navegacionService');

const createNodo = async (req, res) => {
    try {
        const { latitud, longitud, descripcion } = req.body;
        const nuevoNodo = await navegacionService.createNodo({ latitud, longitud, descripcion });
        res.status(201).json({
            success: true,
            message: 'Nodo de navegación creado',
            data: nuevoNodo
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createTramo = async (req, res) => {
    try {
        const { id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno, es_bidireccional } = req.body;
        const nuevoTramo = await navegacionService.createTramo({ id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno, es_bidireccional });
        res.status(201).json({
            success: true,
            message: 'Tramo de ruta creado',
            data: nuevoTramo
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getNodos = async (req, res) => {
    try {
        const nodos = await navegacionService.getAllNodos();
        res.json({ success: true, data: nodos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getTramos = async (req, res) => {
    try {
        const tramos = await navegacionService.getAllTramos();
        res.json({ success: true, data: tramos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default {
    createNodo,
    createTramo,
    getNodos,
    getTramos
};
