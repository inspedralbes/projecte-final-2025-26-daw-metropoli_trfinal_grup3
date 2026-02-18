import { query } from '../config/mysql.js';

const create = async (incidencia) => {
    const { id_poi, id_usuario_reporta, tipo, descripcion, estado } = incidencia;
    const [result] = await query(
        'INSERT INTO incidencias (id_poi, id_usuario_reporta, tipo, descripcion, estado) VALUES (?, ?, ?, ?, ?)',
        [id_poi, id_usuario_reporta, tipo, descripcion, estado]
    );
    return { id_incidencia: result.insertId, ...incidencia };
};

const getAll = async () => {
    const [rows] = await query('SELECT * FROM incidencias');
    return rows;
};

export default {
    create,
    getAll
};
