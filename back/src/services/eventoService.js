const eventoModel = require('../models/eventoModel');

const createEvento = async (eventoData) => {
    return await eventoModel.create(eventoData);
};

const getAllEventos = async () => {
    return await eventoModel.getAll();
};

module.exports = {
    createEvento,
    getAllEventos
};
