import { query } from '../config/mysql.js';

const create = async (traduccion) => {
    const { tabla_origen, id_registro_origen, codigo_idioma, campo_traducido, texto } = traduccion;
    const [result] = await query(
        'INSERT INTO traducciones (tabla_origen, id_registro_origen, codigo_idioma, campo_traducido, texto) VALUES (?, ?, ?, ?, ?)',
        [tabla_origen, id_registro_origen, codigo_idioma, campo_traducido, texto]
    );
    return { id_traduccion: result.insertId, ...traduccion };
};

const getAll = async () => {
    const [rows] = await query('SELECT * FROM traducciones');
    return rows;
};

export default {
    create,
    getAll
};
