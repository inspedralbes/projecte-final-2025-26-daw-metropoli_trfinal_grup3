const categoriaModel = require('../models/categoriaModel');

const createCategoria = async (categoriaData) => {
    return await categoriaModel.create(categoriaData);
};

const getAllCategorias = async () => {
    return await categoriaModel.getAll();
};

module.exports = {
    createCategoria,
    getAllCategorias
};
