const express = require('express');
const app = express();
const port = 3000;
const routes = require('./src/routes');

app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('MetroPoli Backend API is running');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
