import { query } from '../config/mysql.js';

/** Seguir a un usuario */
const follow = async (idSeguidor, idSeguido) => {
    await query(
        'INSERT IGNORE INTO seguidores (id_seguidor, id_seguido) VALUES (?, ?)',
        [idSeguidor, idSeguido]
    );
};

/** Dejar de seguir a un usuario */
const unfollow = async (idSeguidor, idSeguido) => {
    await query(
        'DELETE FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?',
        [idSeguidor, idSeguido]
    );
};

/** Obtener seguidores de un usuario (quien le sigue) */
const getFollowers = async (idSeguido) => {
    const [rows] = await query(
        `SELECT u.id_usuario, u.nombre, u.foto_perfil, u.bio
         FROM seguidores s
         JOIN usuario u ON s.id_seguidor = u.id_usuario
         WHERE s.id_seguido = ?
         ORDER BY s.fecha_seguimiento DESC`,
        [idSeguido]
    );
    return rows;
};

/** Obtener a quién sigue un usuario */
const getFollowing = async (idSeguidor) => {
    const [rows] = await query(
        `SELECT u.id_usuario, u.nombre, u.foto_perfil, u.bio
         FROM seguidores s
         JOIN usuario u ON s.id_seguido = u.id_usuario
         WHERE s.id_seguidor = ?
         ORDER BY s.fecha_seguimiento DESC`,
        [idSeguidor]
    );
    return rows;
};

/** Comprobar si un usuario sigue a otro */
const isFollowing = async (idSeguidor, idSeguido) => {
    const [rows] = await query(
        'SELECT 1 FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?',
        [idSeguidor, idSeguido]
    );
    return rows.length > 0;
};

/** Contar seguidores y seguidos de un usuario */
const getCounts = async (idUsuario) => {
    const [[{ followers }]] = await query(
        'SELECT COUNT(*) as followers FROM seguidores WHERE id_seguido = ?',
        [idUsuario]
    );
    const [[{ following }]] = await query(
        'SELECT COUNT(*) as following FROM seguidores WHERE id_seguidor = ?',
        [idUsuario]
    );
    return { followers, following };
};

export default { follow, unfollow, getFollowers, getFollowing, isFollowing, getCounts };
