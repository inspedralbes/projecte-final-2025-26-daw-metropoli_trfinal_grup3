import categoriaModel from '../models/categoriaModel.js';

const createCategoria = async (categoriaData) => {
    return await categoriaModel.create(categoriaData);
};

const getAllCategorias = async () => {
    return await categoriaModel.getAll();
};

export default {
    createCategoria,
    getAllCategorias
};
