import express from 'express';
import adminController from '../controllers/adminController.js';

const router = express.Router();

router.post('/recalcular', adminController.recalculateCache);

export default router;
