import express from 'express';
import amigoController from '../controllers/amigoController.js';

const router = express.Router();

router.get('/:userId', amigoController.getAmigos);
router.post('/', amigoController.addAmigo);
router.delete('/:userId/:friendId', amigoController.removeAmigo);

export default router;
