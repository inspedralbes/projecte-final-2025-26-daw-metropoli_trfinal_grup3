const nodoModel = require('../models/nodoModel');

const createNodo = async (nodoData) => {
    return await nodoModel.create(nodoData);
};

const getAllNodos = async () => {
    return await nodoModel.getAll();
};

const getNodoById = async (id) => {
    return await nodoModel.getById(id);
};

module.exports = {
    createNodo,
    getAllNodos,
    getNodoById
};
