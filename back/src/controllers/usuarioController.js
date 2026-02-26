import usuarioService from '../services/usuarioService.js';
import { emitirMensaje } from '../config/socket.js'; // La antena para avisar a los clientes
import fs from 'fs'; // Herramienta de Node para borrar archivos del disco duro
import path from 'path';

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

const editarPerfil = async (req, res) => {
    try {
        const idUsuario = req.params.id;
        const { nombre, bio } = req.body;

        // 1. Buscamos al usuario actual para saber qué foto tiene ahora mismo
        const usuarioActual = await usuarioService.getUsuarioById(idUsuario);
        if (!usuarioActual) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // 2. Si el usuario ha subido una foto nueva, usamos esa. Si no, mantenemos la antigua.
        let rutaNuevaFoto = usuarioActual.foto_perfil;

        if (req.file) {
            // Construimos la ruta que se guardará en la base de datos
            rutaNuevaFoto = `/images/usuarios/${req.file.filename}`;

            // 3. Borramos la foto antigua del disco duro para no acumular basura
            if (usuarioActual.foto_perfil) {
                const rutaFotoAntigua = path.join('public', usuarioActual.foto_perfil);
                if (fs.existsSync(rutaFotoAntigua)) {
                    fs.unlinkSync(rutaFotoAntigua); // Eliminación física del archivo antiguo
                    console.log(`🗑️ Foto antigua eliminada: ${rutaFotoAntigua}`);
                }
            }
        }

        // 4. Guardamos los datos nuevos en la base de datos
        await usuarioService.actualizarPerfil(idUsuario, nombre, bio, rutaNuevaFoto);

        // 5. Avisamos por radio a todos los que estén en la pantalla de Comunidad
        emitirMensaje('perfil_actualizado', {
            id_usuario: idUsuario,
            nuevo_nombre: nombre,
            nueva_foto: rutaNuevaFoto
        });

        res.json({
            success: true,
            message: 'Perfil actualizado correctamente',
            data: { id_usuario: idUsuario, nombre, bio, foto_perfil: rutaNuevaFoto }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

const getUsuarioById = async (req, res) => {
    try {
        const usuario = await usuarioService.getUsuarioById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        // Devolvemos todos los campos menos la password por seguridad
        const { password_hash, ...datosPublicos } = usuario;
        res.json({ success: true, data: datosPublicos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default {
    createUsuario,
    getUsuarios,
    getUsuarioById,
    editarPerfil
};
