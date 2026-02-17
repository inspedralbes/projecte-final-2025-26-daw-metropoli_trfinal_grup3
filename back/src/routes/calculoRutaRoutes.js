import express from 'express';
import calculoRutaController from '../controllers/calculoRutaController.js';

const router = express.Router();

router.get('/calcular', calculoRutaController.calcularRuta);

export default router;
