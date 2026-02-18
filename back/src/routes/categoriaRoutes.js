import express from 'express';
import categoriaController from '../controllers/categoriaController.js';

const router = express.Router();

router.post('/', categoriaController.createCategoria);
router.get('/', categoriaController.getCategorias);

export default router;
