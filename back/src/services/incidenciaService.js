import incidenciaModel from '../models/incidenciaModel.js';

const createIncidencia = async (incidenciaData) => {
    return await incidenciaModel.create(incidenciaData);
};

const getAllIncidencias = async () => {
    return await incidenciaModel.getAll();
};

export default {
    createIncidencia,
    getAllIncidencias
};
