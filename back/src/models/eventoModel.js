import { query } from '../config/mysql.js';

const create = async (evento) => {
    const { nombre, descripcion, fecha_inicio, fecha_fin, estado } = evento;
    const [result] = await query(
        'INSERT INTO eventos (nombre, descripcion, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?)',
        [nombre, descripcion, fecha_inicio, fecha_fin, estado]
    );
    return { id_evento: result.insertId, ...evento };
};

const getAll = async () => {
    const [rows] = await query('SELECT * FROM eventos');
    return rows;
};

const update = async (id, evento) => {
    //lo pongo asi porque asi no hace falta rellenar todo de nuevo si
    //el admin quiere cambiar solo la hora :D
    var fields = [];
    var values = [];

    if (evento.nombre) {
        fields.push("nombre = ?");
        values.push(evento.nombre);
    }
    if (evento.descripcion) {
        fields.push("descripcion = ?");
        values.push(evento.descripcion);
    }
    if (evento.fecha_inicio) {
        fields.push("fecha_inicio = ?");
        values.push(evento.fecha_inicio);
    }
    if (evento.fecha_fin) {
        fields.push("fecha_fin = ?");
        values.push(evento.fecha_fin);
    }
    if (evento.estado) {
        fields.push("estado = ?");
        values.push(evento.estado);
    }

    if (fields.length === 0) {
        return { affectedRows: 0 };
    }

    values.push(id);

    // Unimos los campos con coma y espacio
    const sql = "UPDATE eventos SET " + fields.join(", ") + " WHERE id_evento = ?";

    const result = await query(sql, values);
    return result[0];
};

const getNext = async () => {
    //esto es para que me devuelva el evento que empieza despues de ahora
    //para la cuenta atrás 
    const result = await query('SELECT * FROM eventos WHERE fecha_inicio >= NOW() ORDER BY fecha_inicio ASC LIMIT 1');
    return result[0];
};

export default {
    create,
    getAll,
    update,
    getNext
};
