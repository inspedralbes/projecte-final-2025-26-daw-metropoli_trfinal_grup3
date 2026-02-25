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
      <div className="w-full pt-6 px-5 pb-4 bg-gray-50 dark:bg-slate-950 z-20 transition-colors duration-300 touch-none md:max-w-6xl md:mx-auto">
        <div className="flex justify-between items-center mb-2">
          <div className="md:hidden flex items-center gap-2">
            <img
              src="/logo/logo1.png"
              alt="Circuit Logo"
              className="h-12 w-auto object-contain"
            />
          </div>
          <h1 className="hidden md:block text-2xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white">
            My <span className="text-primary">Profile</span>
          </h1>
          <Link
            to="/settings"
            className="bg-white dark:bg-slate-900 p-2 rounded-full text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl block">
              settings
            </span>
          </Link>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto no-scrollbar pb-24 md:pb-10 px-5 md:max-w-6xl md:mx-auto">
        {/* Desktop: 2-column layout */}
        <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-10 lg:items-start">
          {/* Left column — sticky on desktop */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-lg overflow-hidden mb-3">
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Alex Rodriguez
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                F1 Enthusiast & Gold Member
              </p>
              <Link
                to="/profile/edit"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-primary text-primary text-xs font-bold hover:bg-primary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-base">
                  edit
                </span>
                {t("profile.editProfile")}
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "friends", count: 48, label: t("profile.friends") },
                { key: "posts", count: 12, label: t("profile.posts") },
                {
                  key: "achievements",
                  count: 8,
                  label: t("profile.achievements"),
                },
              ].map(({ key, count, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`p-3 rounded-2xl border shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 ${activeTab === key ? "bg-primary border-primary text-white scale-105" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"}`}
                >
                  <span
                    className={`text-lg font-bold ${activeTab === key ? "text-white" : "text-primary"}`}
                  >
                    {count}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider ${activeTab === key ? "text-white/90" : "text-slate-400"}`}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>

            {/* Log Out — desktop only shows here in sidebar */}
            <button className="w-full py-4 text-red-500 font-semibold text-sm rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              Log Out
            </button>
          </div>

          {/* Right column — dynamic tab content */}
          <div className="mt-5 lg:mt-0 min-h-[200px] transition-all duration-300">
            {/* Tab header — desktop */}
            <div className="hidden lg:flex gap-2 mb-6">
              {[
                { key: "posts", label: t("profile.posts"), icon: "grid_view" },
                { key: "friends", label: t("profile.friends"), icon: "group" },
                {
                  key: "achievements",
                  label: t("profile.achievements"),
                  icon: "emoji_events",
                },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === key ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:border-primary/40"}`}
                >
                  <span className="material-symbols-outlined text-base">
                    {icon}
                  </span>
                  {label}
                </button>
              ))}
            </div>

            {/* Friends Tab */}
            {activeTab === "friends" && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 lg:hidden">
                  {t("profile.friendsList")}
                </h3>
                <div className="grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div
                      key={item}
                      className="flex flex-col items-center space-y-1"
                    >
                      <div className="w-14 h-14 rounded-full p-0.5 border-2 border-primary/30">
                        <img
                          src={`https://i.pravatar.cc/150?img=${item + 10}`}
                          alt="Friend"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate w-full text-center">
                        User {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 lg:hidden">
                  {t("profile.recentPosts")}
                </h3>
                <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0">
                  {[1, 2].map((post) => (
                    <div
                      key={post}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
                    >
                      <img
                        src={`https://images.unsplash.com/photo-${post === 1 ? "1568605117036-5fe5e7bab0b7" : "1492684223066-81342ee5ff30"}?auto=format&fit=crop&q=80&w=800`}
                        alt="Post"
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                          {post === 1
                            ? "Amazing day at the track! 🏎️💨"
                            : "Can't wait for the next season! 🏆"}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">
                              favorite
                            </span>
                            {post * 45}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">
                              chat_bubble
                            </span>
                            {post * 12}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === "achievements" && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 lg:hidden">
                  {t("profile.yourAchievements")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      icon: "emoji_events",
                      color: "text-yellow-500",
                      bg: "bg-yellow-500/10",
                      title: "Gold Member",
                      desc: "Member for 5+ years",
                    },
                    {
                      icon: "directions_car",
                      color: "text-blue-500",
                      bg: "bg-blue-500/10",
                      title: "Track Day Hero",
                      desc: "Attended 10+ races",
                    },
                    {
                      icon: "confirmation_number",
                      color: "text-purple-500",
                      bg: "bg-purple-500/10",
                      title: "Early Bird",
                      desc: "Booked 3 months in advance",
                    },
                    {
                      icon: "groups",
                      color: "text-emerald-500",
                      bg: "bg-emerald-500/10",
                      title: "Community Pillar",
                      desc: "100+ forum posts",
                    },
                  ].map((badge, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800"
                    >
                      <div
                        className={`w-12 h-12 rounded-full ${badge.bg} ${badge.color} flex items-center justify-center shrink-0`}
                      >
                        <span className="material-symbols-outlined text-2xl">
                          {badge.icon}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">
                          {badge.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {badge.desc}
                        </p>
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
