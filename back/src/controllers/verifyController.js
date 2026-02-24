import usuarioModel from '../models/usuarioModel.js';

// ── GET /api/auth/verify-email?token=... ──────────────────────────────────────
const verify = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                success:    false,
                message:    'Token de verificación requerido',
                error_code: 'MISSING_TOKEN',
            });
        }

        const usuario = await usuarioModel.findByToken(token);
        if (!usuario) {
            return res.status(400).json({
                success:    false,
                message:    'Token inválido o ya utilizado',
                error_code: 'INVALID_TOKEN',
            });
        }

        await usuarioModel.verifyEmail(usuario.id_usuario);

        return res.status(200).json({
            success: true,
            message: 'Email verificado correctamente. Ya puedes iniciar sesión.',
        });
    } catch (error) {
        return res.status(500).json({
            success:    false,
            message:    error.message,
            error_code: 'ERROR_INTERNO',
        });
    }
};

export default { verify };
