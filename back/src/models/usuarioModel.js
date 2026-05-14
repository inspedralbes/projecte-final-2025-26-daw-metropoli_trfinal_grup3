import { query } from '../config/mysql.js';

const create = async (usuario) => {
    const { nombre, email, password, rol, token_verificacion } = usuario;
    const [result] = await query(
        'INSERT INTO usuario (nombre, email, password_hash, rol, token_verificacion, email_verificado) VALUES (?, ?, ?, ?, ?, FALSE)',
        [nombre, email, password, rol, token_verificacion]
    );
    return { id_usuario: result.insertId, ...usuario };
};

const findByEmail = async (email) => {
    const [rows] = await query('SELECT * FROM usuario WHERE email = ?', [email]);
    return rows[0];
};

const findByToken = async (token) => {
    const [rows] = await query('SELECT * FROM usuario WHERE token_verificacion = ?', [token]);
    return rows[0];
};

const verifyEmail = async (id_usuario) => {
    await query(
        'UPDATE usuario SET email_verificado = TRUE, token_verificacion = NULL WHERE id_usuario = ?',
        [id_usuario]
    );
};

const getAll = async () => {
    const [rows] = await query('SELECT id_usuario, nombre, email, rol, fecha_registro FROM usuario');
    return rows;
};

const getById = async (id) => {
    const [rows] = await query('SELECT * FROM usuario WHERE id_usuario = ?', [id]);
    return rows[0];
};

const updatePerfil = async (id, nombre, bio, fotoPerfil) => {
    await query(
        'UPDATE usuario SET nombre = ?, bio = ?, foto_perfil = ? WHERE id_usuario = ?',
        [nombre, bio, fotoPerfil, id]
    );
};

const searchByName = async (name) => {
    const [rows] = await query(
        'SELECT id_usuario, nombre, foto_perfil, bio FROM usuario WHERE nombre LIKE ? LIMIT 10',
        [`%${name}%`]
    );
    return rows;
};

const getStats = async (id_usuario) => {
    const [discoveredRows] = await query(
        'SELECT COUNT(DISTINCT id_referencia) as total FROM usuario_actividad WHERE id_usuario = ? AND tipo = "poi_visitado"',
        [id_usuario]
    );

    const [routesRows] = await query(
        'SELECT COUNT(*) as total FROM usuario_actividad WHERE id_usuario = ? AND tipo = "ruta_completada"',
        [id_usuario]
    );

    const [kmRows] = await query(
        'SELECT IFNULL(SUM(valor), 0) as total FROM usuario_actividad WHERE id_usuario = ? AND tipo = "ruta_completada"',
        [id_usuario]
    );

    const [weeklyRows] = await query(
        `SELECT 
            CASE DAYOFWEEK(fecha) 
                WHEN 2 THEN 'dl.' WHEN 3 THEN 'dt.' WHEN 4 THEN 'dc.' 
                WHEN 5 THEN 'dj.' WHEN 6 THEN 'dv.' WHEN 7 THEN 'ds.' WHEN 1 THEN 'dg.' 
            END as day,
            IFNULL(SUM(valor), 0) as value
         FROM usuario_actividad 
         WHERE id_usuario = ? 
           AND tipo = "ruta_completada"
           AND fecha >= DATE_SUB(NOW(), INTERVAL 7 DAY)
         GROUP BY day
         ORDER BY FIELD(day, 'dl.', 'dt.', 'dc.', 'dj.', 'dv.', 'ds.', 'dg.')`,
        [id_usuario]
    );

    // Mapear a un array de 7 días con 0 si no hay actividad
    const daysOrder = ['dl.', 'dt.', 'dc.', 'dj.', 'dv.', 'ds.', 'dg.'];
    const activityMap = Object.fromEntries(weeklyRows.map(r => [r.day, r.value]));
    
    const fullWeeklyActivity = daysOrder.map(day => ({
        day,
        value: Math.round(activityMap[day] || 0)
    }));

    return {
        discovered: discoveredRows[0].total,
        completedRoutes: routesRows[0].total,
        kmWalked: Math.round(kmRows[0].total),
        weeklyActivity: fullWeeklyActivity
    };
};

const logActividad = async (actividad) => {
    const { id_usuario, tipo, valor, id_referencia } = actividad;
    const [result] = await query(
        'INSERT INTO usuario_actividad (id_usuario, tipo, valor, id_referencia) VALUES (?, ?, ?, ?)',
        [id_usuario, tipo, valor, id_referencia]
    );
    return result.insertId;
};

export default {
    create,
    findByEmail,
    findByToken,
    verifyEmail,
    getAll,
    getById,
    updatePerfil,
    searchByName,
    getStats,
    logActividad
};
