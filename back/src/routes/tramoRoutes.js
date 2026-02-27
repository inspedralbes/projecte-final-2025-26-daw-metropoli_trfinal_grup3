import express from 'express';
import tramoController from '../controllers/tramoController.js';

const router = express.Router();

router.post('/', tramoController.createTramo);
router.post('/bulk', tramoController.createTramosBulk);
router.post('/path', tramoController.createPath);
router.get('/', tramoController.getTramos);
router.get('/node/:nodeId', tramoController.getTramosByNode);
router.delete('/:id', tramoController.deleteTramo);

export default router;
