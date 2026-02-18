import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../layouts/Navbar";

const Home = () => {
  const { t } = useTranslation();
  // Countdown Timer Logic
  const calculateTimeLeft = () => {
    const raceDate = new Date("2026-05-31T15:00:00"); // Example date
    const now = new Date();
    const difference = raceDate - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute
    return () => clearTimeout(timer);
  });

  const discoverItems = [
    {
      id: 1,
      title: "Fan Zone Main Stage",
      subtitle: "Live DJ & Driver Interviews scheduled...",
      distance: "200m",
      image:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      title: "F1 Official Store",
      subtitle: "New 2026 Merchandise Available",
      distance: "450m",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="relative h-screen w-full bg-gray-50 dark:bg-[#12080a] text-slate-800 dark:text-white font-display overflow-hidden select-none flex flex-col transition-colors duration-300">
      {/* Top Bar */}
      <div className="w-full pt-12 px-5 pb-2 z-20 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-primary font-black italic text-2xl tracking-tighter">
            F1
          </span>
          <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/20 mx-1 transition-colors"></div>
          <span className="text-secondary dark:text-white font-bold tracking-[0.2em] text-xs transition-colors">
            BARCELONA
          </span>
        </div>
        <Link
          to="/profile"
          className="w-10 h-10 rounded-full border-2 border-primary p-0.5 overflow-hidden shadow-sm"
        >
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        </Link>
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto no-scrollbar pb-32 px-5 space-y-5">
        {/* Hero Card - Race Weekend */}
        <div className="w-full h-[380px] rounded-[32px] overflow-hidden relative shadow-xl shadow-slate-200 dark:shadow-black/50 group transition-all">
          <img
            src="https://media.formula1.com/image/upload/f_auto/q_auto/v1677245035/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Spain.jpg.transform/9col/image.jpg"
            alt="Race Weekend"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Live Badge */}
          <div className="absolute top-5 right-5 bg-primary px-3 py-1 rounded-full flex items-center gap-2 shadow-lg shadow-primary/40">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white">
              {t("home.liveNow")}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <p className="text-primary font-bold italic text-sm mb-1 uppercase tracking-wider">
              {t("home.spanishGP")}
            </p>
            <h1 className="text-4xl font-black italic leading-[0.9] mb-4 drop-shadow-lg">
              {t("home.raceWeekend")}
              <br />
            </h1>

            {/* Timer & Button Row */}
            <div className="bg-white/10 dark:bg-black/60 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/20 dark:border-white/10 shadow-lg transition-colors">
              <div className="flex gap-4 text-center">
                <div>
                  <span className="text-2xl font-bold block leading-none filter drop-shadow-md">
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] uppercase text-white/70 font-bold tracking-wider">
                    {t("home.days")}
                  </span>
                </div>
                <div className="text-white/40 font-light text-xl self-start">
                  :
                </div>
                <div>
                  <span className="text-2xl font-bold block leading-none filter drop-shadow-md">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] uppercase text-white/70 font-bold tracking-wider">
                    {t("home.hours")}
                  </span>
                </div>
                <div className="text-white/40 font-light text-xl self-start">
                  :
                </div>
                <div>
                  <span className="text-2xl font-bold block leading-none filter drop-shadow-md">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] uppercase text-white/70 font-bold tracking-wider">
                    {t("home.minutes")}
                  </span>
                </div>
              </div>

              <Link
                to="/events"
                className="bg-primary hover:bg-[#ff1e3c] text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/30 transition-colors"
              >
                {t("home.viewSchedule")}
              </Link>
            </div>
          </div>
        </div>

        {/* Grid Menu */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/"
            className="relative h-40 rounded-[24px] overflow-hidden group shadow-md hover:shadow-lg transition-all dark:shadow-none bg-white dark:bg-[#1e1e1e]"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                alt="Map Background"
                className="w-full h-full object-cover opacity-60 dark:opacity-40 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10"></div>
            </div>
            <div className="relative z-10 p-5 h-full flex flex-col justify-end">
              <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm text-primary rounded-xl flex items-center justify-center mb-auto border border-white/10 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined font-variation-settings-filled">
                  map
                </span>
              </div>
              <h3 className="text-lg font-bold italic text-white leading-tight drop-shadow-md">
                {t("home.liveMap")}
              </h3>
              <p className="text-xs text-white/70 mt-1 drop-shadow-sm">
                {t("home.gpsTrack")}
              </p>
            </div>
          </Link>

          <button className="relative h-40 rounded-[24px] overflow-hidden group shadow-md hover:shadow-lg transition-all dark:shadow-none text-left bg-white dark:bg-[#1e1e1e]">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"
                alt="Dining Background"
                className="w-full h-full object-cover opacity-60 dark:opacity-40 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10"></div>
            </div>
            <div className="relative z-10 p-5 h-full flex flex-col justify-end">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-xl flex items-center justify-center mb-auto border border-white/10 group-hover:bg-white group-hover:text-slate-800 transition-colors">
                <span className="material-symbols-outlined">restaurant</span>
              </div>
              <h3 className="text-lg font-bold italic text-white leading-tight drop-shadow-md">
                {t("home.dining")}
              </h3>
              <p className="text-xs text-white/70 mt-1 drop-shadow-sm">
                {t("home.orderFood")}
              </p>
            </div>
          </button>
        </div>

        {/* Fan Zone Banner */}
        <Link
          to="/community"
          className="block w-full relative h-[88px] rounded-[24px] overflow-hidden active:scale-[0.98] shadow-lg shadow-slate-200/50 dark:shadow-none transition-all group bg-white dark:bg-[#1e1e1e]"
        >
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800"
              alt="Fan Zone Background"
              className="w-full h-full object-cover opacity-50 dark:opacity-30 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between px-5 h-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                <span className="material-symbols-outlined text-white">
                  flag
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-white font-bold italic text-lg leading-none drop-shadow-md">
                    {t("home.fanZone")}
                  </h3>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                </div>
                <h3 className="text-white font-bold italic text-lg leading-none mb-1 drop-shadow-md">
                  {t("home.experience")}
                </h3>
                <p className="text-xs text-white/60 drop-shadow-sm">
                  {t("home.driverQA")}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-white/40 group-hover:text-white transition-colors">
              chevron_right
            </span>
          </div>
        </Link>

        {/* Discover Nearby Carousel */}
        <div>
          <div className="flex justify-between items-center mb-3 px-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-primary rounded-full"></div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/60 transition-colors">
                {t("home.discoverNearby")}
              </h3>
            </div>
            <button className="text-[10px] font-bold text-primary uppercase tracking-wider hover:text-slate-600 dark:hover:text-white transition-colors">
              {t("home.seeAll")}
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {discoverItems.map((item) => (
              <div
                key={item.id}
                className="min-w-[280px] h-[200px] bg-white dark:bg-[#1e1e1e] rounded-[24px] border border-slate-100 dark:border-white/5 relative overflow-hidden snap-start shadow-sm dark:shadow-none transition-colors group"
              >
                {/* Full background image with overlay */}
                <div className="absolute inset-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                </div>

                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20 shadow-sm z-10">
                  <span className="material-symbols-outlined text-white text-xs transform -rotate-45">
                    navigation
                  </span>
                  <span className="text-[10px] font-bold text-white tracking-wide">
                    {item.distance}
                  </span>
                </div>

                <div className="p-5 absolute bottom-0 w-full z-10">
                  <h4 className="text-xl font-bold italic text-white leading-tight drop-shadow-lg">
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/70 mt-1 truncate drop-shadow-md font-medium">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather / Track Stats Widget */}
        <div className="w-full bg-white dark:bg-[#12080a] border border-slate-100 dark:border-white/5 rounded-[28px] p-6 mb-8 flex justify-between items-center shadow-lg shadow-slate-200/50 dark:shadow-none transition-all">
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-slate-300 dark:text-white/30 mb-2 transition-colors">
              thermostat
            </span>
            <span className="text-lg font-bold text-slate-800 dark:text-white leading-none transition-colors">
              24°C
            </span>
            <span className="text-[9px] font-bold uppercase text-slate-400 dark:text-white/30 mt-1 tracking-wider transition-colors">
              {t("home.air")}
            </span>
          </div>
          <div className="w-[1px] h-8 bg-slate-100 dark:bg-white/10 transition-colors"></div>
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-slate-300 dark:text-white/30 mb-2 transition-colors">
              speed
            </span>
            <span className="text-lg font-bold text-slate-800 dark:text-white leading-none transition-colors">
              38°C
            </span>
            <span className="text-[9px] font-bold uppercase text-slate-400 dark:text-white/30 mt-1 tracking-wider transition-colors">
              {t("home.track")}
            </span>
          </div>
          <div className="w-[1px] h-8 bg-slate-100 dark:bg-white/10 transition-colors"></div>
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-slate-300 dark:text-white/30 mb-2 transition-colors">
              water_drop
            </span>
            <span className="text-lg font-bold text-slate-800 dark:text-white leading-none transition-colors">
              12%
            </span>
            <span className="text-[9px] font-bold uppercase text-slate-400 dark:text-white/30 mt-1 tracking-wider transition-colors">
              {t("home.rain")}
            </span>
          </div>
          <div className="w-[1px] h-8 bg-slate-100 dark:bg-white/10 transition-colors"></div>
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-slate-300 dark:text-white/30 mb-2 transition-colors">
              air
            </span>
            <span className="text-lg font-bold text-slate-800 dark:text-white leading-none transition-colors">
              5<span className="text-xs ml-0.5">km/h</span>
            </span>
            <span className="text-[9px] font-bold uppercase text-slate-400 dark:text-white/30 mt-1 tracking-wider transition-colors">
              {t("home.wind")}
            </span>
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Home;
