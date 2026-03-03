import nodoModel from '../models/nodoModel.js';
import tramoModel from '../models/tramoModel.js';
import poiModel from '../models/poiModel.js';

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

const deleteNode = async (id) => {
    // 1. Quitar referencia en POIs
    await poiModel.nullifyNodeReference(id);
    // 2. Borrar tramos asociados
    await tramoModel.deleteByNodeId(id);
    // 3. Borrar el nodo
    return await nodoModel.deleteById(id);
};

export default {
    createNodo,
    getAllNodos,
    getNodoById,
    getNodesWithPoi,
    deleteNode
};
