import express from 'express';
import comunidadController from '../controllers/comunidadController.js';

const router = express.Router();

router.post('/', comunidadController.createPublicacion);
router.get('/', comunidadController.getPublicaciones);

export default router;
