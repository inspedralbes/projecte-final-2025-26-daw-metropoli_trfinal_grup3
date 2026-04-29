import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
    if (pathname === "/" ) {
      // Map: WeMap in black for contrast over the map
      return (
        <span className="text-black font-display text-3xl font-semibold tracking-tight leading-none">
          wemap
        </span>
      );
    }
    if (pathname === "/home") {
      return (
        <span className="text-[#1a1a1a] dark:text-white font-display text-3xl font-semibold tracking-tight leading-none">
          wemap
        </span>
      );
    }
    if (pathname.startsWith("/community")) {
      return (
        <span className="text-[#1a1a1a] dark:text-white font-display text-3xl font-semibold tracking-tight leading-none">
          {t("community.communityFeed")}
        </span>
      );
    }
    if (pathname.startsWith("/colections")) {
      return (
        <span className="text-[#1a1a1a] dark:text-white font-display text-3xl font-semibold tracking-tight leading-none">
          {t("collections.title")}
        </span>
      );
    }
    return null;
  };

  const title = getTitle();

  // Don't render if no matching route
  if (!title) return null;

  return (
    <div className="absolute top-0 left-0 right-0 z-[60] flex items-center justify-between px-5 pt-10 pb-3 pointer-events-none md:pl-24">
      {/* Left: Title */}
      <div className="pointer-events-auto">
        {title}
      </div>

      {/* Right: User Avatar */}
      <Link to="/profile" className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0 pointer-events-auto">
        <img
          src={getAvatarUrl(user?.foto)}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </Link>
    </div>
  );
};

export default Header;
