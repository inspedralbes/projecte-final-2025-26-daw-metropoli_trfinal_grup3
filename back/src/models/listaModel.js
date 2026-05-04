import { query } from '../config/mysql.js';

const create = async (lista) => {
    const { id_usuario, nombre, descripcion, visibilidad, imagen_url } = lista;
    const [result] = await query(
        'INSERT INTO listas (id_usuario, nombre, descripcion, visibilidad, imagen_url) VALUES (?, ?, ?, ?, ?)',
        [id_usuario, nombre, descripcion, visibilidad, imagen_url]
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

const getPublicListas = async (currentUserId = null) => {
    // Si no hay usuario, solo vemos las públicas
    if (!currentUserId) {
        const [rows] = await query('SELECT * FROM listas WHERE visibilidad = "public"');
        return rows;
    }

    // Si hay usuario, vemos: públicas, de amigos y las propias (incluso privadas)
    const [rows] = await query(
        `SELECT DISTINCT l.* 
         FROM listas l
         LEFT JOIN amigos a ON (l.id_usuario = a.id_usuario AND a.id_amigo = ?) 
                            OR (l.id_usuario = a.id_amigo AND a.id_usuario = ?)
         WHERE l.visibilidad = 'public' 
            OR l.id_usuario = ? 
            OR (l.visibilidad = 'friends' AND (a.id_usuario IS NOT NULL OR a.id_amigo IS NOT NULL))`,
        [currentUserId, currentUserId, currentUserId]
    );
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

const update = async (id, data) => {
    const { nombre, descripcion, visibilidad, imagen_url } = data;
    return await query(
        'UPDATE listas SET nombre = ?, descripcion = ?, visibilidad = ?, imagen_url = ? WHERE id_lista = ?',
        [nombre, descripcion, visibilidad, imagen_url, id]
    );
};

const updateImageUrl = async (id, imagen_url) => {
    return await query('UPDATE listas SET imagen_url = ? WHERE id_lista = ?', [imagen_url, id]);
};

const removeAllPoisFromLista = async (id_lista) => {
    return await query('DELETE FROM lista_pois WHERE id_lista = ?', [id_lista]);
};

export default {
    create,
    addPoiToLista,
    getById,
    getPoisByListaId,
    getPublicListas,
    getByUsuarioId,
    deleteById,
    update,
    updateImageUrl,
    removeAllPoisFromLista
};
