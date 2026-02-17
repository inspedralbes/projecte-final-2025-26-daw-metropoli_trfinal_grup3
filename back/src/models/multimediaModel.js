import { query } from '../config/mysql.js';

const create = async (media, connection = null) => {
    const runQuery = connection ? connection.query.bind(connection) : query;
    const [result] = await runQuery(
        'INSERT INTO poi_multimedia (id_poi, url_archivo, tipo, titulo, orden) VALUES (?, ?, ?, ?, ?)',
        media
    );
    return result;
};

const createBulk = async (multimedia, connection = null) => {
    const runQuery = connection ? connection.query.bind(connection) : query;
    if (!multimedia || multimedia.length === 0) return;
    const [result] = await runQuery(
        'INSERT INTO poi_multimedia (id_poi, url_archivo, tipo, titulo, orden) VALUES ?',
        [multimedia]
    );
    return result;
};

const getByPoiId = async (idPoi) => {
    const [rows] = await query('SELECT * FROM poi_multimedia WHERE id_poi = ?', [idPoi]);
    return rows;
};

export default {
    create,
    createBulk,
    getByPoiId
};
