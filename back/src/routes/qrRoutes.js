import express from 'express';
import { generateQrCode, getQrCodes, getQrBySlug, generateQrWithNearestPois } from '../controllers/qrController.js';

const router = express.Router();

// GET /api/qrs — lista todos los QRs registrados
router.get('/', getQrCodes);

// GET /api/qrs/:id_nodo — genera solo el QR (solo si id es numérico)
router.get('/:id_nodo(\\d+)', generateQrCode);

// POST /api/qrs/generar/:id_nodo?zona=... — genera el QR + calcula los 3 POIs más cercanos
router.post('/generar/:id_nodo(\\d+)', generateQrWithNearestPois);

// GET /api/qrs/slug/:slug — lectura O(1) desde la caché global
router.get('/slug/:slug', getQrBySlug);

export default router;

