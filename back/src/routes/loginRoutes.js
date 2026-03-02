import express from 'express';
import loginController from '../controllers/loginController.js';
import verifyController from '../controllers/verifyController.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', loginController.register);

// POST /api/auth/login
router.post('/login', loginController.login);

// POST /api/auth/google
router.post('/google', loginController.googleLogin);

// GET /api/auth/verify-email?token=...
router.get('/verify-email', verifyController.verify);

export default router;
