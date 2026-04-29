import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../layouts/Navbar";
import Header from "../../layouts/Header";
import UserAvatar from "../../components/UserAvatar";

const Home = () => {
  const { t } = useTranslation();
  const storedUser = localStorage.getItem("usuario");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const categories = [
    { id: 1, name: "Bares", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=100&q=80", active: true },
    { id: 2, name: "Segona mà", image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=100&q=80", active: false },
    { id: 3, name: "Cafès", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&q=80", active: false },
    { id: 4, name: "Cultura", image: "https://images.unsplash.com/photo-1491153059943-412f4b00ca1a?w=100&q=80", active: false },
  ];

  const nearbyPlaces = [
    {
      id: 1,
      name: "Edson Stores",
      location: "Barcelona",
      price: "15€",
      image: "https://images.unsplash.com/photo-1583997052301-0042b33fc598?w=800&q=80",
    },
    {
      id: 2,
      name: "Moimoi Store",
      location: "Gràcia",
      price: "20€",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=800&q=80",
    },
    {
      id: 3,
      name: "Cafè de l'Opera",
      location: "Gòtic",
      price: "12€",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    },
    {
      id: 4,
      name: "Mercat Galvany",
      location: "Sarrià",
      price: "18€",
      image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=80",
    }
  ];

  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);

  const nextPlace = () => {
    setCurrentPlaceIndex((prev) => (prev + 1) % nearbyPlaces.length);
  };

  const prevPlace = () => {
    setCurrentPlaceIndex((prev) => (prev - 1 + nearbyPlaces.length) % nearbyPlaces.length);
  };

  const friendCollections = [
    { id: 1, user: "Anna", title: "Tapes per Gràcia", spots: 5, image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=400&q=80", avatar: "https://i.pravatar.cc/150?u=anna" },
    { id: 2, user: "Marc", title: "Cafès secrets", spots: 8, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80", avatar: "https://i.pravatar.cc/150?u=marc" },
    { id: 3, user: "Laia", title: "Urbex BCN", spots: 3, image: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=400&q=80", avatar: "https://i.pravatar.cc/150?u=laia" },
    { id: 4, user: "Pol", title: "Vistes de nit", spots: 12, image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400&q=80", avatar: "https://i.pravatar.cc/150?u=pol" },
  ];

  const userStats = {
    discovered: 24,
    completedRoutes: 7,
    kmWalked: 42
  };

  const weeklyActivity = [
    { day: "dl.", value: 45 },
    { day: "dt.", value: 60 },
    { day: "dc.", value: 85 },
    { day: "dj.", value: 40 },
    { day: "dv.", value: 95 },
    { day: "ds.", value: 70 },
    { day: "dg.", value: 30 },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#f0f4f9] dark:bg-slate-950 text-[#1a1a1a] dark:text-white font-display overflow-x-hidden pb-32 transition-colors duration-300">
      
      <Header />

      {/* Search Bar */}
      <section className="mt-8 px-6 pt-24">
        <div className="flex items-center gap-3 border-b border-gray-300 dark:border-white/20 pb-2">
          <span className="material-symbols-outlined text-gray-400">search</span>
          <input 
            type="text" 
            placeholder="On t'agradaria anar?" 
            className="bg-transparent border-none outline-none text-lg placeholder-gray-400 w-full p-0 focus:ring-0 text-[#1a1a1a] dark:text-white"
          />
        </div>
      </section>

      {/* Categories Horizontal Scroll */}
      <section className="mt-8 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-6 min-w-max">
          {categories.map((cat) => (
            <button 
              key={cat.id} 
              className={`flex items-center gap-3 py-1.5 pl-1.5 pr-5 rounded-full transition-all duration-300 border shadow-sm ${
                cat.active 
                ? "bg-black text-white dark:bg-white dark:text-black border-transparent" 
                : "bg-white text-black border-gray-200 dark:bg-white/5 dark:text-white dark:border-white/10"
              }`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-bold tracking-tight uppercase">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Nearby Destinations Section */}
      <section className="mt-10 px-6">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-medium tracking-tight">Les teves rutes</h2>
          {user && (
            <Link to="/profile" className="text-gray-400 dark:text-white/40 text-sm font-medium hover:text-black dark:hover:text-white transition-colors">Veure-ho tot</Link>
          )}
        </div>

        {/* Large Featured Card (Carousel/Single for now) */}
        <div className="relative w-full aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl group">
          <img 
            key={nearbyPlaces[currentPlaceIndex].id}
            src={nearbyPlaces[currentPlaceIndex].image} 
            alt={nearbyPlaces[currentPlaceIndex].name} 
            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 animate-in fade-in zoom-in duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Card Content */}
          <div className="absolute inset-0 p-10 flex flex-col justify-between pointer-events-none">
            <div className="space-y-1">
              <p className="text-white/70 text-lg uppercase tracking-widest font-light">{nearbyPlaces[currentPlaceIndex].location}</p>
              <h3 className="text-white text-6xl font-medium tracking-tighter leading-none -ml-1">
                {nearbyPlaces[currentPlaceIndex].name}
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
              <span className="text-lg font-medium tracking-tight text-white">Mapa</span>
            </div>
          </Link>
          <Link 
            to="/community" 
            className="flex-1 bg-black text-white dark:bg-white dark:text-black rounded-[2.5rem] flex flex-col items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-3xl">groups</span>
            <span className="text-lg font-medium tracking-tight opacity-60">Comunitat</span>
          </Link>
        </div>

        {/* Friend Collections Carousel */}
        <div className="mt-12">
          <h2 className="text-2xl font-medium tracking-tight mb-6">Dels teus amics</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
            {friendCollections.map((col) => (
              <div key={col.id} className="min-w-[320px] bg-white dark:bg-white/10 rounded-[2.5rem] p-6 border border-gray-100 dark:border-white/10 shadow-sm transition-colors duration-300">
                <div className="relative aspect-[16/10] rounded-[1.5rem] overflow-hidden mb-6">
                  <img src={col.image} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <UserAvatar user={{ avatar: col.avatar, nombre: col.user }} className="w-10 h-10" />
                  </div>
                </div>
                <h3 className="font-medium text-lg tracking-tight truncate mb-2">{col.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium tracking-tight text-gray-400 dark:text-white/40">{col.user}</span>
                  <span className="text-lg font-medium tracking-tight bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full">{col.spots} punts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Stats Section */}
        <div className="mt-12 bg-white dark:bg-slate-900 text-black dark:text-white rounded-[3rem] p-8 shadow-xl dark:shadow-2xl border border-gray-100 dark:border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gray-100 dark:bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <h2 className="text-2xl font-medium tracking-tight mb-1">El teu impacte</h2>
              <p className="text-xs opacity-40 uppercase tracking-widest font-bold">Activitat setmanal</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-medium tracking-tight">{userStats.kmWalked}</p>
              <p className="text-[10px] opacity-40 uppercase font-bold">KM totals</p>
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
                <p className="text-[9px] opacity-40 uppercase font-bold">Llocs descoberts</p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 rounded-[2rem] p-4 flex items-center gap-4 border border-gray-100 dark:border-transparent">
              <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">route</span>
              </div>
              <div>
                <p className="text-xl font-medium tracking-tight">{userStats.completedRoutes}</p>
                <p className="text-[9px] opacity-40 uppercase font-bold">Rutes fetes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom spacing for Navbar */}
      <div className="h-20"></div>

      <Navbar />
    </div>
  );
};

export default Home;
