import eventoModel from '../models/eventoModel.js';

const createEvento = async (eventoData) => {
    return await eventoModel.create(eventoData);
};

const getAllEventos = async () => {
    return await eventoModel.getAll();
};

const updateEvento = async (id, eventoData) => {
    return await eventoModel.update(id, eventoData);
};

const getNextEvento = async () => {
    return await eventoModel.getNext();
};

export default {
    createEvento,
    getAllEventos,
    updateEvento,
    getNextEvento
};
