import { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  // Example data for the feed
  const [events] = useState([
    {
      id: 1,
      title: "Spanish GP 2026",
      date: "May 29 - 31",
      image:
        "https://cdn.formula1.com/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/Spain.jpg.transform/9col/image.jpg",
    },
    {
      id: 2,
      title: "MotoGP Catalunya",
      date: "June 12 - 14",
      image: "https://photos.motogp.com/2024/05/22/descarga.jpg",
    },
    {
      id: 3,
      title: "24h de Catalunya",
      date: "July 04 - 05",
      image:
        "https://www.circuitcat.com/wp-content/uploads/2024/07/24h-Sim-Racing-2024-1.jpg",
    },
  ]);

  const [news] = useState([
    {
      id: 1,
      title: "New Grandstand Opened",
      category: "Circuit Update",
      time: "2h ago",
    },
    {
      id: 2,
      title: "Fan Zone Schedule",
      category: "Event Info",
      time: "5h ago",
    },
    { id: 3, title: "Traffic Advisory", category: "Traffic", time: "1d ago" },
  ]);

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

        {/* Search Bar */}
        <div className="w-full">
          <div className="bg-white dark:bg-slate-900 rounded-2xl flex items-center px-4 py-3.5 gap-3 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <span className="material-symbols-outlined text-primary text-xl">
              search
            </span>
            <input
              className="bg-transparent border-none outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 w-full text-sm font-medium focus:ring-0 p-0"
              placeholder="Search events, news..."
              type="text"
            />
            <button className="text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-xl">tune</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto pb-32 px-5 space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">
            Welcome back,
          </h2>
          <p className="text-slate-500 dark:text-slate-400 transition-colors">
            Ready for the race weekend?
          </p>
        </div>

        {/* Upcoming Events Carousel */}
        <div>
          <div className="flex justify-between items-end mb-3">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white transition-colors">
              Upcoming Events
            </h3>
            <Link to="/events" className="text-primary text-sm font-semibold">
              See All
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="min-w-[240px] h-40 rounded-2xl relative overflow-hidden shadow-md shrink-0 border dark:border-slate-800"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                  <h4 className="text-white font-bold text-lg leading-tight">
                    {event.title}
                  </h4>
                  <p className="text-white/80 text-xs">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest News */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3 transition-colors">
            Latest News
          </h3>
          <div className="space-y-3">
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-4 active:scale-[0.98] transition-transform"
              >
                <div className="bg-primary/10 p-3 rounded-xl">
                  <span className="material-symbols-outlined text-primary">
                    newspaper
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2 py-0.5 rounded-md self-start mb-1 block w-fit">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                  <h4 className="text-slate-700 dark:text-white font-bold text-sm leading-snug transition-colors">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
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
              className="flex flex-col items-center gap-1.5 text-primary group pointer-events-none"
            >
              <span className="material-symbols-outlined text-2xl group-active:scale-110 transition-transform font-variation-settings-filled">
                home
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-primary absolute -bottom-3">
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
              className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 active:text-primary group transition-colors"
            >
              <span className="material-symbols-outlined text-2xl group-active:scale-110 transition-transform">
                settings
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-0 group-active:opacity-100 transition-opacity absolute -bottom-3 text-primary">
                Settings
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
