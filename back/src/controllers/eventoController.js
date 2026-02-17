import eventoService from '../services/eventoService.js';

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
        res.status(500).json({ 
            success: false, 
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

const getEventos = async (req, res) => {
    try {
        const eventos = await eventoService.getAllEventos();
        res.json({ 
            success: true, 
            message: 'Eventos recuperados',
            data: eventos 
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
    createEvento,
    getEventos
};
