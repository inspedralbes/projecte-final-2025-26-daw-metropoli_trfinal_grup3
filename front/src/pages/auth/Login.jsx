import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "http://localhost:3000/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const captchaRef                      = useRef(null);
  const navigate                        = useNavigate();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google token response:", tokenResponse);
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ google_access_token: tokenResponse.access_token, is_login: true }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Error al iniciar sesión con Google.");
          return;
        }

        // Save token and redirect
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("usuario", JSON.stringify(data.data.usuario));
        navigate("/home");
      } catch (err) {
        console.error("Google login error:", err);
        setError("No se pudo conectar con el servidor para el login de Google.");
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google login failed:", error);
      setError("El inicio de sesión con Google falló o fue cancelado.");
    },
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!captchaToken) {
      setError("Por favor completa el CAPTCHA antes de continuar.");
      return;
    }

    const email    = e.target.email.value.trim();
    const password = e.target.password.value;

    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password, captchaToken }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Specific message for unverified accounts
        if (data.error_code === "EMAIL_NOT_VERIFIED") {
          setError("Debes verificar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.");
        } else {
          setError(data.message || "Credenciales incorrectas.");
        }
        captchaRef.current?.reset();
        setCaptchaToken(null);
        return;
      }

      // Save token and redirect
      localStorage.setItem("token",   data.data.token);
      localStorage.setItem("usuario", JSON.stringify(data.data.usuario));
      navigate("/home");
    } catch {
      setError("No se pudo conectar con el servidor. Inténtalo más tarde.");
      captchaRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center p-6 overflow-hidden"
      style={{
        backgroundColor: "#121011",
        backgroundImage:
          "linear-gradient(45deg, #1a1819 25%, transparent 25%), linear-gradient(-45deg, #1a1819 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1819 75%), linear-gradient(-45deg, transparent 75%, #1a1819 75%)",
        backgroundSize:    "8px 8px",
        backgroundPosition:"0 0, 0 4px, 4px 4px, 4px 0",
      }}
    >
      {/* Background Glow */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: "rgba(238,43,75,0.10)" }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: "rgba(238,43,75,0.05)" }}
      />

      <div className="w-full max-w-md z-10 space-y-8">

        {/* ── Logo & Title ── */}
        <div className="flex flex-col items-center space-y-4">
          <img
            src="/logo/logo.png"
            alt="Circuit de Barcelona-Catalunya"
            className="h-24 w-auto object-contain drop-shadow-[0_0_24px_rgba(238,43,75,0.35)]"
            onError={(e) => {
              e.target.src =
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBl60Lkr3K8TzFbSfosdWCSasOW4TdjYMJqnuzb7Wx1zImM4L5_n_mWComGT0_IrgwTlsZlCyHssrs_OAKpPNdSH7gpAqh3iBdRAu2SLkfGzkExgU8DqwoI1_tWDH69F6ooB1BDSbn-OvVAR5fR4Y-UQKg5hbEpeXJEmm3fqL1dwHOgMgbvWAr85slWcrXA7YkdO663--b_n5WDVi3P0-32l5eo-fhzZuERNoIw3wu2Z5WVtUhGCUiBzJUIT0j2pt-GnobjHZ035lo";
            }}
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">Welcome Back</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to your race experience</p>
          </div>
        </div>

        {/* ── Glass Panel ── */}
        <div
          className="p-6 rounded-2xl shadow-2xl"
          style={{
            background:    "rgba(34,16,19,0.8)",
            backdropFilter:"blur(12px)",
            border:        "1px solid rgba(238,43,75,0.10)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error banner */}
            {error && (
              <div
                className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
                style={{ background: "rgba(238,43,75,0.12)", border: "1px solid rgba(238,43,75,0.30)", color: "#fca5a5" }}
              >
                <span className="material-symbols-outlined mt-0.5" style={{ fontSize: "18px", flexShrink: 0 }}>error</span>
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" style={{ fontSize: "20px" }}>
                  mail
                </span>
                <input
                  className="w-full border border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  style={{ backgroundColor: "rgba(18,16,17,0.5)" }}
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="password">
                  Password
                </label>
                <a className="text-xs font-medium text-primary hover:text-primary/80 transition-colors" href="#">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" style={{ fontSize: "20px" }}>
                  lock
                </span>
                <input
                  className="w-full border border-slate-700/50 rounded-xl py-3.5 pl-12 pr-12 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  style={{ backgroundColor: "rgba(18,16,17,0.5)" }}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center pt-1">
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(238,43,75,0.15)", filter: "invert(0.9) hue-rotate(180deg)" }}
              >
                <ReCAPTCHA
                  ref={captchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  theme="dark"
                  onChange={(token) => setCaptchaToken(token)}
                  onExpired={() => setCaptchaToken(null)}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              className="w-full text-white font-bold py-4 rounded-xl transform transition-all active:scale-[0.98] mt-2 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: "#ee2b4b", boxShadow: "0 10px 25px -5px rgba(238,43,75,0.2)" }}
              type="submit"
              disabled={!captchaToken || loading}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: "20px" }}>autorenew</span>
                  SIGNING IN…
                </>
              ) : "LOG IN"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-3 text-slate-500 tracking-widest" style={{ backgroundColor: "#1a0c0e" }}>
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => loginWithGoogle()}
              className="flex items-center justify-center gap-2 border border-slate-700/50 rounded-xl py-3 px-4 transition-all hover:bg-white/10 active:scale-95 w-full"
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-slate-300">Google</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 ml-1" to="/signup">
              Sign Up
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

export default Login;
