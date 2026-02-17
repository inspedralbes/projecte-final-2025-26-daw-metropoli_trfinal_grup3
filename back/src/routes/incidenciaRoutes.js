import express from 'express';
import incidenciaController from '../controllers/incidenciaController.js';

const router = express.Router();

router.post('/', incidenciaController.createIncidencia);
router.get('/', incidenciaController.getIncidencias);

export default router;
