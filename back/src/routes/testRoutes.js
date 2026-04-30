import express from 'express';
import bcrypt from 'bcrypt';
import { query } from '../config/mysql.js';

const router = express.Router();

/**
 * POST /api/test/seed
 * Crea usuaris de test amb email ja verificat.
 * NOMÉS disponible en mode NO producció.
 */
router.post('/seed', async (req, res) => {
    // Bloquejar en producció
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ success: false, message: 'Not available in production' });
    }

    try {
        const testUsers = [
            { nombre: 'Usuari Test',  email: 'test@wemap.cat',  password: 'Test1234!' },
            { nombre: 'Altre Usuari', email: 'otro@wemap.cat',  password: 'Test1234!' },
        ];

        for (const user of testUsers) {
            const hash = await bcrypt.hash(user.password, 10);

            // INSERT OR UPDATE: si ja existeix actualitzem el hash i el verifiquem
            await query(
                `INSERT INTO usuario (nombre, email, password_hash, email_verificado)
                 VALUES (?, ?, ?, TRUE)
                 ON DUPLICATE KEY UPDATE
                     password_hash    = VALUES(password_hash),
                     email_verificado = TRUE`,
                [user.nombre, user.email, hash]
            );
        }

        res.json({ success: true, message: 'Usuaris de test creats/actualitzats' });
    } catch (error) {
        console.error('Error seeding test users:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * DELETE /api/test/cleanup
 * Elimina els usuaris de test.
 */
router.delete('/cleanup', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ success: false, message: 'Not available in production' });
    }
    try {
        await query(`DELETE FROM usuario WHERE email IN ('test@wemap.cat', 'otro@wemap.cat')`);
        res.json({ success: true, message: 'Usuaris de test eliminats' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
