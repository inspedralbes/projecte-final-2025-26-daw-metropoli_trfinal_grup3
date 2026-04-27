import { query } from '../config/mysql.js';

const create = async (lista) => {
    const { id_usuario, nombre, descripcion, visibilidad } = lista;
    const [result] = await query(
        'INSERT INTO listas (id_usuario, nombre, descripcion, visibilidad) VALUES (?, ?, ?, ?)',
        [id_usuario, nombre, descripcion, visibilidad]
    );
    return { id_lista: result.insertId, ...lista };
};

const addPoiToLista = async (id_lista, id_poi, orden) => {
    return await query(
        'INSERT INTO lista_pois (id_lista, id_poi, orden) VALUES (?, ?, ?)',
        [id_lista, id_poi, orden]
    );
};

const getById = async (id) => {
    const [rows] = await query('SELECT * FROM listas WHERE id_lista = ?', [id]);
    return rows[0];
};

const getPoisByListaId = async (id_lista) => {
    const [rows] = await query(
        `SELECT p.*, lp.orden 
         FROM pois p 
         JOIN lista_pois lp ON p.id_poi = lp.id_poi 
         WHERE lp.id_lista = ? 
         ORDER BY lp.orden`,
        [id_lista]
    );
    return rows;
};

const getPublicListas = async () => {
    const [rows] = await query('SELECT * FROM listas WHERE visibilidad = "public"');
    return rows;
};

const getByUsuarioId = async (id_usuario) => {
    const [rows] = await query('SELECT * FROM listas WHERE id_usuario = ?', [id_usuario]);
    return rows;
};

const deleteById = async (id) => {
    await query('DELETE FROM lista_pois WHERE id_lista = ?', [id]);
    return await query('DELETE FROM listas WHERE id_lista = ?', [id]);
};

export default {
    create,
    addPoiToLista,
    getById,
    getPoisByListaId,
    getPublicListas,
    getByUsuarioId,
    deleteById
};
