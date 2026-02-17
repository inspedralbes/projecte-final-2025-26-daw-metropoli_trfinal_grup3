import usuarioService from '../services/usuarioService.js';

const createUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        const nuevoUsuario = await usuarioService.registerUsuario({ nombre, email, password, rol });
        res.status(201).json({
            success: true,
            message: 'Usuario registrado correctamente',
            data: nuevoUsuario
        });
    } catch (error) {
        if (error.code === 'EMAIL_EXISTS') {
            return res.status(400).json({
                success: false,
                message: error.message,
                error_code: error.code
            });
        }
        res.status(500).json({ 
            success: false, 
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

const getUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.getAllUsuarios();
        res.json({ 
            success: true, 
            message: 'Lista de usuarios recuperada',
            data: usuarios 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

export default {
    createUsuario,
    getUsuarios
};
