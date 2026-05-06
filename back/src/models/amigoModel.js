import { query } from '../config/mysql.js';

// Crear la tabla si no existe al cargar el modelo
const init = async () => {
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS amigos (
                id_usuario INTEGER NOT NULL,
                id_amigo INTEGER NOT NULL,
                fecha_amistad DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id_usuario, id_amigo),
                FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
                FOREIGN KEY (id_amigo) REFERENCES usuario(id_usuario)
            )
        `);
    } catch (err) {
        console.error('Error initializing amigos table:', err.message);
    }
};
init();


const getFriendsByUserId = async (userId) => {
    // Obtenemos los datos de los usuarios amigos uniendo con la tabla usuario
    const [rows] = await query(
        `SELECT u.id_usuario, u.nombre, u.foto_perfil, u.bio, u.rol 
         FROM amigos a
         JOIN usuario u ON a.id_amigo = u.id_usuario
         WHERE a.id_usuario = ?`,
        [userId]
    );
    return rows;
};

const addFriend = async (userId, friendId) => {
    // Usamos INSERT IGNORE o manejamos el error de duplicados para no romper el flujo
    await query(
        'INSERT IGNORE INTO amigos (id_usuario, id_amigo) VALUES (?, ?)',
        [userId, friendId]
    );
    // Normalmente la amistad es bidireccional en redes sociales simples, 
    // pero si es tipo 'seguidor', solo se inserta una fila.
    // Para wemap, la haremos bidireccional automática:
    await query(
        'INSERT IGNORE INTO amigos (id_usuario, id_amigo) VALUES (?, ?)',
        [friendId, userId]
    );
};

const deleteFriend = async (userId, friendId) => {
    await query(
        'DELETE FROM amigos WHERE (id_usuario = ? AND id_amigo = ?) OR (id_usuario = ? AND id_amigo = ?)',
        [userId, friendId, friendId, userId]
    );
};

const areFriends = async (userId, friendId) => {
    const [rows] = await query(
        'SELECT 1 FROM amigos WHERE id_usuario = ? AND id_amigo = ?',
        [userId, friendId]
    );
    return rows.length > 0;
};

export default {
    getFriendsByUserId,
    addFriend,
    deleteFriend,
    areFriends
};
