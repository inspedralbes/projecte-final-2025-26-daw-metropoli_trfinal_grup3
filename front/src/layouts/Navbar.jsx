import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const navItems = [
  { to: "/home", icon: "home", label: "Home" },
  { to: "/events", icon: "calendar_month", label: "Events" },
  { to: "/", icon: "map", label: "Map" },
  { to: "/community", icon: "groups", label: "Community" },
  { to: "/profile", icon: "person", label: "Profile" },
];

const Navbar = () => {
  const { pathname } = useLocation();

  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

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
      {/* ─── MOBILE: bottom bar ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-white/5 flex items-center justify-around px-2 pb-safe transition-colors duration-300"
        style={{ height: "64px" }}>
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition-all duration-200 relative ${
                active ? "text-primary" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
              )}
              <span
                className={`material-symbols-outlined text-[26px] leading-none transition-all duration-200 ${
                  active ? "font-variation-settings-filled scale-110" : ""
                }`}
              >
                {item.icon}
              </span>
              <span className={`text-[9px] font-bold uppercase tracking-wider transition-all duration-200 ${active ? "opacity-100" : "opacity-0"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ─── DESKTOP: left sidebar ─── */}
      <nav className="hidden md:flex fixed top-0 left-0 bottom-0 z-[100] w-16 flex-col items-center py-5 gap-2 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-r border-slate-200/80 dark:border-white/5 transition-colors duration-300">
        {/* Logo at top */}
        <Link to="/home" className="mb-4 flex items-center justify-center">
          <img
            src="/logo/logo1.png"
            alt="Logo"
            className="h-12 w-auto object-contain block dark:hidden"
          />
          <img
            src="/logo/logo.png"
            alt="Logo"
            className="h-12 w-auto object-contain hidden dark:block"
          />
        </Link>

        {/* Nav items */}
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              title={item.label}
              className={`relative flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 group ${
                active
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-white"
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] leading-none ${active ? "font-variation-settings-filled" : ""}`}>
                {item.icon}
              </span>
              {/* Tooltip on hover */}
              <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 dark:bg-white text-white dark:text-slate-800 text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Dark mode toggle at bottom */}
        <div className="mt-auto">
          <button
            onClick={toggleDark}
            title={darkMode ? "Light Mode" : "Dark Mode"}
            className="relative flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 group text-slate-400 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-yellow-500 dark:hover:text-yellow-300"
          >
            <span className="material-symbols-outlined text-[22px] leading-none transition-all duration-300">
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
            <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 dark:bg-white text-white dark:text-slate-800 text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
