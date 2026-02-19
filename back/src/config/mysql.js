import mysql from 'mysql2/promise';

// Configuración del pool de conexiones
// Usamos un 'pool' para reusar conexiones y no abrir una nueva en cada petición
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db',        // Nombre del servicio en Docker o IP
    user: process.env.DB_USER || 'root',      // Usuario de la BD
    password: process.env.DB_PASSWORD || 'password', // Contraseña
    database: process.env.DB_NAME || 'metropoli',    // Nombre de la BD
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificar conexión al iniciar
// Esto nos ayuda a saber rápidamente si la BD está lista o hay un error
// Función para verificar conexión con reintentos
const checkConnection = async (retries = 5, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const connection = await pool.getConnection();
            console.log('✅ Conectado exitosamente a MySQL');
            connection.release();
            return;
        } catch (error) {
            console.error(`❌ Error al conectar a MySQL (Intento ${i + 1}/${retries}):`, error.message);
            if (i < retries - 1) {
                console.log(`⏳ Reintentando en ${delay / 1000} segundos...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('❌ No se pudo conectar a la base de datos después de múltiples intentos.');
            }
        }
    }
};

checkConnection();

// Función helper para ejecutar consultas de forma sencilla
// Recibe el SQL y los parámetros (opcional)
export const query = async (sql, params) => {
    // pool.query devuelve un array [filas, campos], aquí retornamos tal cual
    return await pool.query(sql, params);
};

// Exportamos el pool completo por si se necesita para transacciones
export default pool;
