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

    // 3. Generate 6-digit verification code
    const token_verificacion = Math.floor(100000 + Math.random() * 900000).toString();

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

// ── Google Login ──────────────────────────────────────────────────────────────
const googleLogin = async ({ email, nombre, password = null }) => {
    // 1. Find user by email
    let usuario = await usuarioModel.findByEmail(email);

    if (!usuario) {
        // 2. If user doesn't exist and no password provided, ask for it
        if (!password) {
            return { needs_password: true, email, nombre };
        }

        // 3. Create user with provided password (Google users are auto-verified)
        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
        usuario = await usuarioModel.create({
            nombre,
            email,
            password:           password_hash,
            rol:                'visitante',
            token_verificacion: null,
        });
        
        // Since create returns the user with insertId, we need to make sure we have id_usuario
        usuario.id_usuario = usuario.id_usuario || usuario.insertId;
        
        // Verify them immediately
        await usuarioModel.verifyEmail(usuario.id_usuario);
        
        // Fetch full user data
        usuario = await usuarioModel.findByEmail(email);
    } else {
        // 4. If user exists but wasn't verified, verify them now
        if (!usuario.email_verificado) {
            await usuarioModel.verifyEmail(usuario.id_usuario);
            usuario.email_verificado = 1;
        }
    }

    // 5. Sign JWT
    const payload = {
        id_usuario: usuario.id_usuario,
        email:      usuario.email,
        rol:        usuario.rol,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // 6. Return token + safe user data
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

export default { register, login, googleLogin };
