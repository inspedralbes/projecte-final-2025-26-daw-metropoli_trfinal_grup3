import loginService from '../services/loginService.js';
import googleAuthService from '../services/googleAuthService.js';
import captchaService from '../services/captchaService.js';

// ── POST /api/auth/register ───────────────────────────────────────────────────
const register = async (req, res) => {
    try {
        const { nombre, email, password, rol, captchaToken } = req.body;

        if (!nombre || !email || !password || !captchaToken) {
            return res.status(400).json({
                success:    false,
                message:    'Todos los campos y el CAPTCHA son obligatorios',
                error_code: 'MISSING_FIELDS',
            });
        }

        // Verify CAPTCHA
        const isCaptchaValid = await captchaService.verifyCaptcha(captchaToken);
        if (!isCaptchaValid) {
            return res.status(400).json({
                success:    false,
                message:    'Verificación de CAPTCHA fallida',
                error_code: 'INVALID_CAPTCHA',
            });
        }

        const nuevoUsuario = await loginService.register({ nombre, email, password, rol });

        return res.status(201).json({
            success: true,
            message: 'Usuario registrado. Revisa tu correo para verificar tu cuenta.',
            data:    nuevoUsuario,
        });
    } catch (error) {
        if (error.code === 'EMAIL_EXISTS') {
            return res.status(409).json({
                success:    false,
                message:    error.message,
                error_code: error.code,
            });
        }
        return res.status(500).json({
            success:    false,
            message:    error.message,
            error_code: 'ERROR_INTERNO',
        });
    }
};

// ── POST /api/auth/login ──────────────────────────────────────────────────────
const login = async (req, res) => {
    try {
        const { email, password, captchaToken } = req.body;

        if (!email || !password || !captchaToken) {
            return res.status(400).json({
                success:    false,
                message:    'Email, password y CAPTCHA son obligatorios',
                error_code: 'MISSING_FIELDS',
            });
        }

        // Verify CAPTCHA
        const isCaptchaValid = await captchaService.verifyCaptcha(captchaToken);
        if (!isCaptchaValid) {
            return res.status(400).json({
                success:    false,
                message:    'Verificación de CAPTCHA fallida',
                error_code: 'INVALID_CAPTCHA',
            });
        }

        const result = await loginService.login({ email, password });

        return res.status(200).json({
            success: true,
            message: 'Login exitoso',
            data:    result,   // { token, usuario }
        });
    } catch (error) {
        if (error.code === 'INVALID_CREDENTIALS') {
            return res.status(401).json({
                success:    false,
                message:    error.message,
                error_code: error.code,
            });
        }
        if (error.code === 'EMAIL_NOT_VERIFIED') {
            return res.status(403).json({
                success:    false,
                message:    error.message,
                error_code: error.code,
            });
        }
        return res.status(500).json({
            success:    false,
            message:    error.message,
            error_code: 'ERROR_INTERNO',
        });
    }
};

// ── POST /api/auth/google ──────────────────────────────────────────────────
const googleLogin = async (req, res) => {
    try {
        const { google_access_token } = req.body;

        if (!google_access_token) {
            return res.status(400).json({
                success:    false,
                message:    'google_access_token es obligatorio',
                error_code: 'MISSING_FIELDS',
            });
        }

        // 1. Verify token with Google
        const googleUser = await googleAuthService.verifyGoogleToken(google_access_token);

        // 2. Check if user exists or create them
        const { password, is_login } = req.body;
        const result = await loginService.googleLogin({ ...googleUser, password, is_login });

        return res.status(200).json({
            success: true,
            message: 'Login con Google exitoso',
            data:    result, // { token, usuario }
        });
    } catch (error) {
        console.error('Google login error:', error);
        
        if (error.code === 'USER_NOT_FOUND') {
            return res.status(404).json({
                success:    false,
                message:    error.message,
                error_code: error.code,
            });
        }
        
        return res.status(401).json({
            success:    false,
            message:    error.message || 'Error en la autenticación con Google',
            error_code: 'GOOGLE_AUTH_ERROR',
        });
    }
};

export default { register, login, googleLogin };
