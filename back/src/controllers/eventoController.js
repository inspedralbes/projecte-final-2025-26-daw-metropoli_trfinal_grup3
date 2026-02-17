const eventoService = require('../services/eventoService');

const createEvento = async (req, res) => {
    try {
        const { nombre, descripcion, fecha_inicio, fecha_fin, estado } = req.body;
        const nuevoEvento = await eventoService.createEvento({ nombre, descripcion, fecha_inicio, fecha_fin, estado });
        res.status(201).json({
            success: true,
            message: 'Evento creado',
            data: nuevoEvento
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getEventos = async (req, res) => {
    try {
        const eventos = await eventoService.getAllEventos();
        res.json({ success: true, data: eventos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createEvento,
    getEventos
};
