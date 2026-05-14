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
    await transporter.sendMail({
        from: `"WeMap" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: '🔐 Tu código de verificación — WeMap',
        html: `
            <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#ffffff;color:#000000;padding:40px;border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)">
                <h1 style="color:#000000;margin:0 0 8px;font-size:28px;font-weight:800;letter-spacing:-0.5px">WeMap</h1>
                <p style="margin:0 0 24px;color:#4b5563;font-size:16px">Utiliza el siguiente código para activar tu cuenta:</p>
                
                <div style="background:#f8fafc; border:2px solid #000000; padding:24px; border-radius:12px; text-align:center; margin-bottom:24px">
                    <span style="font-size:36px; font-weight:800; letter-spacing:10px; color:#000000; font-family:monospace">${token}</span>
                </div>
                
                <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;text-align:center;line-height:1.5">
                    Este código caduca en <strong>24 horas</strong>.<br>
                    Si no creaste una cuenta, ignora este mensaje de seguridad.
                </p>
            </div>
        `,
    });
};

export default { sendVerificationEmail };
