import { query } from '../config/mysql.js';

const create = async (tramo) => {
    const { id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno } = tramo;
    const [result] = await query(
        'INSERT INTO rutas_tramos (id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno) VALUES (?, ?, ?, ?, ?)',
        [id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno]
    );
    return { id_tramo: result.insertId, ...tramo };
};

const getAll = async () => {
    const [rows] = await query('SELECT * FROM rutas_tramos');
    return rows;
};

const deleteById = async (id) => {
    return await query('DELETE FROM rutas_tramos WHERE id_tramo = ?', [id]);
};

const deleteByNodeId = async (nodeId) => {
    return await query('DELETE FROM rutas_tramos WHERE id_nodo_origen = ? OR id_nodo_destino = ?', [nodeId, nodeId]);
};

const getByNodeId = async (nodeId) => {
    const [rows] = await query('SELECT * FROM rutas_tramos WHERE id_nodo_origen = ? OR id_nodo_destino = ?', [nodeId, nodeId]);
    return rows;
};

export default {
    create,
    getAll,
    deleteById,
    deleteByNodeId,
    getByNodeId
};
