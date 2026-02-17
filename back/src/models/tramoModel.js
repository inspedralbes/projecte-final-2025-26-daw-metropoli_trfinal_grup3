const pool = require('../config/mysql');

const create = async (tramo) => {
    const { id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno, es_bidireccional } = tramo;
    const [result] = await pool.query(
        'INSERT INTO rutas_tramos (id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno, es_bidireccional) VALUES (?, ?, ?, ?, ?, ?)',
        [id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno, es_bidireccional]
    );
    return { id_tramo: result.insertId, ...tramo };
};

const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM rutas_tramos');
    return rows;
};

module.exports = {
    create,
    getAll
};
