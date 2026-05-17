import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserAvatar from "../components/UserAvatar";
import { useSearch } from "../context/SearchContext";

/** Routes where the desktop unified search bar is shown */
const SEARCH_ROUTES = ["/home", "/community", "/collections", "/colections"];

const Header = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { searchQuery, setSearchQuery, clearSearch } = useSearch();
  const inputRef = useRef(null);

  const storedUser = localStorage.getItem("usuario");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Clear search whenever route changes
  useEffect(() => {
    clearSearch();
  }, [pathname, clearSearch]);

  // Determine title and color based on current route
  const getTitle = () => {
    if (pathname === "/" || pathname === "/map") {
      return (
        <span className="text-primary font-display text-3xl font-semibold tracking-tight leading-none transition-colors drop-shadow-md">
          wemap
        </span>
      );
    }
    if (pathname === "/home") {
      return (
        <span className="text-primary font-display text-3xl font-semibold tracking-tight leading-none transition-colors drop-shadow-sm">
          wemap
        </span>
      );
    }
    if (pathname.startsWith("/community")) {
      return (
        <span className="text-primary font-display text-3xl font-semibold tracking-tight leading-none drop-shadow-sm">
          {t("nav.community")}
        </span>
      );
    }
    if (pathname.startsWith("/collections") || pathname.startsWith("/colections")) {
      return (
        <span className="text-primary font-display text-3xl font-semibold tracking-tight leading-none drop-shadow-sm">
          {t("nav.collections")}
        </span>
      );
    }
    return null;
  };

  const title = getTitle();

  // Don't render if no matching route
  if (!title) return null;

  const isMapRoute = pathname === "/" || pathname === "/map";
  const headerPosition = isMapRoute ? "absolute" : "relative md:absolute";

  // Show search bar only on desktop and on supported routes
  const showSearchBar = !isMapRoute && SEARCH_ROUTES.some((r) => pathname.startsWith(r));

  // Placeholder text per view
  const getPlaceholder = () => {
    if (pathname.startsWith("/community")) return t("community.searchPlaceholder", "Busca amics o llistes...");
    if (pathname.startsWith("/collections") || pathname.startsWith("/colections")) return t("collections.search", "Cerca rutes...");
    return t("home.searchPlaceholder", "On t'agradaria anar?");
  };

  return (
    <div className={`${headerPosition} top-0 left-0 right-0 z-[1010] flex items-center justify-between px-5 pt-5 pb-3 pointer-events-none md:pl-24`}>
      {/* Left: Title */}
      <div className="pointer-events-auto flex-shrink-0">
        {title}
      </div>

      {/* Center: Desktop Unified Search Bar */}
      {showSearchBar && (
        <div className="hidden md:flex flex-1 ml-4 mr-16 max-w-sm pointer-events-auto">
          <div className="relative w-full group">
            {/* Magnifying glass SVG icon */}
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-slate-500 group-focus-within:text-primary transition-colors pointer-events-none z-10"
              fill="currentColor"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl py-2.5 pl-11 pr-10 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all shadow-sm font-display text-slate-800 dark:text-white placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors text-[18px]"
              >
                close
              </button>
            )}
          </div>
        </div>
      )}

      {/* Right: User Avatar */}
      <Link to="/profile" className="pointer-events-auto flex-shrink-0">
        <UserAvatar user={user} className="w-11 h-11" borderColor="border-primary" />
      </Link>
    </div>
  );
};

export default Header;
