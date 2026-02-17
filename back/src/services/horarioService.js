const horarioModel = require('../models/horarioModel');

// Este servicio puede ser usado por el POI service o independientemente
const createHorario = async (horarioData) => {
    // horarioData debe ser un array para el modelo: [id_poi, id_evento, dia_semana, hora_apertura, hora_cierre]
    // Pero el controlador pasará un objeto, así que lo transformamos aquí si es necesario
    const { id_poi, id_evento, dia_semana, hora_apertura, hora_cierre } = horarioData;
    return await horarioModel.create([id_poi, id_evento, dia_semana, hora_apertura, hora_cierre]);
};

const getHorariosByPoi = async (idPoi) => {
    return await horarioModel.getByPoiId(idPoi);
};

module.exports = {
    createHorario,
    getHorariosByPoi
};
