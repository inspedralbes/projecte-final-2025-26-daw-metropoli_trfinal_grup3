import express from 'express';
import usuarioController from '../controllers/usuarioController.js';
import upload from '../middleware/uploadMiddleware.js';
import { existsSync, mkdirSync } from 'fs';

// Nos aseguramos de que la carpeta para fotos de usuario exista antes de iniciar
if (!existsSync('public/images/usuarios')) {
    mkdirSync('public/images/usuarios', { recursive: true });
}

const router = express.Router();

router.post('/', usuarioController.createUsuario);
router.get('/', usuarioController.getUsuarios);
router.get('/:id', usuarioController.getUsuarioById);
router.put('/:id/perfil', upload.single('fotoPerfil'), usuarioController.editarPerfil);

export default router;
