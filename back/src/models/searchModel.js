import { query } from '../config/mysql.js';

const searchUsuarios = async (searchTerm) => {
    const [rows] = await query(
        'SELECT id_usuario, nombre, foto_perfil, bio FROM usuario WHERE nombre LIKE ? LIMIT 5',
        [`%${searchTerm}%`]
    );
    return rows;
};

const searchListas = async (searchTerm, categoryId = null) => {
    let sql = 'SELECT id_lista, nombre, descripcion, imagen_url FROM listas WHERE visibilidad = "public" AND (nombre LIKE ? OR descripcion LIKE ?)';
    const params = [`%${searchTerm}%`, `%${searchTerm}%`];

    if (categoryId) {
        // Asumiendo que las listas pueden tener categoría, si no, este filtro se ignora o se adapta
        // Por ahora, si no hay tabla de relación lista_categoria, lo dejamos así o buscamos por nombre de categoría en la descripción
    }

    sql += ' LIMIT 5';
    const [rows] = await query(sql, params);
    return rows;
};

const searchPOIs = async (searchTerm, categoryId = null) => {
    let sql = 'SELECT id_poi, nombre, descripcion, id_categoria FROM pois WHERE (nombre LIKE ? OR descripcion LIKE ?)';
    const params = [`%${searchTerm}%`, `%${searchTerm}%`];

    if (categoryId) {
        sql += ' AND id_categoria = ?';
        params.push(categoryId);
    }

    sql += ' LIMIT 5';
    const [rows] = await query(sql, params);
    return rows;
};

export default {
    searchUsuarios,
    searchListas,
    searchPOIs
};
