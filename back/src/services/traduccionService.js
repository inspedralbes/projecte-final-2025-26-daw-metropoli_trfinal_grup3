import traduccionModel from '../models/traduccionModel.js';

const createTraduccion = async (traduccionData) => {
    return await traduccionModel.create(traduccionData);
};

const getAllTraducciones = async () => {
    return await traduccionModel.getAll();
};

export default {
    createTraduccion,
    getAllTraducciones
};
