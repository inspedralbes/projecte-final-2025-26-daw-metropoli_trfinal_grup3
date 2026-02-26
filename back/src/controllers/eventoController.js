import eventoService from '../services/eventoService.js';
import { emitirMensaje } from '../config/socket.js'; // Traemos nuestra antena

const createEvento = async (req, res) => {
    try {
        const { nombre, descripcion, fecha_inicio, fecha_fin, estado } = req.body;

        // Si hay una imagen subida por multer, creamos su ruta pública, si no usamos req.body.foto si viene
        const fotoPath = req.file ? `/images/eventos/${req.file.filename}` : req.body.foto;

        const nuevoEvento = await eventoService.createEvento({
            nombre,
            descripcion,
            foto: fotoPath,
            fecha_inicio: new Date(fecha_inicio),
            fecha_fin: new Date(fecha_fin),
            estado
        });

        // 📻 Anunciamos el cambio por el canal "actualizacion_eventos" a toda la gente conectada
        emitirMensaje('actualizacion_eventos', 'Se ha creado un nuevo evento');

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

        // Si hay una nueva imagen subida, pisamos la que viene en el data (si venía alguna str)
        if (req.file) {
            data.foto = `/images/eventos/${req.file.filename}`;
        }

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

        // Convertir las strings a Date para que la DB lo guarde sin problemas
        if (data.fecha_inicio) data.fecha_inicio = new Date(data.fecha_inicio);
        if (data.fecha_fin) data.fecha_fin = new Date(data.fecha_fin);

        const result = await eventoService.updateEvento(id, data);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        }

        // 📻 Anunciamos a todo el mundo que alguien ha tocado/editado un evento
        emitirMensaje('actualizacion_eventos', `Se ha actualizado el evento ${id}`);

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
