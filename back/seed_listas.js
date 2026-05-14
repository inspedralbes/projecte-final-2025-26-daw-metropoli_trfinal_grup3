import 'dotenv/config';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    port: 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'metropoli',
});

const lists = [
    {
        id_usuario: 4,
        nombre: 'Ruta Gastronómica',
        descripcion: 'Los mejores lugares para comer en la ciudad.',
        visibilidad: 'public',
        imagen_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
        pois: [2, 9]
    },
    {
        id_usuario: 4,
        nombre: 'Cultura y Museos',
        descripcion: 'Visita los puntos culturales más importantes.',
        visibilidad: 'public',
        imagen_url: 'https://images.unsplash.com/photo-1518998053502-517e209eeec2?w=800&q=80',
        pois: [1, 7, 8]
    },
    {
        id_usuario: 5,
        nombre: 'Paseo por el Parque',
        descripcion: 'Una ruta tranquila por las zonas verdes.',
        visibilidad: 'public',
        imagen_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
        pois: [3, 10]
    },
    {
        id_usuario: 6,
        nombre: 'Transporte y Centro',
        descripcion: 'Ruta rápida por el centro usando el metro.',
        visibilidad: 'public',
        imagen_url: 'https://images.unsplash.com/photo-1542344807-157f76301e8a?w=800&q=80',
        pois: [4, 5]
    }
];

async function seed() {
    try {
        console.log("🚀 Iniciando seeding de listas...");

        for (const listData of lists) {
            const { id_usuario, nombre, descripcion, visibilidad, imagen_url, pois } = listData;
            
            const [res] = await pool.query(
                'INSERT INTO listas (id_usuario, nombre, descripcion, visibilidad, imagen_url) VALUES (?, ?, ?, ?, ?)',
                [id_usuario, nombre, descripcion, visibilidad, imagen_url]
            );
            const id_lista = res.insertId;
            console.log(`✅ Creada lista: ${nombre} (ID: ${id_lista})`);

            for (let i = 0; i < pois.length; i++) {
                await pool.query(
                    'INSERT INTO lista_pois (id_lista, id_poi, orden) VALUES (?, ?, ?)',
                    [id_lista, pois[i], i + 1]
                );
            }
            console.log(`   📍 Añadidos ${pois.length} POIs`);
        }

        console.log("\n✨ Seeding de listas completado!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Error en el seeding:", err);
        process.exit(1);
    }
}

seed();
