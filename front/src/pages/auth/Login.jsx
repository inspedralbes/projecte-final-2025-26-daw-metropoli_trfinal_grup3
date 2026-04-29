import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:3000/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            google_access_token: tokenResponse.access_token,
            is_login: true,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Error al iniciar sessió amb Google.");
          return;
        }

        localStorage.setItem("token", data.data.token);
        localStorage.setItem("usuario", JSON.stringify(data.data.usuario));
        navigate("/home");
      } catch (err) {
        setError("No es va poder connectar amb el servidor.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError("L'inici de sessió amb Google ha fallat.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error_code === "EMAIL_NOT_VERIFIED") {
          setError("Has de verificar el teu correu abans d'entrar.");
        } else {
          setError(data.message || "Credencials incorrectes.");
        }
        return;
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("usuario", JSON.stringify(data.data.usuario));
      navigate("/home");
    } catch {
      setError("Error de connexió amb el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#f0f4f9] dark:bg-slate-950 text-[#1a1a1a] dark:text-white transition-colors duration-300 overflow-hidden font-display">
      
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-white dark:bg-white/5 blur-[120px] opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-black/5 dark:bg-black blur-[120px] opacity-30"></div>
      </div>

      {/* Back to Home */}
      <Link
        to="/home"
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-sm font-medium opacity-40 hover:opacity-100 transition-opacity"
      >
        <span className="material-symbols-outlined text-lg">west</span>
        Tornar a l'inici
      </Link>

      <div className="w-full max-w-[400px] z-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <i className="fa-solid fa-location-dot text-5xl opacity-20" style={{ color: 'rgb(254, 254, 254)' }}></i>
          <div className="space-y-1">
            <h1 className="text-4xl font-medium tracking-tighter">wemap</h1>
            <p className="text-gray-400 font-medium tracking-tight">Entra per continuar explorant</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold py-3 px-4 rounded-2xl flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}

            <div className="space-y-1">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Correu electrònic"
                className="w-full bg-white dark:bg-white/5 border border-transparent focus:border-black/10 dark:focus:border-white/20 rounded-2xl py-4 px-6 text-sm font-medium placeholder-gray-400 outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Contrasenya"
                className="w-full bg-white dark:bg-white/5 border border-transparent focus:border-black/10 dark:focus:border-white/20 rounded-2xl py-4 px-6 text-sm font-medium placeholder-gray-400 outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white dark:bg-white dark:text-black font-medium tracking-tight py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                "Iniciar sessió"
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/5 dark:border-white/10"></div>
            </div>
            <span className="relative px-4 bg-transparent text-[10px] font-bold uppercase tracking-widest text-gray-400">O continua amb</span>
          </div>

          <button
            onClick={() => loginWithGoogle()}
            className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-sm font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm font-medium text-gray-400">
          No tens compte?{" "}
          <Link to="/signup" className="text-black dark:text-white font-bold hover:underline underline-offset-4 ml-1 transition-all">
            Registra't gratis
          </Link>
        </p>
      </div>

      {/* Decorative indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 opacity-20">
        <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
      </div>
    </div>
  );
};

export default Login;
