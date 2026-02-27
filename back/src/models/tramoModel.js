import { query } from '../config/mysql.js';

const create = async (tramo) => {
    const { id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno } = tramo;
    const [result] = await query(
        'INSERT INTO rutas_tramos (id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno) VALUES (?, ?, ?, ?, ?)',
        [id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno]
    );
    return { id_tramo: result.insertId, ...tramo };
};

const getAll = async () => {
    const [rows] = await query('SELECT * FROM rutas_tramos');
    return rows;
};

export default {
    create,
    getAll
};
