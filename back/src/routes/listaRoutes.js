import express from 'express';
import listaController from '../controllers/listaController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/usuario/:id_usuario', listaController.getUsuarioListas);
router.get('/publicas', listaController.getPublicListas);
router.get('/friends/all', listaController.getFriendsListas);
router.get('/:id', listaController.getListaById);
router.post('/', listaController.createLista);
router.post('/:id/imagen', upload.single('imagenLista'), listaController.uploadListaImage);
router.put('/:id', listaController.updateLista);
router.delete('/:id', listaController.deleteLista);
router.post('/:id_lista/like', listaController.toggleLikeLista);

export default router;
