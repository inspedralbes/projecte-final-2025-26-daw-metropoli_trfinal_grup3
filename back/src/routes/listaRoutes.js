import express from 'express';
import listaController from '../controllers/listaController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', listaController.getPublicListas);
router.get('/:id', listaController.getListaById);
router.get('/usuario/:id_usuario', listaController.getUsuarioListas);
router.post('/', listaController.createLista);
router.post('/:id/imagen', upload.single('imagenLista'), listaController.uploadListaImage);
router.put('/:id', listaController.updateLista);
router.delete('/:id', listaController.deleteLista);

export default router;
