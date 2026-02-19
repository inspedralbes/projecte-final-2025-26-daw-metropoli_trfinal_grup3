import express from 'express';
import usuarioRoutes from './usuarioRoutes.js';
import categoriaRoutes from './categoriaRoutes.js';
import eventoRoutes from './eventoRoutes.js';
import nodoRoutes from './nodoRoutes.js';
import tramoRoutes from './tramoRoutes.js';
import poiRoutes from './poiRoutes.js';
import horarioRoutes from './horarioRoutes.js';
import multimediaRoutes from './multimediaRoutes.js';
import incidenciaRoutes from './incidenciaRoutes.js';
import traduccionRoutes from './traduccionRoutes.js';
import calculoRutaRoutes from './calculoRutaRoutes.js';
import weatherRoutes from './weatherRoutes.js';

const router = express.Router();

router.use('/usuarios', usuarioRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/eventos', eventoRoutes);
router.use('/nodos', nodoRoutes);
router.use('/tramos', tramoRoutes);
router.use('/pois', poiRoutes);
router.use('/horarios', horarioRoutes);
router.use('/multimedia', multimediaRoutes);
router.use('/incidencias', incidenciaRoutes);
router.use('/traducciones', traduccionRoutes);
router.use('/rutas', calculoRutaRoutes);
router.use('/tiempo', weatherRoutes);

export default router;
