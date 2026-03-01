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
      return (
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
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

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${value ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`}
    >
      <div
        className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${value ? "translate-x-[20px]" : "translate-x-0"}`}
      ></div>
    </button>
  );

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-white font-display select-none transition-colors duration-300 md:pl-16">
      {/* Header */}
      <div className="w-full pt-6 px-5 pb-2 z-20 flex justify-between items-center transition-colors shrink-0 touch-none md:max-w-3xl md:mx-auto">
        <div className="md:hidden flex items-center gap-2">
          <Link to="/home">
            <img
              src="/logo/logo1.png"
              alt="Circuit de Catalunya"
              className="h-12 w-auto object-contain block dark:hidden"
            />
            <img
              src="/logo/logo.png"
              alt="Circuit de Catalunya"
              className="h-12 w-auto object-contain hidden dark:block"
            />
          </Link>
        </div>
        <h1 className="hidden md:block text-2xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white">
          <span className="text-primary">App</span> Settings
        </h1>
        <Link
          to="/profile"
          className="w-10 h-10 rounded-full border-2 border-primary p-0.5 overflow-hidden shadow-sm"
        >
          <img
            src="https://i.pravatar.cc/150?img=12"
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
              <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">
                      language
                    </span>
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
              <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                {[
                  {
                    icon: "notifications",
                    label: t("settings.pushNotifications"),
                    value: notifications,
                    onChange: setNotifications,
                    color: "bg-blue-50 dark:bg-blue-900/30 text-blue-500",
                  },
                  {
                    icon: "location_on",
                    label: t("settings.locationServices"),
                    value: location,
                    onChange: setLocation,
                    color: "bg-green-50 dark:bg-green-900/30 text-green-500",
                  },
                  {
                    icon: "dark_mode",
                    label: t("settings.darkMode"),
                    value: darkMode,
                    onChange: setDarkMode,
                    color: "bg-purple-50 dark:bg-purple-900/30 text-purple-500",
                  },
                ].map(({ icon, label, value, onChange, color }) => (
                  <div
                    key={icon}
                    className="w-full flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {icon}
                        </span>
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
          </div>

          <div className="space-y-8">
            {/* App Info */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/logo/logo1.png"
                  alt="Logo"
                  className="h-8 w-auto block dark:hidden"
                />
                <img
                  src="/logo/logo.png"
                  alt="Logo"
                  className="h-8 w-auto hidden dark:block"
                />
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm">
                    {t("settings.footerApp")}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t("settings.footerVersion")}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 text-center p-2 rounded-xl bg-slate-50 dark:bg-white/5">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Version
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-white">
                    1.0.0
                  </p>
                </div>
                <div className="flex-1 text-center p-2 rounded-xl bg-slate-50 dark:bg-white/5">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Build
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
