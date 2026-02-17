const express = require('express');
const router = express.Router();

const usuarioRoutes = require('./usuarioRoutes');
const categoriaRoutes = require('./categoriaRoutes');
const eventoRoutes = require('./eventoRoutes');
const nodoRoutes = require('./nodoRoutes');
const tramoRoutes = require('./tramoRoutes');
const poiRoutes = require('./poiRoutes');
const horarioRoutes = require('./horarioRoutes');
const multimediaRoutes = require('./multimediaRoutes');
const ubicacionRoutes = require('./ubicacionRoutes');
const incidenciaRoutes = require('./incidenciaRoutes');
const traduccionRoutes = require('./traduccionRoutes');

router.use('/usuarios', usuarioRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/eventos', eventoRoutes);
router.use('/nodos', nodoRoutes);
router.use('/tramos', tramoRoutes);
router.use('/pois', poiRoutes);
router.use('/horarios', horarioRoutes);
router.use('/multimedia', multimediaRoutes);
router.use('/ubicaciones', ubicacionRoutes);
router.use('/incidencias', incidenciaRoutes);
router.use('/traducciones', traduccionRoutes);

module.exports = router;
