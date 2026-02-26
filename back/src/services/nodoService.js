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

const getNodesWithPoi = async () => {
    return await nodoModel.getNodesWithPoi();
};

export default {
    createNodo,
    getAllNodos,
    getNodoById,
    getNodesWithPoi
};
