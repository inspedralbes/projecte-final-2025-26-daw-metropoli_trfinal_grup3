import 'dotenv/config';
import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// --- MySQL Config ---
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'metropoli',
});

// --- MongoDB Config ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/metropoli';

const PublicacionSchema = new mongoose.Schema({}, { strict: false, collection: 'publicaciones' });
const Publicacion = mongoose.model('Publicacion', PublicacionSchema);

const MensajeSchema = new mongoose.Schema({}, { strict: false, collection: 'mensajes' });
const Mensaje = mongoose.model('Mensaje', MensajeSchema);

const names = ["Àlex", "Marc", "Jordi", "Pau", "Laia", "Marta", "Anna", "Carla", "Joan", "Oriol", "Sònia", "Xavi", "Elena", "Ramon", "Núria"];
const lastNames = ["García", "Rodríguez", "Martínez", "López", "Vila", "Serra", "Soler", "Puig", "Font", "Roca"];
const bios = [
    "Apassionat de la tecnologia i la ciutat.",
    "Explorant cada racó de la metròpoli.",
    "Sóc nou per aquí, a veure què tal!",
    "M'encanta el circuit i la velocitat.",
    "Foodie i amant dels POIs històrics.",
    "Dissenyador gràfic buscant inspiració.",
    "Sempre en moviment.",
];
const postTexts = [
    "Acabo de descobrir un lloc increïble al costat del circuit!",
    "Algú sap si hi ha esdeveniments avui?",
    "M'encanta com està quedant la comunitat.",
    "La millor hamburguesa de la zona és a prop de la grada 5.",
    "Bon dia a tothom! Quins plans teniu?",
    "He vist una incidència prop de l'entrada principal, compte!",
    "Increïble la posta de sol des de la torre de control.",
    "Recomano molt visitar el POI del museu.",
    "Algú per fer una ruta demà al matí?",
    "Aquest projecte és espectacular!",
];

async function seed() {
    try {
        console.log("🚀 Iniciant seeding de dades...");

        // 1. Connect MongoDB
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connectat");

        // 2. Crear Usuarios en MySQL
        console.log("👤 Creant usuaris en MySQL...");
        const users = [];
        const hashedPassword = await bcrypt.hash('123456', 10);

        for (let i = 0; i < 15; i++) {
            const nombre = names[i % names.length] + " " + lastNames[Math.floor(Math.random() * lastNames.length)];
            const email = `user${i}@metropoli.cat`;
            const bio = bios[Math.floor(Math.random() * bios.length)];
            
            try {
                const [res] = await pool.query(
                    'INSERT INTO usuario (nombre, email, password_hash, rol, bio) VALUES (?, ?, ?, ?, ?)',
                    [nombre, email, hashedPassword, 'user', bio]
                );
                users.push({ id_usuario: res.insertId, nombre, bio });
            } catch (err) {
                const [rows] = await pool.query('SELECT id_usuario, nombre FROM usuario WHERE email = ?', [email]);
                if (rows[0]) users.push(rows[0]);
            }
        }
        console.log(`✅ ${users.length} usuaris llistos`);

        // 3. Crear Amistades (MySQL)
        console.log("🤝 Creant amistats...");
        for (let i = 0; i < users.length; i++) {
            const u1 = users[i];
            const friendsCount = Math.floor(Math.random() * 4) + 2; // Cada uno tiene 2-5 amigos
            for (let j = 0; j < friendsCount; j++) {
                const u2 = users[Math.floor(Math.random() * users.length)];
                if (u1.id_usuario === u2.id_usuario) continue;
                
                try {
                    await pool.query(
                        'INSERT IGNORE INTO amigo (id_usuario, id_amigo) VALUES (?, ?)',
                        [u1.id_usuario, u2.id_usuario]
                    );
                    await pool.query(
                        'INSERT IGNORE INTO amigo (id_usuario, id_amigo) VALUES (?, ?)',
                        [u2.id_usuario, u1.id_usuario]
                    );
                } catch (err) { /* ignore duplicate */ }
            }
        }
        console.log("✅ Amistats creades");

        // 4. Crear Publicaciones en MongoDB
        console.log("📝 Creant publicacions en MongoDB...");
        const pubs = [];
        for (let i = 0; i < 40; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const texto = postTexts[Math.floor(Math.random() * postTexts.length)];
            const tipo = ["popular", "fanzone", "oficial"][Math.floor(Math.random() * 3)];
            
            const pub = new Publicacion({
                id_usuario: user.id_usuario,
                nombre_usuario: user.nombre,
                foto_perfil: null,
                texto: texto,
                tipo_publicacion: tipo,
                likes: Math.floor(Math.random() * 50),
                likes_usuarios: [],
                comentarios: [],
                createdAt: new Date(Date.now() - Math.random() * 1000000000)
            });

            const numComs = Math.floor(Math.random() * 5);
            for(let j=0; j<numComs; j++) {
                const comUser = users[Math.floor(Math.random() * users.length)];
                pub.comentarios.push({
                    _id: new mongoose.Types.ObjectId(),
                    id_usuario: comUser.id_usuario,
                    nombre_usuario: comUser.nombre,
                    texto: "Estic d'acord!",
                    createdAt: new Date()
                });
            }
            pubs.push(pub);
        }
        await Publicacion.insertMany(pubs);
        console.log(`✅ 40 publicacions creades`);

        // 5. Crear Mensajes en MongoDB (Chats)
        console.log("💬 Creant missatges de xat...");
        const msgs = [];
        for (let i = 0; i < 100; i++) {
            const u1 = users[Math.floor(Math.random() * users.length)];
            const u2 = users[Math.floor(Math.random() * users.length)];
            if (u1.id_usuario === u2.id_usuario) continue;

            const room = ["chat", [u1.id_usuario, u2.id_usuario].sort((a,b)=>a-b).join("_")].join("_");
            
            msgs.push({
                room,
                senderId: u1.id_usuario,
                senderName: u1.nombre,
                receiverId: u2.id_usuario,
                text: "Ei! Com va tot?",
                createdAt: new Date(Date.now() - Math.random() * 500000000)
            });
        }
        await Mensaje.insertMany(msgs);
        console.log(`✅ 100 missatges generats`);

        console.log("\n✨ Base de dades poblada amb èxit!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Error en el seeding:", err);
        process.exit(1);
    }
}

seed();
