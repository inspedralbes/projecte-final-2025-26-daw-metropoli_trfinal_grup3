import nodemailer from 'nodemailer';

// ── SMTP Transporter ──────────────────────────────────────────────────────────
// Configure via environment variables. Works with Gmail (App Passwords),
// Mailtrap (dev/testing), or any SMTP provider.
//
// Gmail example:
//   EMAIL_HOST=smtp.gmail.com  EMAIL_PORT=587
//   EMAIL_USER=you@gmail.com   EMAIL_PASS=your_app_password
//
// Mailtrap example:
//   EMAIL_HOST=sandbox.smtp.mailtrap.io  EMAIL_PORT=2525
//   EMAIL_USER=<mailtrap_user>           EMAIL_PASS=<mailtrap_pass>

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,          // true for port 465, false for 587 (STARTTLS)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ── sendVerificationEmail ─────────────────────────────────────────────────────
export const sendVerificationEmail = async (toEmail, token) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyLink  = `${frontendUrl}/verify-email?token=${token}`;

    await transporter.sendMail({
        from: `"Circuit Metropoli" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: '✅ Verifica tu correo — Circuit Metropoli',
        html: `
            <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#121011;color:#e2e8f0;padding:32px;border-radius:16px;border:1px solid rgba(238,43,75,0.2)">
                <h1 style="color:#ee2b4b;margin:0 0 8px">Circuit Metropoli</h1>
                <p style="margin:0 0 24px;color:#94a3b8">Verifica tu dirección de correo para activar tu cuenta.</p>
                <a href="${verifyLink}"
                   style="display:inline-block;background:#ee2b4b;color:#fff;text-decoration:none;font-weight:bold;padding:14px 32px;border-radius:10px;letter-spacing:.5px">
                    VERIFICAR MI CORREO
                </a>
                <p style="margin:24px 0 0;font-size:13px;color:#64748b">
                    Este enlace caduca en <strong>24 horas</strong>.<br>
                    Si no creaste una cuenta, ignora este mensaje.
                </p>
                <p style="margin:8px 0 0;font-size:11px;color:#475569;word-break:break-all">
                    O copia y pega: ${verifyLink}
                </p>
            </div>
        `,
    });
};

export default { sendVerificationEmail };
