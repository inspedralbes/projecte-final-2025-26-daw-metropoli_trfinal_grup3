import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const navItems = [
  { to: "/home", icon: "home", labelKey: "home" },
  { to: "/", icon: "map", labelKey: "map" },
  { to: "/create-list", icon: "add_circle", labelKey: "createList" },
  { to: "/community", icon: "groups", labelKey: "community" },
  { to: "/colections", icon: "bookmarks", labelKey: "collections" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    // Default to dark if no preference is set
    return document.documentElement.classList.contains("dark") || true;
  });

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const isActive = (to) => {
    if (to === "/home") return pathname === "/home" || pathname === "/home/";
    if (to === "/") return pathname === "/";
    return pathname.startsWith(to);
  };

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/90 dark:bg-black/90 border-t border-gray-100 dark:border-none backdrop-blur-lg flex items-center justify-around px-2 pb-safe transition-colors duration-300"
        style={{ height: "76px" }}>
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-200 relative ${
                active 
                ? "text-black dark:text-white" 
                : "text-gray-400 dark:text-white/50 hover:text-black dark:hover:text-white"
              }`}
            >
              <span
                className="material-symbols-outlined text-[32px] leading-none transition-all duration-200"
                style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ─── DESKTOP: left sidebar ─── */}
      <nav className="hidden md:flex fixed top-0 left-0 bottom-0 z-[100] w-20 flex-col items-center py-5 gap-4 bg-white/95 dark:bg-black/95 border-r border-gray-100 dark:border-none backdrop-blur-2xl transition-colors duration-300">
        {/* Logo at top */}
        <Link to="/home" className="mb-4 flex items-center justify-center">
          <img
            src="/logo/logo.png"
            alt="Logo"
            className="h-10 w-auto object-contain dark:invert"
          />
        </Link>

        {/* Nav items */}
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              title={t(`nav.${item.labelKey}`)}
              className={`relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-200 group ${
                active 
                ? "text-black dark:text-white" 
                : "text-gray-400 dark:text-white/50 hover:text-black dark:hover:text-white"
              }`}
            >
              <span 
                className="material-symbols-outlined text-[30px] leading-none transition-all duration-200"
                style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
            </Link>
          );
        })}

        {/* Dark mode toggle at bottom */}
        <div className="mt-auto">
          <button
            onClick={toggleDark}
            title={darkMode ? t("nav.lightMode") : t("nav.darkMode")}
            className="relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-200 group text-gray-400 dark:text-white/50 hover:text-black dark:hover:text-white"
          >
            <span 
              className="material-symbols-outlined text-[30px] leading-none transition-all duration-300"
              style={darkMode ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
