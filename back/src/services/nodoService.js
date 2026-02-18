import nodoModel from '../models/nodoModel.js';

const createNodo = async (nodoData) => {
    return await nodoModel.create(nodoData);
};

const getAllNodos = async () => {
    return await nodoModel.getAll();
};

const getNodoById = async (id) => {
    return await nodoModel.getById(id);
};

export default {
    createNodo,
    getAllNodos,
    getNodoById
};
