const pool = require('../config/mysql');

const create = async (nodo) => {
    const { latitud, longitud, descripcion } = nodo;
    const [result] = await pool.query(
        'INSERT INTO nodos_navegacion (latitud, longitud, descripcion) VALUES (?, ?, ?)',
        [latitud, longitud, descripcion]
    );
    return { id_nodo: result.insertId, ...nodo };
};

const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM nodos_navegacion');
    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM nodos_navegacion WHERE id_nodo = ?', [id]);
    return rows[0];
};

module.exports = {
    create,
    getAll,
    getById
};
