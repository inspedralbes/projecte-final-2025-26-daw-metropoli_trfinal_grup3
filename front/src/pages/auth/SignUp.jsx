import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "http://localhost:3000/api";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [captchaToken, setCaptchaToken]   = useState(null);
  const [step, setStep]                   = useState("form");    // "form" | "check-email"
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [verifyCode, setVerifyCode]       = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError]     = useState(null);
  const [verifyStatus, setVerifyStatus]   = useState("idle"); // "idle" | "loading" | "success" | "error"
  const captchaRef                        = useRef(null);

  const [googleData, setGoogleData]       = useState(null); // { token, email, nombre }

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      handleGoogleAuth(tokenResponse.access_token);
    },
    onError: (error) => {
      console.error("Google login failed:", error);
      setError("El inicio de sesión con Google falló o fue cancelado.");
    },
  });

  const handleGoogleAuth = async (accessToken, password = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ google_access_token: accessToken, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al autenticar con Google.");
        return;
      }

      if (data.data.needs_password) {
        setGoogleData({ token: accessToken, email: data.data.email, nombre: data.data.nombre });
        setStep("google-password");
        return;
      }

      // Save token and redirect
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("usuario", JSON.stringify(data.data.usuario));
      navigate("/home");
    } catch (err) {
      console.error("Google login error:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePasswordSubmit = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const confirm  = e.target.confirm.value;

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    handleGoogleAuth(googleData.token, password);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!captchaToken) {
      setError("Por favor completa el CAPTCHA antes de continuar.");
      return;
    }

    const nombre   = e.target.name.value.trim();
    const email    = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirm  = e.target.confirm.value;

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/auth/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ nombre, email, password, captchaToken }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al registrar. Inténtalo de nuevo.");
        captchaRef.current?.reset();
        setCaptchaToken(null);
        return;
      }

      setStep("check-email");
    } catch {
      setError("No se pudo conectar con el servidor. Inténtalo más tarde.");
      captchaRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    if (e) e.preventDefault();
    if (verifyCode.length < 6) return;

    setVerifyLoading(true);
    setVerifyError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/verify-email?token=${encodeURIComponent(verifyCode)}`);
      const data = await res.json();

      if (data.success) {
        setVerifyStatus("success");
      } else {
        setVerifyStatus("error");
        setVerifyError(data.message || "Código inválido.");
      }
    } catch (err) {
      setVerifyStatus("error");
      setVerifyError("Error de conexión.");
    } finally {
      setVerifyLoading(false);
    }
  };

  // ── Pantalla "Completar contraseña Google" ──────────────────────────────────
  if (step === "google-password") {
    return (
      <div
        className="relative flex min-h-screen w-full flex-col items-center justify-center p-6 overflow-hidden bg-gray-50 dark:bg-[#121011] transition-colors duration-300"
      >
        {/* ── Back button ── */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10 transition-colors shadow-sm"
          aria-label="Back to App"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </Link>

        <div className="w-full max-w-md z-10 space-y-6">
          <div
            className="p-8 rounded-2xl shadow-2xl space-y-6 bg-white/90 dark:bg-[#12080a]/90 backdrop-blur-md border border-slate-200 dark:border-primary/15"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Casi listo, {googleData?.nombre.split(' ')[0]}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Crea una contraseña para terminar de configurar tu cuenta.</p>
            </div>

            <form onSubmit={handleGooglePasswordSubmit} className="space-y-5">
              {error && (
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>error</span>
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Nueva Contraseña</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">lock</span>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Confirmar Contraseña</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">shield_lock</span>
                  <input
                    name="confirm"
                    type={showConfirm ? "text" : "password"}
                    className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full font-bold py-4 rounded-xl transition-all hover:opacity-90 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                style={{ backgroundColor: "#ee2b4b", color: "#fff" }}
              >
                {loading ? <span className="material-symbols-outlined animate-spin">autorenew</span> : "COMPLETAR REGISTRO"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Pantalla "Revisa tu correo" ──────────────────────────────────────────────
  if (step === "check-email") {
    return (
      <div
        className="relative flex min-h-screen w-full flex-col items-center justify-center p-6 overflow-hidden bg-gray-50 dark:bg-[#121011] transition-colors duration-300"
      >
        {/* ── Back button ── */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10 transition-colors shadow-sm"
          aria-label="Back to App"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </Link>

        <div className="w-full max-w-md z-10 text-center space-y-6">
          <div
            className="p-8 rounded-2xl shadow-2xl space-y-6 bg-white/90 dark:bg-[#12080a] backdrop-blur-md border border-slate-200 dark:border-primary/15"
          >
            {verifyStatus === "success" ? (
              <div className="space-y-6">
                <span className="material-symbols-outlined mx-auto block" style={{ fontSize: "64px", color: "#22c55e" }}>
                  verified
                </span>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">¡Cuenta activada!</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Tu correo ha sido verificado correctamente. Ya puedes iniciar sesión.</p>
                <Link
                  to="/login"
                  className="block w-full font-bold py-4 rounded-xl transition-all hover:opacity-90 shadow-lg shadow-primary/20"
                  style={{ backgroundColor: "#ee2b4b", color: "#fff" }}
                >
                  Ir al Login
                </Link>
              </div>
            ) : (
              <>
                {/* Icon */}
                <div className="flex justify-center">
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontSize: "64px" }}
                  >
                    mark_email_unread
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">¡Revisa tu correo!</h2>
                  <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Te hemos enviado un <strong>código de 6 dígitos</strong>. Introdúcelo aquí debajo para activar tu cuenta.
                  </p>
                </div>

                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <input
                    type="text"
                    maxLength="6"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full text-center text-3xl font-bold tracking-[0.5em] py-4 bg-gray-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                    required
                  />

                  {verifyError && (
                    <p className="text-primary text-sm font-medium">{verifyError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={verifyLoading || verifyCode.length < 6}
                    className="w-full font-bold py-4 rounded-xl transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    style={{ backgroundColor: "#ee2b4b", color: "#fff" }}
                  >
                    {verifyLoading ? (
                      <span className="material-symbols-outlined animate-spin">autorenew</span>
                    ) : (
                      "Verificar Código"
                    )}
                  </button>
                </form>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-slate-400 dark:text-slate-500 text-xs text-left">
                    ¿No ves el email? Revisa la carpeta de <strong>spam</strong> o correo no deseado.
                  </p>
                  <button 
                    onClick={() => setStep("form")}
                    className="text-primary text-xs font-semibold mt-4 block mx-auto hover:underline"
                  >
                    Volver al registro
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Formulario de registro ───────────────────────────────────────────────────
  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center p-6 overflow-hidden bg-gray-50 dark:bg-[#121011] transition-colors duration-300"
      style={{
        backgroundImage:
          "linear-gradient(45deg, currentColor 25%, transparent 25%), linear-gradient(-45deg, currentColor 25%, transparent 25%), linear-gradient(45deg, transparent 75%, currentColor 75%), linear-gradient(-45deg, transparent 75%, currentColor 75%)",
        backgroundSize:    "8px 8px",
        backgroundPosition:"0 0, 0 4px, 4px 4px, 4px 0",
      }}
    >
      {/* Pattern opacity filter */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none text-slate-900 dark:text-slate-100"></div>

      {/* Background Glow */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none bg-primary/5 dark:bg-primary/10"
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none bg-primary/5 dark:bg-primary/5"
      />

      {/* ── Back button ── */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10 transition-colors shadow-sm"
        aria-label="Back to App"
      >
        <span className="material-symbols-outlined text-[24px]">close</span>
      </Link>

      <div className="w-full max-w-md z-10 space-y-8">

        {/* ── Logo & Title ── */}
        <div className="flex flex-col items-center space-y-4">
          <img
            src="/logo/logo1.png"
            alt="Circuit de Barcelona-Catalunya"
            className="h-24 w-auto object-contain drop-shadow-xl block dark:hidden"
          />
          <img
            src="/logo/logo.png"
            alt="Circuit de Barcelona-Catalunya"
            className="h-24 w-auto object-contain drop-shadow-[0_0_24px_rgba(238,43,75,0.35)] hidden dark:block"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Join the Race</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Create your account for exclusive track access</p>
          </div>
        </div>

        {/* ── Glass Panel ── */}
        <div
          className="p-6 rounded-2xl shadow-2xl bg-white/80 dark:bg-[#12080a] backdrop-blur-md border border-slate-200 dark:border-primary/10"
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error banner */}
            {error && (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px", flexShrink: 0 }}>error</span>
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" style={{ fontSize: "20px" }}>
                  person
                </span>
                <input
                  className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                  id="name"
                  name="name"
                  placeholder="Lewis Hamilton"
                  type="text"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" style={{ fontSize: "20px" }}>
                  mail
                </span>
                <input
                  className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                  id="email"
                  name="email"
                  placeholder="lewis@f1.com"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-2 gap-3">
              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" style={{ fontSize: "18px" }}>
                    lock
                  </span>
                  <input
                    className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl py-3.5 pl-10 pr-8 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1" htmlFor="confirm">
                  Confirm
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" style={{ fontSize: "18px" }}>
                    shield_lock
                  </span>
                  <input
                    className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl py-3.5 pl-10 pr-8 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                    id="confirm"
                    name="confirm"
                    placeholder="••••••••"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                      {showConfirm ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 px-1 pt-1">
              <input
                className="mt-0.5 w-4 h-4 rounded accent-primary flex-shrink-0 cursor-pointer"
                id="terms"
                type="checkbox"
                required
              />
              <label className="text-sm text-slate-500 dark:text-slate-400 leading-tight cursor-pointer" htmlFor="terms">
                I agree to the{" "}
                <a className="text-primary font-semibold hover:underline" href="#">Terms &amp; Conditions</a>
                {" "}and{" "}
                <a className="text-primary font-semibold hover:underline" href="#">Privacy Policy</a>.
              </label>
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center pt-1">
              <div
                className="rounded-xl overflow-hidden border border-slate-200 dark:border-primary/15"
              >
                <ReCAPTCHA
                  ref={captchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  theme={document.documentElement.classList.contains("dark") ? "dark" : "light"}
                  onChange={(token) => setCaptchaToken(token)}
                  onExpired={() => setCaptchaToken(null)}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              className="w-full text-white font-bold py-4 rounded-xl transform transition-all active:scale-[0.98] hover:opacity-90 flex items-center justify-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              style={{ backgroundColor: "#ee2b4b" }}
              type="submit"
              disabled={!captchaToken || loading}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: "20px" }}>autorenew</span>
                  CREATING ACCOUNT…
                </>
              ) : (
                <>
                  CREATE ACCOUNT
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: "20px" }}>
                    chevron_right
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-3 text-slate-400 dark:text-slate-500 tracking-widest bg-white dark:bg-[#1a0c0e]">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => loginWithGoogle()}
              className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700/50 rounded-xl py-3 px-4 transition-all hover:bg-slate-50 dark:hover:bg-white/10 active:scale-95 w-full bg-white dark:bg-white/5"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Google</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 ml-1" to="/login">
              Log In
            </Link>
          </p>
        </div>
      </div>

      {/* iOS Home Indicator */}
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 rounded-full"
        style={{ backgroundColor: "rgba(100,100,120,0.5)" }}
      />
    </div>
  );
};

export default SignUp;

