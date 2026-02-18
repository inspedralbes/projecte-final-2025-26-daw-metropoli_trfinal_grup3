import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();

  // Helper to check if a path is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto">
      {/* Nav Bar Background */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 pt-2 pb-6 flex justify-between items-center relative shadow-[0_-5px_20px_rgba(0,0,0,0.05)] transition-colors duration-300">
        {/* Left Links */}
        <div className="flex gap-8">
          <Link
            to="/home"
            className={`flex flex-col items-center gap-2 group transition-colors ${
              isActive("/home")
                ? "text-primary pointer-events-none"
                : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 active:text-primary"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[48px] transition-transform ${
                isActive("/home")
                  ? "font-variation-settings-filled"
                  : "group-active:scale-110"
              }`}
            >
              home
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider absolute -bottom-4 ${
                isActive("/home")
                  ? "text-primary opacity-100"
                  : "text-primary opacity-0 group-active:opacity-100 transition-opacity"
              }`}
            >
              {t("nav.home")}
            </span>
          </Link>
          <Link
            to="/events"
            className={`flex flex-col items-center gap-2 group transition-colors ${
              isActive("/events")
                ? "text-primary pointer-events-none"
                : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 active:text-primary"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[48px] transition-transform ${
                isActive("/events")
                  ? "font-variation-settings-filled"
                  : "group-active:scale-110"
              }`}
            >
              calendar_month
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider absolute -bottom-4 ${
                isActive("/events")
                  ? "text-primary opacity-100"
                  : "text-primary opacity-0 group-active:opacity-100 transition-opacity"
              }`}
            >
              {t("nav.events")}
            </span>
          </Link>
        </div>

        {/* Central Map Button - Floats Above */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-12">
          {isActive("/") ? (
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <button className="relative bg-gradient-to-br from-[#ff3355] to-[#cc1133] text-white w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl shadow-primary/40 transition-all duration-200 border-[6px] border-white dark:border-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 pointer-events-none">
                <span className="material-symbols-outlined text-[56px] fill-1 leading-none drop-shadow-md">
                  map
                </span>
                <span className="text-xs font-black uppercase tracking-widest mt-1 drop-shadow-sm">
                  {t("nav.map")}
                </span>
              </button>
            </div>
          ) : (
            <Link to="/" className="relative group block">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <button className="relative bg-gradient-to-br from-[#ff3355] to-[#cc1133] text-white w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl shadow-primary/40 active:scale-95 transition-all duration-200 border-[6px] border-white dark:border-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
                <span className="material-symbols-outlined text-[56px] fill-1 leading-none drop-shadow-md">
                  map
                </span>
                <span className="text-xs font-black uppercase tracking-widest mt-1 drop-shadow-sm">
                  {t("nav.map")}
                </span>
              </button>
            </Link>
          )}
        </div>

        {/* Right Links */}
        <div className="flex gap-8">
          <Link
            to="/community"
            className={`flex flex-col items-center gap-2 group transition-colors ${
              isActive("/community")
                ? "text-primary pointer-events-none"
                : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 active:text-primary"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[48px] transition-transform ${
                isActive("/community")
                  ? "font-variation-settings-filled"
                  : "group-active:scale-110"
              }`}
            >
              groups
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider absolute -bottom-4 ${
                isActive("/community")
                  ? "text-primary opacity-100"
                  : "text-primary opacity-0 group-active:opacity-100 transition-opacity"
              }`}
            >
              {t("nav.community")}
            </span>
          </Link>
          <Link
            to="/settings"
            className={`flex flex-col items-center gap-2 group transition-colors ${
              isActive("/settings")
                ? "text-primary pointer-events-none"
                : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 active:text-primary"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[48px] transition-transform ${
                isActive("/settings")
                  ? "font-variation-settings-filled"
                  : "group-active:scale-110"
              }`}
            >
              settings
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider absolute -bottom-4 ${
                isActive("/settings")
                  ? "text-primary opacity-100"
                  : "text-primary opacity-0 group-active:opacity-100 transition-opacity"
              }`}
            >
              {t("nav.settings")}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
