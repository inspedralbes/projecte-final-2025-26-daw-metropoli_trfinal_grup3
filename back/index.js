import 'dotenv/config'; // Cargar variables de entorno
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './src/routes/index.js';
import weatherRoutes from './src/routes/weatherRoutes.js';
import qrRoutes from './src/routes/qrRoutes.js'; // IMPORT NEW ROUTE
import './src/services/weatherService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
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

app.use('/api/weather', weatherRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
