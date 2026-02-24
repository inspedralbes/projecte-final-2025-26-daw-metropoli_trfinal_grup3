import express from 'express';
import { generateQrCode } from '../controllers/qrController.js';

const router = express.Router();

// Route to get a QR code for a specific Navigation Node
router.get('/:id_nodo', generateQrCode);

export default router;
