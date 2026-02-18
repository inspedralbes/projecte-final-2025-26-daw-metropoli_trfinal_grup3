import usuarioModel from '../models/usuarioModel.js';

const registerUsuario = async (usuarioData) => {
    // Aquí se podría hashear la password si no se hace en controlador o modelo
    return await usuarioModel.create(usuarioData);
};

const getAllUsuarios = async () => {
    return await usuarioModel.getAll();
};

export default {
    registerUsuario,
    getAllUsuarios
};
