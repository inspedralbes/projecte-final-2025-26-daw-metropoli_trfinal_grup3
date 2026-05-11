import { query } from '../config/mysql.js';

const create = async (lista) => {
    const { id_usuario, nombre, descripcion, visibilidad, imagen_url } = lista;
    const [result] = await query(
        'INSERT INTO listas (id_usuario, nombre, descripcion, visibilidad, imagen_url) VALUES (?, ?, ?, ?, ?)',
        [id_usuario, nombre, descripcion || null, visibilidad || 'private', imagen_url || null]
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
    const [rows] = await query(
        `SELECT l.*, u.nombre as usuario_nombre, u.foto_perfil as usuario_foto 
         FROM listas l 
         JOIN usuario u ON l.id_usuario = u.id_usuario 
         WHERE l.id_lista = ?`, 
        [id]
    );
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
    let sql = `
        SELECT l.*, u.nombre as usuario_nombre, u.foto_perfil as usuario_foto
        FROM listas l
        JOIN usuario u ON l.id_usuario = u.id_usuario
        WHERE l.visibilidad = 'public'
    `;
    const params = [];
    
    if (currentUserId) {
        sql = `
            SELECT l.*, u.nombre as usuario_nombre, u.foto_perfil as usuario_foto,
            (SELECT COUNT(*) FROM lista_likes ll WHERE ll.id_lista = l.id_lista AND ll.id_usuario = ?) as user_liked
            FROM listas l
            JOIN usuario u ON l.id_usuario = u.id_usuario
            WHERE l.visibilidad = 'public'
        `;
        params.push(currentUserId);
    }

    const [rows] = await query(sql, params);
    return rows;
};

const getFriendsListas = async (currentUserId) => {
    const [rows] = await query(
        `SELECT DISTINCT l.*, u.nombre as usuario_nombre, u.foto_perfil as usuario_foto,
         (SELECT COUNT(*) FROM lista_likes ll WHERE ll.id_lista = l.id_lista AND ll.id_usuario = ?) as user_liked
         FROM listas l
         JOIN usuario u ON l.id_usuario = u.id_usuario
         JOIN amigos a ON (l.id_usuario = a.id_usuario AND a.id_amigo = ?) 
                        OR (l.id_usuario = a.id_amigo AND a.id_usuario = ?)
         WHERE l.visibilidad IN ('public', 'friends')
           AND l.id_usuario != ?`,
        [currentUserId, currentUserId, currentUserId, currentUserId]
    );
    return rows;
};

const getByUsuarioId = async (id_usuario) => {
    const [rows] = await query(
        `SELECT l.*, u.nombre as usuario_nombre, u.foto_perfil as usuario_foto 
         FROM listas l 
         JOIN usuario u ON l.id_usuario = u.id_usuario 
         WHERE l.id_usuario = ?`, 
        [id_usuario]
    );
    return rows;
};

const deleteById = async (id) => {
    await query('DELETE FROM lista_pois WHERE id_lista = ?', [id]);
    await query('DELETE FROM lista_likes WHERE id_lista = ?', [id]);
    return await query('DELETE FROM listas WHERE id_lista = ?', [id]);
};

const update = async (id, data) => {
    const { nombre, descripcion, visibilidad, imagen_url } = data;
    return await query(
        'UPDATE listas SET nombre = ?, descripcion = ?, visibilidad = ?, imagen_url = ? WHERE id_lista = ?',
        [nombre, descripcion, visibilidad, imagen_url, id]
    );
};

const toggleLike = async (id_lista, id_usuario) => {
    // 1. Verificamos si ya existe el like
    const [existing] = await query(
        'SELECT * FROM lista_likes WHERE id_lista = ? AND id_usuario = ?',
        [id_lista, id_usuario]
    );

    if (existing.length > 0) {
        // Quitar like
        await query('DELETE FROM lista_likes WHERE id_lista = ? AND id_usuario = ?', [id_lista, id_usuario]);
        await query('UPDATE listas SET likes = likes - 1 WHERE id_lista = ?', [id_lista]);
        return { liked: false };
    } else {
        // Poner like
        await query('INSERT INTO lista_likes (id_lista, id_usuario) VALUES (?, ?)', [id_lista, id_usuario]);
        await query('UPDATE listas SET likes = likes + 1 WHERE id_lista = ?', [id_lista]);
        return { liked: true };
    }
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
    getFriendsListas,
    getByUsuarioId,
    deleteById,
    update,
    toggleLike,
    updateImageUrl,
    removeAllPoisFromLista
};
