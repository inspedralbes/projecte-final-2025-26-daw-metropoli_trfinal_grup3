const incidenciaService = require('../services/incidenciaService');

const createIncidencia = async (req, res) => {
    try {
        const { id_poi, id_usuario_reporta, tipo, descripcion, estado } = req.body;
        const nuevaIncidencia = await incidenciaService.createIncidencia({ id_poi, id_usuario_reporta, tipo, descripcion, estado });
        res.status(201).json({
            success: true,
            message: 'Incidencia reportada',
            data: nuevaIncidencia
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getIncidencias = async (req, res) => {
    try {
        const incidencias = await incidenciaService.getAllIncidencias();
        res.json({ success: true, data: incidencias });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createIncidencia,
    getIncidencias
};
