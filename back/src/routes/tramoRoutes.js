import express from 'express';
import tramoController from '../controllers/tramoController.js';

const router = express.Router();

router.post('/', tramoController.createTramo);
router.get('/', tramoController.getTramos);

export default router;
