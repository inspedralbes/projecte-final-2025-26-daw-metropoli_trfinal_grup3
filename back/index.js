const express = require('express');
const app = express();
const port = 3000;
const routes = require('./src/routes');

app.use(express.json());

app.use('/api', routes);

const cors = require('cors');
const weatherRoutes = require('./src/routes/weatherRoutes');

// Iniciar el servicio de actualización del tiempo en segundo plano
require('./src/services/weatherService');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('MetroPoli Backend API is running');
});

app.use('/api/weather', weatherRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
