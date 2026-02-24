import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const VerifyEmail = () => {
  const [searchParams]        = useSearchParams();
  const navigate              = useNavigate();
  const [status, setStatus]   = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Token de verificación no encontrado en la URL.");
      return;
    }

    fetch(`${API_BASE}/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setMessage(data.message || "¡Email verificado correctamente!");
        } else {
          setStatus("error");
          setMessage(data.message || "El enlace es inválido o ya fue utilizado.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("No se pudo conectar con el servidor. Inténtalo más tarde.");
      });
  }, [searchParams]);

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center p-6 overflow-hidden"
      style={{ backgroundColor: "#121011" }}
    >
      {/* Background glow */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: "rgba(238,43,75,0.10)" }}
      />

      <div className="w-full max-w-md z-10">
        <div
          className="p-8 rounded-2xl shadow-2xl text-center space-y-6"
          style={{
            background:    "rgba(34,16,19,0.9)",
            backdropFilter:"blur(12px)",
            border:        "1px solid rgba(238,43,75,0.15)",
          }}
        >
          {/* Logo */}
          <img
            src="/logo/logo.png"
            alt="Circuit Metropoli"
            className="h-16 w-auto object-contain mx-auto drop-shadow-[0_0_24px_rgba(238,43,75,0.35)]"
            onError={(e) => { e.target.style.display = "none"; }}
          />

          {/* Loading */}
          {status === "loading" && (
            <>
              <span
                className="material-symbols-outlined animate-spin mx-auto block"
                style={{ fontSize: "56px", color: "#ee2b4b" }}
              >
                autorenew
              </span>
              <p className="text-slate-400">Verificando tu correo…</p>
            </>
          )}

          {/* Success */}
          {status === "success" && (
            <>
              <span
                className="material-symbols-outlined mx-auto block"
                style={{ fontSize: "64px", color: "#22c55e" }}
              >
                verified
              </span>
              <h2 className="text-2xl font-bold text-slate-100">¡Cuenta activada!</h2>
              <p className="text-slate-400 text-sm">{message}</p>
              <Link
                to="/login"
                className="block w-full font-bold py-3 rounded-xl transition-all hover:opacity-90"
                style={{ backgroundColor: "#ee2b4b", color: "#fff" }}
              >
                Iniciar Sesión
              </Link>
            </>
          )}

          {/* Error */}
          {status === "error" && (
            <>
              <span
                className="material-symbols-outlined mx-auto block"
                style={{ fontSize: "64px", color: "#ee2b4b" }}
              >
                cancel
              </span>
              <h2 className="text-2xl font-bold text-slate-100">Enlace inválido</h2>
              <p className="text-slate-400 text-sm">{message}</p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/signup"
                  className="block w-full font-bold py-3 rounded-xl transition-all hover:opacity-90"
                  style={{ backgroundColor: "#ee2b4b", color: "#fff" }}
                >
                  Volver al Registro
                </Link>
                <Link
                  to="/login"
                  className="block w-full font-bold py-3 rounded-xl border border-slate-700/50 text-slate-300 transition-all hover:bg-white/5"
                >
                  Ir al Login
                </Link>
              </div>
            </>
          )}
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

export default VerifyEmail;
