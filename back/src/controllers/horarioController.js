const horarioService = require('../services/horarioService');

const createHorario = async (req, res) => {
    try {
        const { id_poi, id_evento, dia_semana, hora_apertura, hora_cierre } = req.body;
        const result = await horarioService.createHorario({ id_poi, id_evento, dia_semana, hora_apertura, hora_cierre });
        res.status(201).json({
            success: true,
            message: 'Horario creado',
            data: result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getHorariosByPoi = async (req, res) => {
    try {
        const { id_poi } = req.params;
        if (!id_poi) {
            return res.status(400).json({ success: false, message: 'ID de POI requerido' });
        }
        const horarios = await horarioService.getHorariosByPoi(id_poi);
        res.json({ success: true, data: horarios });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createHorario,
    getHorariosByPoi
};
