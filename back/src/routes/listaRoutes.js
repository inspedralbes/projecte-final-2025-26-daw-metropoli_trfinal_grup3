import express from 'express';
import listaController from '../controllers/listaController.js';

const router = express.Router();

router.get('/', listaController.getPublicListas);
router.get('/:id', listaController.getListaById);
router.get('/usuario/:id_usuario', listaController.getUsuarioListas);
router.post('/', listaController.createLista);
router.delete('/:id', listaController.deleteLista);

export default router;
