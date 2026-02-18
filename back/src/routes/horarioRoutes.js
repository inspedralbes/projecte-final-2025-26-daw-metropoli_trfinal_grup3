import express from 'express';
import horarioController from '../controllers/horarioController.js';

const router = express.Router();

router.post('/', horarioController.createHorario);
router.get('/:id_poi', horarioController.getHorariosByPoi);

export default router;
