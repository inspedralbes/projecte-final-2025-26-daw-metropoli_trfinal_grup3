import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import usuarioModel from '../models/usuarioModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'metropoli_secret_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
const SALT_ROUNDS = 12;

// ── Register ──────────────────────────────────────────────────────────────────
const register = async ({ nombre, email, password, rol = 'visitante' }) => {
    // 1. Check for duplicate email
    const existing = await usuarioModel.findByEmail(email);
    if (existing) {
        const err = new Error('El email ya está registrado');
        err.code = 'EMAIL_EXISTS';
        throw err;
    }

    // 2. Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // 3. Persist user (model expects field named `password`)
    const nuevoUsuario = await usuarioModel.create({
        nombre,
        email,
        password: password_hash,
        rol,
    });

    // 4. Return safe user object (no hash)
    const { password: _pw, password_hash: _ph, ...safeUser } = nuevoUsuario;
    return safeUser;
};

// ── Login ─────────────────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
    // 1. Find user
    const usuario = await usuarioModel.findByEmail(email);
    if (!usuario) {
        const err = new Error('Credenciales incorrectas');
        err.code = 'INVALID_CREDENTIALS';
        throw err;
    }

    // 2. Verify password
    const passwordMatch = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordMatch) {
        const err = new Error('Credenciales incorrectas');
        err.code = 'INVALID_CREDENTIALS';
        throw err;
    }

    // 3. Sign JWT
    const payload = {
        id_usuario: usuario.id_usuario,
        email: usuario.email,
        rol: usuario.rol,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // 4. Return token + safe user data
    return {
        token,
        usuario: {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            fecha_registro: usuario.fecha_registro,
        },
    };
};

export default { register, login };
