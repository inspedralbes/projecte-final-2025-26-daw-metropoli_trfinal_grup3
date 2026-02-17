import { query } from '../config/mysql.js';

const create = async (tramo) => {
    const { id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno, es_bidireccional } = tramo;
    const [result] = await query(
        'INSERT INTO rutas_tramos (id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno, es_bidireccional) VALUES (?, ?, ?, ?, ?, ?)',
        [id_nodo_origen, id_nodo_destino, distancia_metros, es_accesible, tipo_terreno, es_bidireccional]
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
