import { query } from '../config/mysql.js';

const create = async (publicacion) => {
    const { id_usuario, texto, foto, likes, tipo_publicacion, ubicacion } = publicacion;
    const [result] = await query(
        'INSERT INTO comunidad (id_usuario, texto, foto, likes, tipo_publicacion, ubicacion) VALUES (?, ?, ?, ?, ?, ?)',
        [id_usuario, texto, foto, likes ?? 0, tipo_publicacion ?? 'popular', ubicacion]
    );
    return { id_publicacion: result.insertId, ...publicacion };
};

const getAll = async () => {
    const [rows] = await query('SELECT * FROM comunidad');
    return rows;
};

export default {
    create,
    getAll
};
