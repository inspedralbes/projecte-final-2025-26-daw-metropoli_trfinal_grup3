import { Link } from "react-router-dom";

const Profile = () => {
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
            to="/settings"
            className="bg-white dark:bg-slate-900 p-2 rounded-full text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-800 active:bg-slate-100 dark:active:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl block">
              settings
            </span>
          </Link>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto pb-32 px-5 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden mb-3 transition-colors">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">
            Alex Rodriguez
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">
            F1 Enthusiast & Gold Member
          </p>
        </div>

        {/* Stats / Quick Info */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
            <span className="text-lg font-bold text-primary">12</span>
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
              Races
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
            <span className="text-lg font-bold text-primary">5</span>
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
              Years
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
            <span className="text-lg font-bold text-primary">Gold</span>
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
              Level
            </span>
          </div>
        </div>

        {/* My Tickets Section */}
        <div>
          <div className="flex justify-between items-end mb-3">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white transition-colors">
              My Tickets
            </h3>
            <button className="text-primary text-sm font-semibold">
              History
            </button>
          </div>

          {/* Active Ticket Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black rounded-2xl p-5 text-white shadow-xl shadow-slate-300 dark:shadow-none relative overflow-hidden transition-colors">
            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-white/60 text-xs uppercase tracking-wider font-bold">
                    Event
                  </span>
                  <h4 className="text-xl font-bold">Spanish GP 2026</h4>
                </div>
                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                  <span className="material-symbols-outlined">qr_code_2</span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <span className="text-white/60 text-xs uppercase tracking-wider font-bold block mb-1">
                    Date
                  </span>
                  <span className="font-semibold">May 29 - 31</span>
                </div>
                <div className="text-right">
                  <span className="text-white/60 text-xs uppercase tracking-wider font-bold block mb-1">
                    Seat
                  </span>
                  <span className="font-semibold">Tribuna G, Row 4</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-lg">
                  person
                </span>
              </div>
              <span className="text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors">
                Personal Details
              </span>
            </div>
            <span className="material-symbols-outlined text-slate-300">
              chevron_right
            </span>
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 text-green-500 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-lg">
                  credit_card
                </span>
              </div>
              <span className="text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors">
                Payment Methods
              </span>
            </div>
            <span className="material-symbols-outlined text-slate-300">
              chevron_right
            </span>
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-500 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-lg">
                  notifications
                </span>
              </div>
              <span className="text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors">
                Notifications
              </span>
            </div>
            <span className="material-symbols-outlined text-slate-300">
              chevron_right
            </span>
          </button>
        </div>

        <button className="w-full py-4 text-red-500 font-semibold text-sm rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
          Log Out
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Nav Bar Background */}
        <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 pt-2 pb-6 flex justify-between items-center relative shadow-[0_-5px_20px_rgba(0,0,0,0.05)] transition-colors duration-300">
          {/* Left Links */}
          <div className="flex gap-8">
            <Link
              to="/home"
              className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 active:text-primary group transition-colors"
            >
              <span className="material-symbols-outlined text-2xl group-active:scale-110 transition-transform">
                home
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-0 group-active:opacity-100 transition-opacity absolute -bottom-3 text-primary">
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
              to="/profile"
              className="flex flex-col items-center gap-1.5 text-primary group pointer-events-none"
            >
              <span className="material-symbols-outlined text-2xl group-active:scale-110 transition-transform font-variation-settings-filled">
                person
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-primary absolute -bottom-3">
                Profile
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
