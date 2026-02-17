import express from 'express';
import traduccionController from '../controllers/traduccionController.js';

const router = express.Router();

router.post('/', traduccionController.createTraduccion);
router.get('/', traduccionController.getTraducciones);

export default router;
