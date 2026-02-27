import amigoModel from '../models/amigoModel.js';
import usuarioModel from '../models/usuarioModel.js';

const getAmigos = async (req, res) => {
    try {
        const { userId } = req.params;
        const amigos = await amigoModel.getFriendsByUserId(userId);
        res.json({
            success: true,
            data: amigos
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addAmigo = async (req, res) => {
    try {
        const { id_usuario, id_amigo } = req.body;

        if (!id_usuario || !id_amigo) {
            return res.status(400).json({ success: false, message: 'Faltan IDs de usuario' });
        }

        if (id_usuario == id_amigo) {
            return res.status(400).json({ success: false, message: 'No puedes añadirte a ti mismo como amigo' });
        }

        // Verificar si el amigo existe
        const amigoExiste = await usuarioModel.getById(id_amigo);
        if (!amigoExiste) {
            return res.status(404).json({ success: false, message: 'El usuario que intentas añadir no existe' });
        }

        await amigoModel.addFriend(id_usuario, id_amigo);

        res.json({
            success: true,
            message: 'Amigo añadido correctamente'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const removeAmigo = async (req, res) => {
    try {
        const { userId, friendId } = req.params;
        await amigoModel.deleteFriend(userId, friendId);
        res.json({
            success: true,
            message: 'Amigo eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default {
    getAmigos,
    addAmigo,
    removeAmigo
};
