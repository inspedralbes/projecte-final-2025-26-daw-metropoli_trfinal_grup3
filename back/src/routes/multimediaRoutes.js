import express from 'express';
import multimediaController from '../controllers/multimediaController.js';

const router = express.Router();

router.post('/', multimediaController.createMultimedia);
router.get('/:id_poi', multimediaController.getMultimediaByPoi);

export default router;
