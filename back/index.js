import 'dotenv/config'; // Cargar variables de entorno
import express from 'express';
import cors from 'cors';
import { createServer } from 'http'; // Necesario para envolver el servidor de Express en uno HTTP normal
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './src/routes/index.js';
import qrRoutes from './src/routes/qrRoutes.js'; // IMPORT NEW ROUTE
import './src/services/weatherService.js';
import { initSocket } from './src/config/socket.js'; // Nuestra antena de radio nueva

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Envuelve la aplicación normal (Express) en un servidor web real, para que pueda emitir cosas además de sólo responder
const servidorHTTP = createServer(app);

// Encendemos la antena y le damos control sobre nuestro servidorHTTP
initSocket(servidorHTTP);
const port = 3000;

app.use(cors()); // Habilitar CORS para peticiones del frontend
app.use(express.json());

// Servir la carpeta 'public' para acceder a los QR generados
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api', routes);
app.use('/api/qr', qrRoutes); // CONFIGURE NEW ROUTE PREFIX

app.get('/', (req, res) => {
  res.send('MetroPoli Backend API is running');
});

// En vez de que `app` encienda, usamos `servidorHTTP` (la versión que tiene la antena pegada)
servidorHTTP.listen(port, () => {
  console.log(`🌍 Server listening on port ${port} (Con WebSockets Activados)`);
});
