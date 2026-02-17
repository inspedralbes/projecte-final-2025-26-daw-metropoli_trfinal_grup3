const pool = require('../config/mysql');

const create = async (poi, connection = pool) => {
    const { nombre, descripcion, latitud, longitud, id_categoria, es_accesible, es_fijo, imagen_url, id_nodo_acceso } = poi;
    const [result] = await connection.query(
        'INSERT INTO pois (nombre, descripcion, latitud, longitud, id_categoria, es_accesible, es_fijo, imagen_url, id_nodo_acceso) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, latitud, longitud, id_categoria, es_accesible, es_fijo, imagen_url, id_nodo_acceso]
    );
    return { id_poi: result.insertId, ...poi };
};

const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM pois');
    return rows;
};

module.exports = {
    create,
    getAll
};
