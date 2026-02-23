import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../layouts/Navbar";

const Profile = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-display select-none transition-colors duration-300 md:pl-16">
      {/* Top Bar */}
      <div className="w-full pt-6 px-5 pb-4 bg-gray-50 dark:bg-slate-950 z-20 transition-colors duration-300 touch-none md:max-w-4xl md:mx-auto">
        <div className="flex justify-between items-center mb-2">
          <div className="md:hidden flex items-center gap-2">
            <img src="/logo/logo.png" alt="Circuit Logo" className="h-12 w-auto object-contain" />
          </div>
          <h1 className="hidden md:block text-2xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white">
            My <span className="text-primary">Profile</span>
          </h1>
          <Link
            to="/settings"
            className="bg-white dark:bg-slate-900 p-2 rounded-full text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl block">settings</span>
          </Link>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto no-scrollbar pb-24 md:pb-10 px-5 space-y-6 md:max-w-4xl md:mx-auto">

        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8 lg:items-start">

          {/* Left: Profile Header + Stats */}
          <div className="flex flex-col gap-5">
            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-lg overflow-hidden mb-3">
                <img src="https://i.pravatar.cc/150?img=12" alt="User Profile" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Alex Rodriguez</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">F1 Enthusiast & Gold Member</p>
              <Link to="/profile/edit" className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-primary text-primary text-xs font-bold hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-base">edit</span>
                {t("profile.editProfile")}
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "friends", count: 48, label: t("profile.friends") },
                { key: "posts", count: 12, label: t("profile.posts") },
                { key: "achievements", count: 8, label: t("profile.achievements") },
              ].map(({ key, count, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`p-3 rounded-2xl border shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 ${activeTab === key ? "bg-primary border-primary text-white scale-105" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"}`}
                >
                  <span className={`text-lg font-bold ${activeTab === key ? "text-white" : "text-primary"}`}>{count}</span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${activeTab === key ? "text-white/90" : "text-slate-400"}`}>{label}</span>
                </button>
              ))}
            </div>

            {/* Ticket Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black rounded-2xl p-5 text-white shadow-xl shadow-slate-300 dark:shadow-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-white/60 text-xs uppercase tracking-wider font-bold">Event</span>
                    <h4 className="text-xl font-bold">Spanish GP 2026</h4>
                  </div>
                  <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                    <span className="material-symbols-outlined">qr_code_2</span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-white/60 text-xs uppercase tracking-wider font-bold block mb-1">Date</span>
                    <span className="font-semibold">May 29 – 31</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white/60 text-xs uppercase tracking-wider font-bold block mb-1">Seat</span>
                    <span className="font-semibold">Tribuna G, Row 4</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Options */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              {[
                { icon: "person", label: "Personal Details", color: "bg-blue-50 dark:bg-blue-900/30 text-blue-500" },
                { icon: "credit_card", label: "Payment Methods", color: "bg-green-50 dark:bg-green-900/30 text-green-500" },
                { icon: "notifications", label: "Notifications", color: "bg-purple-50 dark:bg-purple-900/30 text-purple-500" },
              ].map(({ icon, label, color }) => (
                <button key={icon} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-lg">{icon}</span>
                    </div>
                    <span className="text-slate-700 dark:text-slate-200 font-semibold text-sm">{label}</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                </button>
              ))}
            </div>

            <button className="w-full py-4 text-red-500 font-semibold text-sm rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              Log Out
            </button>
          </div>

          {/* Right: Dynamic Tab Content */}
          <div className="min-h-[200px] transition-all duration-300">
            {activeTab === "friends" && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{t("profile.friendsList")}</h3>
                <div className="grid grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div key={item} className="flex flex-col items-center space-y-1">
                      <div className="w-14 h-14 rounded-full p-0.5 border-2 border-primary/30">
                        <img src={`https://i.pravatar.cc/150?img=${item + 10}`} alt="Friend" className="w-full h-full rounded-full object-cover" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate w-full text-center">User {item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "posts" && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{t("profile.recentPosts")}</h3>
                {[1, 2].map((post) => (
                  <div key={post} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-${post === 1 ? "1568605117036-5fe5e7bab0b7" : "1492684223066-81342ee5ff30"}?auto=format&fit=crop&q=80&w=800`} alt="Post" className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                        {post === 1 ? "Amazing day at the track! 🏎️💨" : "Can't wait for the next season! 🏆"}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">favorite</span>{post * 45}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">chat_bubble</span>{post * 12}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "achievements" && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{t("profile.yourAchievements")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: "emoji_events", color: "text-yellow-500", bg: "bg-yellow-500/10", title: "Gold Member", desc: "Member for 5+ years" },
                    { icon: "directions_car", color: "text-blue-500", bg: "bg-blue-500/10", title: "Track Day Hero", desc: "Attended 10+ races" },
                    { icon: "confirmation_number", color: "text-purple-500", bg: "bg-purple-500/10", title: "Early Bird", desc: "Booked 3 months in advance" },
                    { icon: "groups", color: "text-emerald-500", bg: "bg-emerald-500/10", title: "Community Pillar", desc: "100+ forum posts" },
                  ].map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className={`w-12 h-12 rounded-full ${badge.bg} ${badge.color} flex items-center justify-center shrink-0`}>
                        <span className="material-symbols-outlined text-2xl">{badge.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">{badge.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{badge.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Profile;
