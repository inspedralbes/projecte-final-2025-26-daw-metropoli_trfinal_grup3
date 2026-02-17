const traduccionModel = require('../models/traduccionModel');

const createTraduccion = async (traduccionData) => {
    return await traduccionModel.create(traduccionData);
};

const getAllTraducciones = async () => {
    return await traduccionModel.getAll();
};

module.exports = {
    createTraduccion,
    getAllTraducciones
};
