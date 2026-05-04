import express from 'express';
import listaController from '../controllers/listaController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/usuario/:id_usuario', listaController.getUsuarioListas);
router.get('/publicas', listaController.getPublicListas);
router.post('/', listaController.createLista);
router.get('/:id', listaController.getListaById);
router.put('/:id', listaController.updateLista);
router.delete('/:id', listaController.deleteLista);
router.post('/:id/imagen', upload.single('imagenLista'), listaController.uploadListaImage);

export default router;
