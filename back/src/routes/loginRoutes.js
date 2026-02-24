import express from 'express';
import loginController from '../controllers/loginController.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', loginController.register);

// POST /api/auth/login
router.post('/login', loginController.login);

export default router;
