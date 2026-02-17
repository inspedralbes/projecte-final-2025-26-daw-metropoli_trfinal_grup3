const incidenciaModel = require('../models/incidenciaModel');

const createIncidencia = async (incidenciaData) => {
    return await incidenciaModel.cre2ate(incidenciaData);
};

const getAllIncidencias = async () => {
    return await incidenciaModel.getAll();
};

module.exports = {
    createIncidencia,
    getAllIncidencias
};
