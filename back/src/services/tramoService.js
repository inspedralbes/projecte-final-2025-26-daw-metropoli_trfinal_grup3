const tramoModel = require('../models/tramoModel');

const createTramo = async (tramoData) => {
    return await tramoModel.create(tramoData);
};

const getAllTramos = async () => {
    return await tramoModel.getAll();
};

module.exports = {
    createTramo,
    getAllTramos
};
