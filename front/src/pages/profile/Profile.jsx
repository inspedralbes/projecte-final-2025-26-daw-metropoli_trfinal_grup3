import { Link } from "react-router-dom";
import Navbar from "../../layouts/Navbar";

const Profile = () => {
  return (
    <div className="relative h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-display overflow-hidden select-none flex flex-col transition-colors duration-300 overscroll-none">
      {/* Top Bar - Fixed */}
      <div className="w-full pt-6 px-5 pb-4 bg-gray-50 dark:bg-slate-950 z-20 transition-colors duration-300 touch-none">
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

      <Navbar />
    </div>
  );
};

export default Profile;
