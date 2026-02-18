import { query } from '../config/mysql.js';

const create = async (categoria) => {
    const { nombre, icono_url, color_hex } = categoria;
    const [result] = await query(
        'INSERT INTO categoria (nombre, icono_url, color_hex) VALUES (?, ?, ?)',
        [nombre, icono_url, color_hex]
    );
    return { id_categoria: result.insertId, ...categoria };
};

const getAll = async () => {
    const [rows] = await query('SELECT * FROM categoria');
    return rows;
};

export default {
    create,
    getAll
};