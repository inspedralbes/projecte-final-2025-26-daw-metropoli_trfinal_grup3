import { query } from '../config/mysql.js';

const create = async (usuario) => {
    const { nombre, email, password, rol } = usuario;
    const [result] = await query(
        'INSERT INTO usuario (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
        [nombre, email, password, rol]
    );
    return { id_usuario: result.insertId, ...usuario };
};

const findByEmail = async (email) => {
    const [rows] = await query('SELECT * FROM usuario WHERE email = ?', [email]);
    return rows[0];
};

const getAll = async () => {
    const [rows] = await query('SELECT id_usuario, nombre, email, rol, fecha_registro FROM usuario');
    return rows;
};

const getById = async (id) => {
    const [rows] = await query('SELECT * FROM usuario WHERE id_usuario = ?', [id]);
    return rows[0];
};

const updatePerfil = async (id, nombre, bio, fotoPerfil) => {
    await query(
        'UPDATE usuario SET nombre = ?, bio = ?, foto_perfil = ? WHERE id_usuario = ?',
        [nombre, bio, fotoPerfil, id]
    );
};

export default {
    create,
    findByEmail,
    getAll,
    getById,
    updatePerfil
};
