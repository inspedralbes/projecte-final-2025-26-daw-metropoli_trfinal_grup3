import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  // Initialize dark mode from localStorage or system preference
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

  return (
    <div className="relative h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-display overflow-hidden select-none flex flex-col transition-colors duration-300">
      {/* Top Bar - Fixed */}
      <div className="w-full pt-12 px-5 pb-4 bg-gray-50 dark:bg-slate-950 z-20 transition-colors duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <img
              src="/logo/logo.png"
              alt="Circuit Logo"
              className="h-12 w-auto object-contain"
            />
          </div>
          <Link
            to="/profile"
            className="bg-white dark:bg-slate-900 p-2 rounded-full text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-800 active:bg-slate-100 dark:active:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl block">
              person
            </span>
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">
          Settings
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto pb-32 px-5 space-y-8">
        {/* App Settings Section */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            App Preferences
          </h3>
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            {/* Notifications Toggle */}
            <div className="w-full flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 last:border-0 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-lg">
                    notifications
                  </span>
                </div>
                <span className="text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors">
                  Push Notifications
                </span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${notifications ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${notifications ? "translate-x-[20px]" : "translate-x-0"}`}
                ></div>
              </button>
            </div>

            {/* Location Toggle */}
            <div className="w-full flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 last:border-0 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 text-green-500 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-lg">
                    location_on
                  </span>
                </div>
                <span className="text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors">
                  Location Services
                </span>
              </div>
              <button
                onClick={() => setLocation(!location)}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${location ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${location ? "translate-x-[20px]" : "translate-x-0"}`}
                ></div>
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <div className="w-full flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 last:border-0 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-500 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-lg">
                    dark_mode
                  </span>
                </div>
                <span className="text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors">
                  Dark Mode
                </span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${darkMode ? "translate-x-[20px]" : "translate-x-0"}`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Account
          </h3>
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-lg">
                    lock
                  </span>
                </div>
                <span className="text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors">
                  Privacy & Security
                </span>
              </div>
              <span className="material-symbols-outlined text-slate-300">
                chevron_right
              </span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-lg">
                    help
                  </span>
                </div>
                <span className="text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors">
                  Help & Support
                </span>
              </div>
              <span className="material-symbols-outlined text-slate-300">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-slate-400 mb-2">
            Circuit de Barcelona-Catalunya App
          </p>
          <p className="text-[10px] text-slate-300">
            Version 1.0.0 (Build 2026.05)
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Nav Bar Background */}
        <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 pt-2 pb-6 flex justify-between items-center relative shadow-[0_-5px_20px_rgba(0,0,0,0.05)] transition-colors duration-300">
          {/* Left Links */}
          <div className="flex gap-8">
            <Link
              to="/home"
              className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 active:text-primary group transition-colors"
            >
              <span className="material-symbols-outlined text-2xl group-active:scale-110 transition-transform">
                home
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-0 group-active:opacity-100 transition-opacity absolute -bottom-3 text-primary">
                Home
              </span>
            </Link>
            <Link
              to="/events"
              className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 active:text-primary group transition-colors"
            >
              <span className="material-symbols-outlined text-2xl group-active:scale-110 transition-transform">
                calendar_month
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-0 group-active:opacity-100 transition-opacity absolute -bottom-3 text-primary">
                Events
              </span>
            </Link>
          </div>

          {/* Central Map Button - Floats Above */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-12">
            <Link to="/" className="relative group block">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <button className="relative bg-gradient-to-br from-[#ff3355] to-[#cc1133] text-white w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-2xl shadow-primary/40 active:scale-95 transition-all duration-200 border-[6px] border-white dark:border-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
                <span className="material-symbols-outlined text-[32px] leading-none drop-shadow-md">
                  map
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest mt-0.5 drop-shadow-sm">
                  Map
                </span>
              </button>
            </Link>
          </div>

          {/* Right Links */}
          <div className="flex gap-8">
            <Link
              to="/community"
              className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 active:text-primary group transition-colors"
            >
              <span className="material-symbols-outlined text-2xl group-active:scale-110 transition-transform">
                groups
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-0 group-active:opacity-100 transition-opacity absolute -bottom-3 text-primary">
                Community
              </span>
            </Link>
            <Link
              to="/settings"
              className="flex flex-col items-center gap-1.5 text-primary group pointer-events-none"
            >
              <span className="material-symbols-outlined text-2xl group-active:scale-110 transition-transform font-variation-settings-filled">
                settings
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-primary absolute -bottom-3">
                Settings
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
