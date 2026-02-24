import { query } from '../config/mysql.js';

const create = async (usuario) => {
    const { nombre, email, password, rol, token_verificacion } = usuario;
    const [result] = await query(
        'INSERT INTO usuario (nombre, email, password_hash, rol, token_verificacion, email_verificado) VALUES (?, ?, ?, ?, ?, FALSE)',
        [nombre, email, password, rol, token_verificacion]
    );
    return { id_usuario: result.insertId, ...usuario };
};

const findByEmail = async (email) => {
    const [rows] = await query('SELECT * FROM usuario WHERE email = ?', [email]);
    return rows[0];
};

const findByToken = async (token) => {
    const [rows] = await query('SELECT * FROM usuario WHERE token_verificacion = ?', [token]);
    return rows[0];
};

const verifyEmail = async (id_usuario) => {
    await query(
        'UPDATE usuario SET email_verificado = TRUE, token_verificacion = NULL WHERE id_usuario = ?',
        [id_usuario]
    );
};

const getAll = async () => {
    const [rows] = await query('SELECT id_usuario, nombre, email, rol, fecha_registro FROM usuario');
    return rows;
};

export default {
    create,
    findByEmail,
    findByToken,
    verifyEmail,
    getAll
};
