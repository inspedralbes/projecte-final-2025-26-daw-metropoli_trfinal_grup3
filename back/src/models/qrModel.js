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

// Obtiene todos los QRs generados ordenados del más reciente al más antiguo
const getAll = async () => {
    const [rows] = await query(`
        SELECT q.*, n.descripcion as nodo_descripcion 
        FROM qr_codes q
        LEFT JOIN nodos_navegacion n ON q.id_nodo_inicio = n.id_nodo
        ORDER BY q.fecha_creacion DESC
    `);
    return rows;
};

export default {
    create,
    getByIdNodo,
    getAll
};
