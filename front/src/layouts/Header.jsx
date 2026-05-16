import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserAvatar from "../components/UserAvatar";

const Header = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const storedUser = localStorage.getItem("usuario");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const getAvatarUrl = (fotoUrl) => {
    if (!fotoUrl) return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    if (fotoUrl.startsWith("http")) return fotoUrl;
    return `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${fotoUrl}`;
  };

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

  return (
    <div className={`${headerPosition} top-0 left-0 right-0 z-[1010] flex items-center justify-between px-5 pt-5 pb-3 pointer-events-none md:pl-24`}>
      {/* Left: Title */}
      <div className="pointer-events-auto">
        {title}
      </div>

      {/* Right: User Avatar */}
      <Link to="/profile" className="pointer-events-auto flex-shrink-0">
        <UserAvatar user={user} className="w-11 h-11" borderColor="border-primary" />
      </Link>
    </div>
  );
};

export default Header;
