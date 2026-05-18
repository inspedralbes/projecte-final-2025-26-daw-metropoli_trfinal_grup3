import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../layouts/Navbar";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const Settings = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      
      // Default to true (Dark Mode) if nothing is saved
      return true;
    }
    return true;
  });

  const [themeColor, setThemeColor] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("themeColor") || "default";
    }
    return "default";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("themeColor", themeColor);
    const root = document.documentElement;
    if (themeColor === "red") {
      root.style.setProperty("--theme-color", "#ef4444"); // Tailwind red-500
      root.style.setProperty("--theme-text", "#ffffff");
    } else if (themeColor === "green") {
      root.style.setProperty("--theme-color", "#10b981"); // Tailwind emerald-500
      root.style.setProperty("--theme-text", "#ffffff");
    } else if (themeColor === "blue") {
      root.style.setProperty("--theme-color", "#3b82f6"); // Tailwind blue-500
      root.style.setProperty("--theme-text", "#ffffff");
    } else if (themeColor === "pink") {
      root.style.setProperty("--theme-color", "#ff98cf"); // Pastel/Vibrant Pink
      root.style.setProperty("--theme-text", "#ffffff"); // White text requested by user
    } else {
      // Default (Black/White depending on dark mode)
      root.style.removeProperty("--theme-color");
      root.style.removeProperty("--theme-text");
    }
  }, [themeColor, darkMode]);

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${value ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`}
    >
      <div
        className={`w-5 h-5 rounded-full shadow-sm transition-transform ${value ? "translate-x-[20px] bg-primary-text" : "translate-x-0 bg-white"}`}
      ></div>
    </button>
  );

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-white font-display select-none transition-colors duration-300 md:pl-20">
      {/* Header */}
      <div className="w-full pt-6 px-5 pb-2 z-20 flex justify-between items-center transition-colors shrink-0 touch-none md:max-w-3xl md:mx-auto">
        <div className="md:hidden flex items-center gap-2">
          <Link 
            to="/" 
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-primary rounded-full text-slate-700 dark:text-primary-text shadow-sm border border-slate-200 dark:border-transparent hover:bg-slate-100 dark:hover:bg-primary-dark transition-colors shrink-0"
          >
            <i className="fa-solid fa-house text-base"></i>
          </Link>
        </div>
        <h1 className="hidden md:block text-2xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white">
          <span className="text-primary">{t("settings.app", "App")}</span> {t("settings.title", "Ajustes")}
        </h1>
        <Link
          to="/profile"
          className="w-10 h-10 rounded-full border-2 border-primary p-0.5 overflow-hidden shadow-sm"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="overflow-y-auto no-scrollbar pb-24 md:pb-10 px-5 space-y-8 pt-4 md:max-w-3xl md:mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white md:hidden">
          {t("settings.title")}
        </h2>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          <div className="space-y-8">
            {/* Language */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                {t("settings.language")}
              </h3>
              <div className="bg-white dark:bg-[#12080a] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <i className="fa-solid fa-globe text-sm"></i>
                  </div>
                  <span className="text-slate-700 dark:text-slate-200 font-semibold text-sm">
                    {t("settings.appLanguage")}
                  </span>
                </div>
                <LanguageSwitcher />
              </div>
            </div>

            {/* App Preferences */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                {t("settings.appPreferences")}
              </h3>
              <div className="bg-white dark:bg-[#12080a] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                {[
                  {
                    icon: "fa-bell",
                    label: t("settings.pushNotifications"),
                    value: notifications,
                    onChange: setNotifications,
                  },
                  {
                    icon: "fa-location-dot",
                    label: t("settings.locationServices"),
                    value: location,
                    onChange: setLocation,
                  },
                  {
                    icon: "fa-moon",
                    label: t("settings.darkMode"),
                    value: darkMode,
                    onChange: setDarkMode,
                  },
                ].map(({ icon, label, value, onChange }) => (
                  <div
                    key={icon}
                    className="w-full flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center"
                      >
                        <i className={`fa-solid ${icon} text-xs`}></i>
                      </div>
                      <span className="text-slate-700 dark:text-slate-200 font-semibold text-sm">
                        {label}
                      </span>
                    </div>
                    <Toggle value={value} onChange={onChange} />
                  </div>
                ))}
              </div>
            </div>

            {/* Theme Color Selection */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                {t("settings.themeColor", "Theme Color")}
              </h3>
              <div className="bg-white dark:bg-[#12080a] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <i className="fa-solid fa-palette text-sm"></i>
                  </div>
                  <span className="text-slate-700 dark:text-slate-200 font-semibold text-sm">
                    {t("settings.accentColor", "Accent Color")}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {[
                    { id: "default", bg: "bg-slate-800 dark:bg-slate-200" },
                    { id: "red", bg: "bg-red-500" },
                    { id: "green", bg: "bg-emerald-500" },
                    { id: "blue", bg: "bg-blue-500" },
                    { id: "pink", bg: "bg-[#ff98cf]" }
                  ].map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setThemeColor(color.id)}
                      className={`w-8 h-8 rounded-full ${color.bg} flex items-center justify-center transition-transform ${themeColor === color.id ? 'scale-110 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#12080a] ring-primary' : 'hover:scale-105'}`}
                    >
                      {themeColor === color.id && (
                        <i className={`fa-solid fa-check text-[10px] ${color.id === 'default' ? 'text-white dark:text-black' : 'text-white'}`}></i>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Download App */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                {t("settings.downloadAppTitle", "Descargar App")}
              </h3>
              <div className="bg-white dark:bg-[#12080a] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-5 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3 text-green-500">
                  <span className="material-symbols-outlined text-3xl">
                    android
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-1">
                  {t("settings.getAndroidApp", "Lleva WeMap en tu móvil")}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  {t("settings.downloadDesc", "Instala la aplicación nativa para una mejor experiencia y notificaciones en tiempo real.")}
                </p>
                <a
                  href="/WeMap.apk"
                  download="WeMap.apk"
                  className="w-full py-3 px-4 bg-primary text-primary-text font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20"
                >
                  <i className="fa-solid fa-download text-sm"></i>
                  {t("settings.downloadAndroid", "Descargar APK Android")}
                </a>
              </div>
            </div>

            {/* WeMap Extension */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                {t("settings.extensionTitle", "Extensión de Navegador")}
              </h3>
              <div className="bg-white dark:bg-[#12080a] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-5 flex flex-col items-center text-center transition-all hover:border-primary/30 group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 text-primary group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-puzzle-piece text-3xl"></i>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-1">
                  {t("settings.chromeExtension", "WeMap Premium Extension")}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 px-2">
                  {t("settings.extensionDesc", "Accede a tus mapas, comunidad y perfil instantáneamente desde cualquier pestaña.")}
                </p>
                <a
                  href="/wemap-extension.zip"
                  download="wemap-extension.zip"
                  className="w-full py-3 px-4 bg-primary text-primary-text font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20"
                >
                  <i className="fa-solid fa-download text-sm"></i>
                  {t("settings.downloadExtension", "Instalar Extensión")}
                </a>
                <div className="mt-4 p-3 bg-slate-50 dark:bg-white/5 rounded-xl text-left w-full">
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1">
                    <i className="fa-solid fa-circle-info"></i> {t("settings.installStepsTitle", "Pasos para instalar:")}
                  </p>
                  <ol className="text-[10px] text-slate-400 space-y-1 list-decimal ml-3">
                    <li>{t("settings.installStep1", "Descarga y descomprime el archivo ZIP.")}</li>
                    <li>{t("settings.installStep2", "Ve a")} <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">chrome://extensions</code></li>
                    <li>{t("settings.installStep3", "Activa el")} <b>{t("settings.installStep3Bold", "\"Modo desarrollador\"")}</b> {t("settings.installStep3Extra", "(arriba a la derecha).")}</li>
                    <li>{t("settings.installStep4", "Haz clic en")} <b>{t("settings.installStep4Bold", "\"Cargar descomprimida\"")}</b> {t("settings.installStep4Extra", "y selecciona la carpeta.")}</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* App Info */}
            <div className="bg-white dark:bg-[#12080a] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                  <i className="fa-solid fa-map text-lg"></i>
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm">
                    {t("settings.footerApp", "Aplicación WeMap")}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t("settings.footerVersion", "Versión Estable")}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 text-center p-2 rounded-xl bg-slate-50 dark:bg-white/5">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    {t("common.version", "Version")}
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-white">
                    1.0.0
                  </p>
                </div>
                <div className="flex-1 text-center p-2 rounded-xl bg-slate-50 dark:bg-white/5">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    {t("common.build", "Build")}
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-white">
                    2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Settings;
