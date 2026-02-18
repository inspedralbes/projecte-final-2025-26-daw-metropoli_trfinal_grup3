import express from 'express';
import poiController from '../controllers/poiController.js';

const router = express.Router();

router.post('/', poiController.createPoiSimple);
router.post('/completo', poiController.createPoiCompleto);
router.get('/', poiController.getPois);

export default router;
