import express from 'express';
import nodoController from '../controllers/nodoController.js';

const router = express.Router();

router.post('/', nodoController.createNodo);
router.get('/', nodoController.getNodos);
router.get('/poi', nodoController.getPoiNodes);
router.get('/:id', nodoController.getNodoById);

export default router;
