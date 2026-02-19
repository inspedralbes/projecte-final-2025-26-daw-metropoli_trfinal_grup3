import eventoService from '../services/eventoService.js';

const createEvento = async (req, res) => {
    try {
        const { nombre, descripcion, foto, fecha_inicio, fecha_fin, estado } = req.body;
        const nuevoEvento = await eventoService.createEvento({ nombre, descripcion, foto, fecha_inicio, fecha_fin, estado });
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

const updateEvento = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        // Validacion de fechas si ambas estan presentes
        if (data.fecha_inicio && data.fecha_fin) {
            const start = new Date(data.fecha_inicio).getTime();
            const end = new Date(data.fecha_fin).getTime();

            if (end <= start) {
                return res.status(400).json({
                    success: false,
                    message: 'La fecha de fin debe ser posterior a la fecha de inicio'
                });
            }
        }

        const result = await eventoService.updateEvento(id, data);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Evento actualizado correctamente',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

const getNextEvento = async (req, res) => {
    try {
        const eventos = await eventoService.getNextEvento();
        // Si no hay eventos, devolvemos un data null o vacio, no un 404
        var data = null;
        if (eventos && eventos.length > 0) {
            data = eventos[0];
        }

        res.json({
            success: true,
            message: 'Proximo evento recuperado',
            data: data
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
    getEventos,
    updateEvento,
    getNextEvento
};
