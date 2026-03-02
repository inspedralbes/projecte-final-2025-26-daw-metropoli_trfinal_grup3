import usuarioModel from '../models/usuarioModel.js';

const registerUsuario = async (usuarioData) => {
    // Aquí se podría hashear la password si no se hace en controlador o modelo
    return await usuarioModel.create(usuarioData);
};

const getAllUsuarios = async () => {
    return await usuarioModel.getAll();
};

const getUsuarioById = async (id) => {
    return await usuarioModel.getById(id);
};

const actualizarPerfil = async (id, nombre, bio, fotoPerfil) => {
    return await usuarioModel.updatePerfil(id, nombre, bio, fotoPerfil);
};

export default {
    registerUsuario,
    getAllUsuarios,
    getUsuarioById,
    actualizarPerfil
};
