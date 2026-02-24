import { query } from '../config/mysql.js';

const create = async (qrData) => {
    const { slug, id_nodo_inicio, ruta_archivo_qr } = qrData;
    const [result] = await query(
        'INSERT INTO qr_codes (slug, id_nodo_inicio, ruta_archivo_qr) VALUES (?, ?, ?)',
        [slug, id_nodo_inicio, ruta_archivo_qr]
    );
    return { id_qr: result.insertId, ...qrData };
};

const getByIdNodo = async (id_nodo_inicio) => {
    const [rows] = await query('SELECT * FROM qr_codes WHERE id_nodo_inicio = ?', [id_nodo_inicio]);
    return rows[0]; 
};

export default {
    create,
    getByIdNodo
};
