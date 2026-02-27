import { query } from '../config/mysql.js';

const create = async (nodo, connection = null) => {
    const runQuery = connection ? connection.query.bind(connection) : query;
    const { latitud, longitud, descripcion } = nodo;
    const [result] = await runQuery(
        'INSERT INTO nodos_navegacion (latitud, longitud, descripcion) VALUES (?, ?, ?)',
        [latitud, longitud, descripcion]
    );
    return { id_nodo: result.insertId, ...nodo };
};

const getAll = async () => {
    const [rows] = await query('SELECT * FROM nodos_navegacion');
    return rows;
};

const getById = async (id) => {
    const [rows] = await query('SELECT * FROM nodos_navegacion WHERE id_nodo = ?', [id]);
    return rows[0];
};

const getNodesWithPoi = async () => {
    const [rows] = await query(`
        SELECT n.*, p.nombre as poi_nombre 
        FROM nodos_navegacion n
        INNER JOIN pois p ON n.id_nodo = p.id_nodo_acceso
    `);
    return rows;
};

const deleteById = async (id) => {
    return await query('DELETE FROM nodos_navegacion WHERE id_nodo = ?', [id]);
};

export default {
    create,
    getAll,
    getById,
    getNodesWithPoi,
    deleteById
};
