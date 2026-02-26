import comunidadModel from '../models/comunidadModel.js';

const createPublicacion = async (publicacionData) => {
    return await comunidadModel.create(publicacionData);
};

const getAllPublicaciones = async () => {
    return await comunidadModel.getAll();
};

export default {
    createPublicacion,
    getAllPublicaciones
};
