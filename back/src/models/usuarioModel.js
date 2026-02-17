const pool = require('../config/mysql');

const create = async (usuario) => {
    const { nombre, email, password, rol } = usuario;
    const [result] = await pool.query(
        'INSERT INTO usuario (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
        [nombre, email, password, rol]
    );
    return { id_usuario: result.insertId, ...usuario };
};

const findByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE email = ?', [email]);
    return rows[0];
};

const getAll = async () => {
    const [rows] = await pool.query('SELECT id_usuario, nombre, email, rol, fecha_registro FROM usuario');
    return rows;
};

module.exports = {
    create,
    findByEmail,
    getAll
};
