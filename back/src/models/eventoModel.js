import { query } from '../config/mysql.js';

const create = async (evento) => {
    const { nombre, descripcion, fecha_inicio, fecha_fin, estado } = evento;
    const [result] = await query(
        'INSERT INTO eventos (nombre, descripcion, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?)',
        [nombre, descripcion, fecha_inicio, fecha_fin, estado]
    );
    return { id_evento: result.insertId, ...evento };
};

const getAll = async () => {
    const [rows] = await query('SELECT * FROM eventos');
    return rows;
};

export default {
    create,
    getAll
};
