import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../layouts/Navbar";
import Header from "../../layouts/Header";
import UserAvatar from "../../components/UserAvatar";
import Mapis from "../../JARVIS/Mapis";
import { 
  getCategorias, 
  getUsuarioListas, 
  getListas, 
  getUsuarioStats,
  unifiedSearch
} from "../../services/communicationManager";
import SearchResultsPanel from "../../components/SearchResultsPanel";

const Home = () => {
  const { t } = useTranslation();
  const storedUser = localStorage.getItem("usuario");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [categories, setCategories] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [friendCollections, setFriendCollections] = useState([]);
  const [userStats, setUserStats] = useState({ discovered: 0, completedRoutes: 0, kmWalked: 0 });
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ usuarios: [], listas: [], lugares: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Categories
        const catRes = await getCategorias();
        if (catRes.success) setCategories(catRes.data);

        // 2. Fetch User Lists (Les teves rutes)
        if (user && user.id_usuario) {
          const userListsRes = await getUsuarioListas(user.id_usuario);
          if (userListsRes.success) setNearbyPlaces(userListsRes.data);

          // 3. Fetch User Stats
          const statsRes = await getUsuarioStats(user.id_usuario);
          if (statsRes.success) {
            setUserStats({
              discovered: statsRes.data.discovered,
              completedRoutes: statsRes.data.completedRoutes,
              kmWalked: statsRes.data.kmWalked
            });
            setWeeklyActivity(statsRes.data.weeklyActivity);
          }
        }

        // 4. Fetch Public Lists (Dels teus amics)
        const publicListsRes = await getListas(user?.id_usuario);
        if (publicListsRes.success) {
          // Filtramos para no repetir las del usuario si es posible, o simplemente mostramos las públicas
          setFriendCollections(publicListsRes.data.filter(l => l.id_usuario !== user?.id_usuario));
        }

      } catch (err) {
        console.error("Error fetching home data:", err);
        setError("Error al cargar los datos. Por favor, inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [user?.id_usuario]);

  // Unified Search Logic (Debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        setIsSearchPanelOpen(true);
        try {
          const res = await unifiedSearch(searchQuery, activeCategory);
          if (res.success) {
            setSearchResults(res.data);
          }
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setIsSearchPanelOpen(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory]);

  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);

  const nextPlace = () => {
    if (nearbyPlaces.length === 0) return;
    setCurrentPlaceIndex((prev) => (prev + 1) % nearbyPlaces.length);
  };

  const prevPlace = () => {
    if (nearbyPlaces.length === 0) return;
    setCurrentPlaceIndex((prev) => (prev - 1 + nearbyPlaces.length) % nearbyPlaces.length);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f0f4f9] dark:bg-slate-950 text-[#1a1a1a] dark:text-white font-display overflow-x-hidden pb-32 transition-colors duration-300">
      
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="fixed top-24 left-6 right-6 z-40 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex justify-between items-center shadow-lg animate-in slide-in-from-top duration-300">
          <span className="font-medium">{error}</span>
          <button onClick={() => window.location.reload()} className="bg-red-700 text-white px-3 py-1 rounded-lg text-sm">Reintentar</button>
        </div>
      )}

      <Header />

      {/* Search Bar */}
      <section className="mt-8 px-6 pt-24 relative">
        <div className="flex items-center gap-3 border-b border-gray-300 dark:border-white/20 pb-2">
          <span className="material-symbols-outlined text-gray-400">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim().length >= 2 && setIsSearchPanelOpen(true)}
            placeholder={t("collections.search", "On t'agradaria anar?")}
            className="bg-transparent border-none outline-none text-lg placeholder-gray-400 w-full p-0 focus:ring-0 text-[#1a1a1a] dark:text-white"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="material-symbols-outlined text-gray-400 hover:text-black dark:hover:text-white transition-colors">close</button>
          )}
        </div>

        {/* Floating Search Results */}
        <SearchResultsPanel 
          isOpen={isSearchPanelOpen} 
          results={searchResults} 
          isLoading={isSearching} 
          query={searchQuery}
          onClose={() => setIsSearchPanelOpen(false)}
        />
      </section>

      {/* Categories Horizontal Scroll */}
      <section className="mt-8 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-6 min-w-max">
          {categories.length > 0 ? (
            categories.map((cat, idx) => (
              <button 
                key={cat.id_categoria || idx} 
                onClick={() => setActiveCategory(activeCategory === cat.id_categoria ? null : cat.id_categoria)}
                className={`flex items-center gap-3 py-1.5 pl-1.5 pr-5 rounded-full transition-all duration-300 border shadow-sm ${
                  activeCategory === cat.id_categoria 
                  ? "bg-black text-white dark:bg-white dark:text-black border-transparent" 
                  : "bg-white text-black border-gray-200 dark:bg-white/5 dark:text-white dark:border-white/10"
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                  <img src={cat.icono_url || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=100&q=80"} alt={cat.nombre} className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-bold tracking-tight uppercase">{cat.nombre}</span>
              </button>
            ))
          ) : (
            <p className="px-6 opacity-40 italic">Carregant categories...</p>
          )}
        </div>
      </section>

      {/* Nearby Destinations Section */}
      <section className="mt-10 px-6">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-medium tracking-tight">{t("nav.collections", "Les teves rutes")}</h2>
          {user && (
            <Link to="/profile" className="text-gray-400 dark:text-white/40 text-sm font-medium hover:text-black dark:hover:text-white transition-colors">{t("collections.viewAll", "Veure-ho tot")}</Link>
          )}
        </div>

        {/* Large Featured Card (Carousel/Single for now) */}
        <div className="relative w-full aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl group">
          {nearbyPlaces.length > 0 ? (
            <>
              <img 
                key={nearbyPlaces[currentPlaceIndex].id_lista}
                src={nearbyPlaces[currentPlaceIndex].imagen_url || "https://images.unsplash.com/photo-1583997052301-0042b33fc598?w=800&q=80"} 
                alt={nearbyPlaces[currentPlaceIndex].nombre} 
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 animate-in fade-in zoom-in duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Card Content */}
              <div className="absolute inset-0 p-10 flex flex-col justify-between pointer-events-none">
                <div className="space-y-1">
                  <p className="text-white/70 text-lg uppercase tracking-widest font-light">Barcelona</p>
                  <h3 className="text-white text-6xl font-medium tracking-tighter leading-none -ml-1">
                    {nearbyPlaces[currentPlaceIndex].nombre}
                  </h3>
                </div>

                <div className="flex justify-end items-end w-full">
                  <div className="flex gap-2 pointer-events-auto translate-x-1">
                    <button 
                      onClick={prevPlace}
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white hover:bg-white/40 transition-all"
                    >
                      <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </button>
                    <button 
                      onClick={nextPlace}
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white hover:bg-white/40 transition-all"
                    >
                      <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gray-200 dark:bg-white/5 flex items-center justify-center">
              <p className="opacity-40 italic">Encara no tens rutes pròpies</p>
            </div>
          )}
        </div>

        {/* Map Widget & Community Button */}
        <div className="mt-8 flex gap-4 h-[160px]">
          <Link 
            to="/" 
            className="flex-[2] relative rounded-[2.5rem] overflow-hidden shadow-xl group active:scale-95 transition-transform"
          >
            <img 
              src="/map_background.jpg" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-4xl text-white">map</span>
              <span className="text-lg font-medium tracking-tight text-white">{t("nav.map", "Mapa")}</span>
            </div>
          </Link>
          <Link 
            to="/community" 
            className="flex-1 bg-black text-white dark:bg-white dark:text-black rounded-[2.5rem] flex flex-col items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-3xl">groups</span>
            <span className="text-lg font-medium tracking-tight opacity-60">{t("nav.community", "Comunitat")}</span>
          </Link>
        </div>

        {/* Friend Collections Carousel */}
        <div className="mt-12">
          <h2 className="text-2xl font-medium tracking-tight mb-6">{t("home.groups", "Dels teus amics")}</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
            {friendCollections.length > 0 ? (
              friendCollections.map((col) => (
                <Link to={`/collections/${col.id_lista}`} key={col.id_lista} className="min-w-[320px] bg-white dark:bg-white/10 rounded-[2.5rem] p-6 border border-gray-100 dark:border-white/10 shadow-sm transition-colors duration-300 hover:scale-[1.02] transition-transform">
                  <div className="relative aspect-[16/10] rounded-[1.5rem] overflow-hidden mb-6">
                    <img src={col.imagen_url || "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=400&q=80"} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4">
                      <UserAvatar user={{ avatar: col.foto_perfil, nombre: col.nombre_usuario || "Usuari" }} className="w-10 h-10" />
                    </div>
                  </div>
                  <h3 className="font-medium text-lg tracking-tight truncate mb-2">{col.nombre}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium tracking-tight text-gray-400 dark:text-white/40">{col.nombre_usuario || "Amic"}</span>
                    <span className="text-lg font-medium tracking-tight bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full">{col.pois?.length || 0} {t("profile.points", "punts")}</span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="px-6 opacity-40 italic">No hi ha rutes públiques recents</p>
            )}
          </div>
        </div>

        {/* User Stats Section */}
        <div className="mt-12 bg-white dark:bg-slate-900 text-black dark:text-white rounded-[3rem] p-8 shadow-xl dark:shadow-2xl border border-gray-100 dark:border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gray-100 dark:bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <h2 className="text-2xl font-medium tracking-tight mb-1">{t("home.impact", "El teu impacte")}</h2>
              <p className="text-xs opacity-40 uppercase tracking-widest font-bold">{t("home.weeklyActivity", "Activitat setmanal")}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-medium tracking-tight">{userStats.kmWalked}</p>
              <p className="text-[10px] opacity-40 uppercase font-bold">{t("home.totalKm", "KM totals")}</p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between h-32 gap-3 mb-10 relative z-10">
            {weeklyActivity.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-3 group h-full">
                <div className="relative w-full flex flex-col justify-end h-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="w-full bg-black dark:bg-white rounded-full transition-all duration-[1500ms] ease-out"
                    style={{ height: `${day.value}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold opacity-40 uppercase">{day.day}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-gray-50 dark:bg-white/5 rounded-[2rem] p-4 flex items-center gap-4 border border-gray-100 dark:border-transparent">
              <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">location_on</span>
              </div>
              <div>
                <p className="text-xl font-medium tracking-tight">{userStats.discovered}</p>
                <p className="text-[9px] opacity-40 uppercase font-bold">{t("home.discovered", "Llocs descoberts")}</p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 rounded-[2rem] p-4 flex items-center gap-4 border border-gray-100 dark:border-transparent">
              <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">route</span>
              </div>
              <div>
                <p className="text-xl font-medium tracking-tight">{userStats.completedRoutes}</p>
                <p className="text-[9px] opacity-40 uppercase font-bold">{t("home.completedRoutes", "Rutes fetes")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom spacing for Navbar */}
      <div className="h-20"></div>

      <Navbar />

      {/* JARVIS Chatbot Mapis */}
      <Mapis />
    </div>
  );
};

export default Home;
