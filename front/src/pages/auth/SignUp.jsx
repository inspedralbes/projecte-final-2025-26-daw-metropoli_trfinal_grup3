import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:3000/api";

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState("form"); // "form" | "check-email" | "google-password"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState("idle");

  const [googleData, setGoogleData] = useState(null);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      handleGoogleAuth(tokenResponse.access_token);
    },
    onError: () => {
      setError(t("auth.errorAuth", "L'autenticació amb Google ha fallat."));
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
        setError(data.message || t("auth.errorAuth", "Error en l'autenticació."));
        return;
      }

      if (data.data.needs_password) {
        setGoogleData({
          token: accessToken,
          email: data.data.email,
          nombre: data.data.nombre,
        });
        setStep("google-password");
        return;
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("usuario", JSON.stringify(data.data.usuario));
      navigate("/home");
    } catch (err) {
      setError(t("auth.errorConnect", "Error de connexió amb el servidor."));
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePasswordSubmit = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;

    if (password !== confirm) {
      setError(t("auth.passwordsNoMatch", "Les contrasenyes no coincideixen."));
      return;
    }

    if (password.length < 6) {
      setError(t("auth.passwordTooShort", "La contrasenya ha de tenir almenys 6 caràcters."));
      return;
    }

    handleGoogleAuth(googleData.token, password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const nombre = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;

    if (password !== confirm) {
      setError(t("auth.passwordsNoMatch", "Les contrasenyes no coincideixen."));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || t("auth.errorRegister", "Error al registrar."));
        return;
      }

      setStep("check-email");
    } catch {
      setError(t("auth.errorConnect", "Error de connexió amb el servidor."));
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
      const res = await fetch(
        `${API_BASE}/auth/verify-email?token=${encodeURIComponent(verifyCode)}`,
      );
      const data = await res.json();

      if (data.success) {
        setVerifyStatus("success");
      } else {
        setVerifyStatus("error");
        setVerifyError(data.message || t("auth.invalidCode", "Codi invàlid."));
      }
    } catch (err) {
      setVerifyStatus("error");
      setVerifyError(t("auth.errorConnect", "Error de connexió."));
    } finally {
      setVerifyLoading(false);
    }
  };

  // Wrapper components for layout consistency
  const AuthLayout = ({ children, title, subtitle, showBack = true }) => (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#f0f4f9] dark:bg-slate-950 text-[#1a1a1a] dark:text-white transition-colors duration-300 overflow-hidden font-display">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-white dark:bg-white/5 blur-[120px] opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-black/5 dark:bg-black blur-[120px] opacity-30"></div>
      </div>

      {showBack && (
        <Link to="/login" className="absolute top-8 left-8 z-50 flex items-center gap-2 text-sm font-medium opacity-40 hover:opacity-100 transition-opacity hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-lg">west</span>
          {t("auth.backToLogin", "Tornar al login")}
        </Link>
      )}

      <div className="w-full max-w-[420px] z-10 space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <i className="fa-solid fa-location-dot text-5xl opacity-20" style={{ color: 'var(--theme-color, #ffffff)' }}></i>
          <div className="space-y-1">
            <h1 className="text-3xl font-medium tracking-tighter text-black dark:text-primary">{title}</h1>
            <p className="text-gray-400 font-medium tracking-tight text-sm">{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );

  if (step === "google-password") {
    return (
      <AuthLayout title={`${t("auth.hello", "Hola")}, ${googleData?.nombre.split(" ")[0]}`} subtitle={t("auth.newPassword", "Crea una contrasenya per acabar de configurar el teu compte")}>
        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
          <form onSubmit={handleGooglePasswordSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold py-3 px-4 rounded-2xl flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}
            <div className="space-y-1 relative">
              <input name="password" type={showPassword ? "text" : "password"} placeholder={t("auth.newPassword", "Nova contrasenya")} className="w-full bg-white dark:bg-white/5 border border-transparent focus:border-black/10 dark:focus:border-primary/20 rounded-2xl py-4 px-6 text-sm font-medium placeholder-gray-400 outline-none transition-all" required />
            </div>
            <div className="space-y-1 relative">
              <input name="confirm" type={showConfirm ? "text" : "password"} placeholder={t("auth.confirmPassword", "Confirmar contrasenya")} className="w-full bg-white dark:bg-white/5 border border-transparent focus:border-black/10 dark:focus:border-primary/20 rounded-2xl py-4 px-6 text-sm font-medium placeholder-gray-400 outline-none transition-all" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-black text-white dark:bg-primary dark:text-primary-text font-medium tracking-tight py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 mt-4">
              {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : t("auth.completeRegistration", "Completar registre")}
            </button>
          </form>
        </div>
      </AuthLayout>
    );
  }

  if (step === "check-email") {
    return (
      <AuthLayout title={t("auth.checkEmail", "Revisa el teu correu")} subtitle={t("auth.checkEmailSub", "T'hem enviat un codi de 6 dígits per activar el teu compte")} showBack={false}>
        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-6 text-center">
          {verifyStatus === "success" ? (
            <div className="space-y-6 py-4">
              <span className="material-symbols-outlined text-6xl text-green-500">verified</span>
              <h2 className="text-xl font-bold">{t("auth.accountActivated", "Compte activat!")}</h2>
              <p className="text-gray-400 text-sm">{t("auth.readyToExplore", "Ja pots iniciar sessió i començar a explorar la ciutat.")}</p>
              <Link to="/login" className="block w-full bg-black text-white dark:bg-primary dark:text-primary-text font-medium py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all">{t("auth.goToLogin", "Anar al Login")}</Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <input type="text" maxLength="6" value={verifyCode} onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" className="w-full text-center text-4xl font-bold tracking-[0.4em] py-5 bg-white dark:bg-white/5 border border-transparent rounded-2xl text-black dark:text-white outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-all" required />
                {verifyError && <p className="text-red-500 text-xs font-bold">{verifyError}</p>}
                <button type="submit" disabled={verifyLoading || verifyCode.length < 6} className="w-full bg-black text-white dark:bg-primary dark:text-primary-text font-medium py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all disabled:opacity-50">
                  {verifyLoading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : t("auth.verifyCode", "Verificar codi")}
                </button>
              </form>
              <button onClick={() => setStep("form")} className="text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest">{t("auth.backToLogin", "Tornar al registre")}</button>
            </>
          )}
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t("auth.createAccount", "Crea el teu compte")} subtitle={t("auth.communityTag", "Uneix-te a la comunitat d'exploradors urbans")}>
      <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold py-3 px-4 rounded-2xl flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}
          <input name="name" type="text" placeholder={t("auth.name", "Nom complet")} className="w-full bg-white dark:bg-white/5 border border-transparent focus:border-black/10 dark:focus:border-primary/20 rounded-2xl py-4 px-6 text-sm font-medium placeholder-gray-400 outline-none transition-all" required />
          <input name="email" type="email" placeholder={t("auth.email", "Correu electrònic")} className="w-full bg-white dark:bg-white/5 border border-transparent focus:border-black/10 dark:focus:border-primary/20 rounded-2xl py-4 px-6 text-sm font-medium placeholder-gray-400 outline-none transition-all" required />
          <div className="grid grid-cols-2 gap-3">
            <input name="password" type={showPassword ? "text" : "password"} placeholder={t("auth.password", "Contrasenya")} className="w-full bg-white dark:bg-white/5 border border-transparent focus:border-black/10 dark:focus:border-primary/20 rounded-2xl py-4 px-6 text-xs font-medium placeholder-gray-400 outline-none transition-all" required />
            <input name="confirm" type={showConfirm ? "text" : "password"} placeholder={t("auth.confirmPassword", "Confirmar")} className="w-full bg-white dark:bg-white/5 border border-transparent focus:border-black/10 dark:focus:border-primary/20 rounded-2xl py-4 px-6 text-xs font-medium placeholder-gray-400 outline-none transition-all" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-black text-white dark:bg-primary dark:text-primary-text font-medium tracking-tight py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 mt-2">
            {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : t("auth.signup", "Registra't")}
          </button>
        </form>

        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5 dark:border-white/10"></div></div>
          <span className="relative px-4 bg-transparent text-[10px] font-bold uppercase tracking-widest text-gray-400">{t("auth.orRegisterWith", "O registra't amb")}</span>
        </div>

        <button onClick={() => loginWithGoogle()} className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-sm font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {t("auth.google", "Google")}
        </button>
      </div>

      <p className="text-center text-sm font-medium text-gray-400">
        {t("auth.hasAccount", "Ja tens compte?")}{" "}
        <Link to="/login" className="text-black dark:text-primary font-bold hover:underline underline-offset-4 ml-1 transition-all">{t("auth.login", "Inicia sessió")}</Link>
      </p>
    </AuthLayout>
  );
};

export default SignUp;
