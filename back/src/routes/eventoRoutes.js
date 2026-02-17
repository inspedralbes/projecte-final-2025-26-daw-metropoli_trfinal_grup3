import express from 'express';
import eventoController from '../controllers/eventoController.js';

const router = express.Router();

router.post('/', eventoController.createEvento);
router.get('/', eventoController.getEventos);

export default router;
