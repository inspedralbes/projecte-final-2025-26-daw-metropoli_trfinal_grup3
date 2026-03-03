import { query } from '../config/mysql.js';

const create = async (poi, connection = null) => {
    const runQuery = connection ? connection.query.bind(connection) : query;
    const { nombre, descripcion, latitud, longitud, id_categoria, es_accesible, es_fijo, imagen_url, id_nodo_acceso } = poi;
    const [result] = await runQuery(
        'INSERT INTO pois (nombre, descripcion, latitud, longitud, id_categoria, es_accesible, es_fijo, imagen_url, id_nodo_acceso) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, latitud, longitud, id_categoria, es_accesible, es_fijo, imagen_url, id_nodo_acceso]
    );
    return { id_poi: result.insertId, ...poi };
};

const getAll = async () => {
    const [rows] = await query('SELECT * FROM pois');
    return rows;
};

const getNodoAccesoId = async (idPoi) => {
    const [rows] = await query('SELECT id_nodo_acceso FROM pois WHERE id_poi = ?', [idPoi]);
    return rows[0] ? rows[0].id_nodo_acceso : null;
};

const deleteById = async (id) => {
    return await query('DELETE FROM pois WHERE id_poi = ?', [id]);
};

const nullifyNodeReference = async (nodeId) => {
    return await query('UPDATE pois SET id_nodo_acceso = NULL WHERE id_nodo_acceso = ?', [nodeId]);
};

export default {
    create,
    getAll,
    getNodoAccesoId,
    deleteById,
    nullifyNodeReference
};
