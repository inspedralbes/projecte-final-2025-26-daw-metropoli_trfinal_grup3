import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../layouts/Navbar";

const Home = () => {
  const { t } = useTranslation();
  const storedUser = localStorage.getItem("usuario");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const getAvatarUrl = (fotoUrl) => {
    if (!fotoUrl) return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    if (fotoUrl.startsWith("http")) return fotoUrl;
    return `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${fotoUrl}`;
  };

  const categories = [
    { id: 1, name: "Bares", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=100&q=80", active: true },
    { id: 2, name: "Segona mà", image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=100&q=80", active: false },
    { id: 3, name: "Cafès", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&q=80", active: false },
    { id: 4, name: "Cultura", image: "https://images.unsplash.com/photo-1491153059943-412f4b00ca1a?w=100&q=80", active: false },
  ];

  const nearbyPlaces = [
    {
      id: 1,
      name: "El Born",
      location: "Barcelona",
      price: "15€",
      image: "https://images.unsplash.com/photo-1583997052301-0042b33fc598?w=800&q=80",
    },
    {
      id: 2,
      name: "Vintage Store",
      location: "Gràcia",
      price: "20€",
      image: "https://images.unsplash.com/photo-1594932224828-b4b059bdbf6f?w=800&q=80",
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#f0f4f9] dark:bg-slate-950 text-[#1a1a1a] dark:text-white font-display overflow-x-hidden pb-32 transition-colors duration-300">
      
      {/* Header Section */}
      <header className="pt-12 px-6 flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-[32px] leading-[1.1] font-medium tracking-tight">
            Descobreix la ciutat <br />
            <span className="italic font-normal">amb nosaltres!</span>
          </h1>
        </div>
        <div className="flex flex-col gap-3 items-end">
          <Link to="/profile" className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src={getAvatarUrl(user?.foto)} alt="Profile" className="w-full h-full object-cover" />
          </Link>
          <button className="w-10 h-10 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center bg-white/50 dark:bg-white/5 backdrop-blur-sm">
            <span className="material-symbols-outlined text-gray-600 dark:text-white text-xl">menu</span>
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <section className="mt-8 px-6">
        <div className="flex items-center gap-3 border-b border-gray-300 dark:border-white/20 pb-2">
          <span className="material-symbols-outlined text-gray-400">search</span>
          <input 
            type="text" 
            placeholder="On t'agradaria anar?" 
            className="bg-transparent border-none outline-none text-lg placeholder-gray-400 w-full p-0 focus:ring-0"
          />
        </div>
      </section>

      {/* Categories Horizontal Scroll */}
      <section className="mt-8 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-6 min-w-max">
          {categories.map((cat) => (
            <button 
              key={cat.id} 
              className={`flex items-center gap-3 py-1.5 pl-1.5 pr-5 rounded-full transition-all duration-300 border border-transparent shadow-sm ${
                cat.active 
                ? "bg-white text-black" 
                : "bg-[#1a1a1a] text-white dark:bg-white/10 dark:text-white"
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
          <h2 className="text-2xl font-medium tracking-tight">Llocs propers</h2>
          <button className="text-gray-400 text-sm font-medium">Veure-ho tot</button>
        </div>

        {/* Large Featured Card (Carousel/Single for now) */}
        <div className="relative w-full aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl group">
          <img 
            src={nearbyPlaces[0].image} 
            alt={nearbyPlaces[0].name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Card Content */}
          <div className="absolute inset-0 p-10 flex flex-col justify-between pointer-events-none">
            <div className="space-y-1">
              <p className="text-white/70 text-lg uppercase tracking-widest font-light">{nearbyPlaces[0].location}</p>
              <h3 className="text-white text-8xl font-medium tracking-tighter leading-none -ml-1">
                {nearbyPlaces[0].name}
              </h3>
            </div>

            <div className="flex justify-between items-end">
              <div className="space-y-0 text-white">
                <p className="text-white/60 text-sm font-medium">Preu des de</p>
                <p className="text-4xl font-light tracking-tight">{nearbyPlaces[0].price}</p>
              </div>

              <div className="flex gap-3 pointer-events-auto">
                <button className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white hover:bg-white/40 transition-all">
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <button className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white hover:bg-white/40 transition-all">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
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
