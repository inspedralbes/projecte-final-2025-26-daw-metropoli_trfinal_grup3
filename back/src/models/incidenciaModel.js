const pool = require('../config/mysql');

const create = async (incidencia) => {
    const { id_poi, id_usuario_reporta, tipo, descripcion, estado } = incidencia;
    const [result] = await pool.query(
        'INSERT INTO incidencias (id_poi, id_usuario_reporta, tipo, descripcion, estado) VALUES (?, ?, ?, ?, ?)',
        [id_poi, id_usuario_reporta, tipo, descripcion, estado]
    );
    return { id_incidencia: result.insertId, ...incidencia };
};

const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM incidencias');
    return rows;
};

module.exports = {
    create,
    getAll
};
