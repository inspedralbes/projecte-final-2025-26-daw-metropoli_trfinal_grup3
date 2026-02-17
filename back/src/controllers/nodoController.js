const nodoService = require('../services/nodoService');

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
        res.status(500).json({ success: false, message: error.message });
    }
};

const getNodos = async (req, res) => {
    try {
        const nodos = await nodoService.getAllNodos();
        res.json({ success: true, data: nodos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getNodoById = async (req, res) => {
    try {
        const nodo = await nodoService.getNodoById(req.params.id);
        if (!nodo) {
            return res.status(404).json({ success: false, message: 'Nodo no encontrado' });
        }
        res.json({ success: true, data: nodo });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createNodo,
    getNodos,
    getNodoById
};
