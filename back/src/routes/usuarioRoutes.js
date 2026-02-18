import express from 'express';
import usuarioController from '../controllers/usuarioController.js';

const router = express.Router();

router.post('/', usuarioController.createUsuario);
router.get('/', usuarioController.getUsuarios);

export default router;
