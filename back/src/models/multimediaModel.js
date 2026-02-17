const pool = require('../config/mysql');

const create = async (media, connection = pool) => {
    // media: [id_poi, url_archivo, tipo, titulo, orden]
    const [result] = await connection.query(
        'INSERT INTO poi_multimedia (id_poi, url_archivo, tipo, titulo, orden) VALUES (?, ?, ?, ?, ?)',
        media
    );
    return result;
};

const createBulk = async (multimedia, connection = pool) => {
     // multimedia: [[id_poi, url_archivo, tipo, titulo, orden], ...]
    if (!multimedia || multimedia.length === 0) return;
    const [result] = await connection.query(
        'INSERT INTO poi_multimedia (id_poi, url_archivo, tipo, titulo, orden) VALUES ?',
        [multimedia]
    );
    return result;
};

const getByPoiId = async (idPoi) => {
    const [rows] = await pool.query('SELECT * FROM poi_multimedia WHERE id_poi = ?', [idPoi]);
    return rows;
};

module.exports = {
    create,
    createBulk,
    getByPoiId
};
