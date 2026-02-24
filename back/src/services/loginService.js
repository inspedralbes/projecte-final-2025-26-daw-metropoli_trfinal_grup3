import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import usuarioModel from '../models/usuarioModel.js';
import { sendVerificationEmail } from './emailService.js';

const JWT_SECRET    = process.env.JWT_SECRET    || 'metropoli_secret_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
const SALT_ROUNDS   = 12;

// ── Register ──────────────────────────────────────────────────────────────────
const register = async ({ nombre, email, password, rol = 'visitante' }) => {
    // 1. Check for duplicate email
    const existing = await usuarioModel.findByEmail(email);
    if (existing) {
        const err = new Error('El email ya está registrado');
        err.code  = 'EMAIL_EXISTS';
        throw err;
    }

    // 2. Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // 3. Generate verification token (random UUID)
    const token_verificacion = crypto.randomUUID();

    // 4. Persist user
    const nuevoUsuario = await usuarioModel.create({
        nombre,
        email,
        password: password_hash,
        rol,
        token_verificacion,
    });

    // 5. Send verification email (fire-and-forget — don't block registration)
    sendVerificationEmail(email, token_verificacion).catch((err) =>
        console.error('❌ Error enviando email de verificación:', err.message)
    );

    // 6. Return safe user object (no hash, no token)
    const { password: _pw, password_hash: _ph, token_verificacion: _tk, ...safeUser } = nuevoUsuario;
    return safeUser;
};

// ── Login ─────────────────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
    // 1. Find user
    const usuario = await usuarioModel.findByEmail(email);
    if (!usuario) {
        const err = new Error('Credenciales incorrectas');
        err.code  = 'INVALID_CREDENTIALS';
        throw err;
    }

    // 2. Block unverified accounts
    if (!usuario.email_verificado) {
        const err = new Error('Debes verificar tu correo antes de iniciar sesión');
        err.code  = 'EMAIL_NOT_VERIFIED';
        throw err;
    }

    // 3. Verify password
    const passwordMatch = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordMatch) {
        const err = new Error('Credenciales incorrectas');
        err.code  = 'INVALID_CREDENTIALS';
        throw err;
    }

    // 4. Sign JWT
    const payload = {
        id_usuario: usuario.id_usuario,
        email:      usuario.email,
        rol:        usuario.rol,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // 5. Return token + safe user data
    return {
        token,
        usuario: {
            id_usuario:     usuario.id_usuario,
            nombre:         usuario.nombre,
            email:          usuario.email,
            rol:            usuario.rol,
            fecha_registro: usuario.fecha_registro,
        },
    };
};

export default { register, login };
