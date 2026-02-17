import 'dotenv/config'; // Cargar variables de entorno
import express from 'express';
import cors from 'cors';
import routes from './src/routes/index.js';

const app = express();
const port = 3000;

app.use(cors()); // Habilitar CORS para peticiones del frontend
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('MetroPoli Backend API is running');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
