import eventoModel from '../models/eventoModel.js';

const createEvento = async (eventoData) => {
    return await eventoModel.create(eventoData);
};

const getAllEventos = async () => {
    return await eventoModel.getAll();
};

export default {
    createEvento,
    getAllEventos
};
