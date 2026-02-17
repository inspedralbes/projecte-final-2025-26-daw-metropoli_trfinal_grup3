const pool = require('../config/mysql');

const create = async (horario, connection = pool) => {
    // horario: [id_poi, id_evento, dia_semana, hora_apertura, hora_cierre]
    const [result] = await connection.query(
        'INSERT INTO poi_horarios (id_poi, id_evento, dia_semana, hora_apertura, hora_cierre) VALUES (?, ?, ?, ?, ?)',
        horario
    );
    return result;
};

const createBulk = async (horarios, connection = pool) => {
    // horarios: [[id_poi, id_evento, dia_semana, hora_apertura, hora_cierre], ...]
    if (!horarios || horarios.length === 0) return;
    const [result] = await connection.query(
        'INSERT INTO poi_horarios (id_poi, id_evento, dia_semana, hora_apertura, hora_cierre) VALUES ?',
        [horarios]
    );
    return result;
};

const getByPoiId = async (idPoi) => {
    const [rows] = await pool.query('SELECT * FROM poi_horarios WHERE id_poi = ?', [idPoi]);
    return rows;
};

module.exports = {
    create,
    createBulk,
    getByPoiId
};
