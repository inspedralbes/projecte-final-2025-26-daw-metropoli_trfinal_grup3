import { query } from '../config/mysql.js';

const create = async (horario, connection = null) => {
    // Si pasamos conexion (transaccion), la usamos. Si no, usamos query (pool)
    const runQuery = connection ? connection.query.bind(connection) : query;
    // horario: [id_poi, id_evento, dia_semana, hora_apertura, hora_cierre]
    const [result] = await runQuery(
        'INSERT INTO poi_horarios (id_poi, id_evento, dia_semana, hora_apertura, hora_cierre) VALUES (?, ?, ?, ?, ?)',
        horario
    );
    return result;
};

const createBulk = async (horarios, connection = null) => {
    const runQuery = connection ? connection.query.bind(connection) : query;
    // horarios: [[id_poi, id_evento, dia_semana, hora_apertura, hora_cierre], ...]
    if (!horarios || horarios.length === 0) return;
    const [result] = await runQuery(
        'INSERT INTO poi_horarios (id_poi, id_evento, dia_semana, hora_apertura, hora_cierre) VALUES ?',
        [horarios]
    );
    return result;
};

const getByPoiId = async (idPoi) => {
    const [rows] = await query('SELECT * FROM poi_horarios WHERE id_poi = ?', [idPoi]);
    return rows;
};

export default {
    create,
    createBulk,
    getByPoiId
};
