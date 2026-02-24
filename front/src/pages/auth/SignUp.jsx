import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";

// ⚠️ Replace with your real reCAPTCHA v2 Site Key from https://www.google.com/recaptcha/admin
const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // ← test key (works locally, always passes)

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);

  // Google OAuth
  const loginWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Google token:", tokenResponse);
      // TODO: send to backend
    },
    onError: (error) => console.error("Google login failed:", error),
  });

  // Apple OAuth
  const loginWithApple = () => {
    const params = new URLSearchParams({
      response_type: "code id_token",
      client_id: "YOUR_APPLE_SERVICE_ID", // ⚠️ Replace
      redirect_uri: window.location.origin + "/auth/apple/callback",
      scope: "name email",
      response_mode: "form_post",
      state: crypto.randomUUID(),
    });
    window.location.href = `https://appleid.apple.com/auth/authorize?${params.toString()}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Please complete the CAPTCHA before creating your account.");
      return;
    }
    // TODO: connect to backend auth — pass captchaToken for server-side verification
    console.log("reCAPTCHA token:", captchaToken);
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center p-6 overflow-hidden"
      style={{
        backgroundColor: "#121011",
        backgroundImage:
          "linear-gradient(45deg, #1a1819 25%, transparent 25%), linear-gradient(-45deg, #1a1819 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1819 75%), linear-gradient(-45deg, transparent 75%, #1a1819 75%)",
        backgroundSize: "8px 8px",
        backgroundPosition: "0 0, 0 4px, 4px 4px, 4px 0",
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">Join the Race</h1>
            <p className="text-slate-400 text-sm mt-1">Create your account for exclusive track access</p>
          </div>
        </div>

        {/* ── Glass Panel ── */}
        <div
          className="p-6 rounded-2xl shadow-2xl"
          style={{
            background: "rgba(34,16,19,0.8)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(238,43,75,0.10)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" style={{ fontSize: "20px" }}>
                  person
                </span>
                <input
                  className="w-full border border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  style={{ backgroundColor: "rgba(18,16,17,0.5)" }}
                  id="name"
                  placeholder="Lewis Hamilton"
                  type="text"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

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
                  placeholder="lewis@f1.com"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password + Confirm — same row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" style={{ fontSize: "18px" }}>
                    lock
                  </span>
                  <input
                    className="w-full border border-slate-700/50 rounded-xl py-3.5 pl-10 pr-8 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    style={{ backgroundColor: "rgba(18,16,17,0.5)" }}
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1" htmlFor="confirm">
                  Confirm
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" style={{ fontSize: "18px" }}>
                    shield_lock
                  </span>
                  <input
                    className="w-full border border-slate-700/50 rounded-xl py-3.5 pl-10 pr-8 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    style={{ backgroundColor: "rgba(18,16,17,0.5)" }}
                    id="confirm"
                    placeholder="••••••••"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
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
                className="mt-0.5 w-4 h-4 rounded accent-primary flex-shrink-0"
                id="terms"
                type="checkbox"
                required
              />
              <label className="text-sm text-slate-400 leading-tight" htmlFor="terms">
                I agree to the{" "}
                <a className="text-primary font-semibold hover:underline" href="#">Terms &amp; Conditions</a>
                {" "}and{" "}
                <a className="text-primary font-semibold hover:underline" href="#">Privacy Policy</a>.
              </label>
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
              className="w-full text-white font-bold py-4 rounded-xl transform transition-all active:scale-[0.98] hover:opacity-90 flex items-center justify-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#ee2b4b", boxShadow: "0 10px 25px -5px rgba(238,43,75,0.2)" }}
              type="submit"
              disabled={!captchaToken}
            >
              CREATE ACCOUNT
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: "20px" }}>
                chevron_right
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-3 text-slate-500 tracking-widest" style={{ backgroundColor: "#1a0c0e" }}>
                Or sign up with
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {/* Google */}
            <button
              type="button"
              onClick={() => loginWithGoogle()}
              className="flex items-center justify-center gap-2 border border-slate-700/50 rounded-xl py-3 px-4 transition-all hover:bg-white/10 active:scale-95"
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

            {/* Apple */}
            <button
              type="button"
              onClick={loginWithApple}
              className="flex items-center justify-center gap-2 border border-slate-700/50 rounded-xl py-3 px-4 transition-all hover:bg-white/10 active:scale-95"
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <svg className="w-5 h-5 fill-slate-100" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              <span className="text-sm font-medium text-slate-300">Apple</span>
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
