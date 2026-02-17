const pool = require('../config/mysql');

const create = async (categoria) => {
    const { nombre, icono_url, color_hex } = categoria;
    const [result] = await pool.query(
        'INSERT INTO categoria (nombre, icono_url, color_hex) VALUES (?, ?, ?)',
        [nombre, icono_url, color_hex]
    );
    return { id_categoria: result.insertId, ...categoria };
};

const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM categoria');
    return rows;
};

module.exports = {
    create,
    getAll
};