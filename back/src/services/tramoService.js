import tramoModel from '../models/tramoModel.js';

const createTramo = async (tramoData) => {
    return await tramoModel.create(tramoData);
};

const getAllTramos = async () => {
    return await tramoModel.getAll();
};

export default {
    createTramo,
    getAllTramos
};
