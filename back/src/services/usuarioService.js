const usuarioModel = require('../models/usuarioModel');

const registerUsuario = async (userData) => {
    const existingUser = await usuarioModel.findByEmail(userData.email);
    if (existingUser) {
        const error = new Error('El correo electrónico ya está registrado');
        error.code = 'EMAIL_EXISTS';
        throw error;
    }
    
    // Aquí se debería hashear la contraseña antes de pasarla al modelo
    // const hashedPassword = await bcrypt.hash(userData.password, 10);
    // userData.password = hashedPassword;

    return await usuarioModel.create(userData);
};

const getAllUsuarios = async () => {
    return await usuarioModel.getAll();
};

module.exports = {
    registerUsuario,
    getAllUsuarios
};
