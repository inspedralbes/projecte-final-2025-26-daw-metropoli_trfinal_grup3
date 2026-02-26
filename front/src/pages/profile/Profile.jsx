import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../layouts/Navbar";
import { useFriends } from "../../context/FriendsContext";

// ─── Modal de búsqueda de amigos ───────────────────────────────────────────────
const AddFriendModal = ({ onClose }) => {
  const { suggestions, addFriend } = useFriends();
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState([]);

  const results = suggestions.filter((u) =>
    u.nombre.toLowerCase().includes(query.toLowerCase()),
  );

  const handleAdd = (user) => {
    addFriend(user.id);
    setAdded((prev) => [...prev, user.id]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm px-4 pb-6 md:pb-0">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-800 dark:text-white text-lg">
            Añadir amigos
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-lg">
              close
            </span>
          </button>
        </div>

        {/* Buscador */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-2.5">
            <span className="material-symbols-outlined text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre..."
              className="bg-transparent flex-1 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Resultados */}
        <div className="overflow-y-auto max-h-72 px-5 pb-5 space-y-2 pt-2">
          {results.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
              No se encontraron usuarios
            </div>
          ) : (
            results.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.nombre}
                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">
                    {user.nombre}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {user.badge}
                  </p>
                </div>
                {added.includes(user.id) ? (
                  <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
                    <span className="material-symbols-outlined text-base">
                      check_circle
                    </span>
                    Añadido
                  </div>
                ) : (
                  <button
                    onClick={() => handleAdd(user)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">
                      person_add
                    </span>
                    Añadir
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Página de perfil ──────────────────────────────────────────────────────────
const Profile = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("posts");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const { friends, removeFriend } = useFriends();

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-display select-none transition-colors duration-300 md:pl-16">
      {/* Modal añadir amigos */}
      {showAddFriend && (
        <AddFriendModal onClose={() => setShowAddFriend(false)} />
      )}

      {/* Top Bar */}
      <div className="w-full pt-6 px-5 pb-4 bg-gray-50 dark:bg-slate-950 z-20 transition-colors duration-300 touch-none md:max-w-6xl md:mx-auto">
        <div className="flex justify-between items-center mb-2">
          <div className="md:hidden flex items-center gap-2">
            <img
              src="/logo/logo.png"
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
        <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-10 lg:items-start">
          {/* Left column — sticky en desktop */}
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
                {
                  key: "friends",
                  count: friends.length,
                  label: t("profile.friends"),
                },
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

            {/* Log Out */}
            <button className="w-full py-4 text-red-500 font-semibold text-sm rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              Log Out
            </button>
          </div>

          {/* Right column — contenido dinámico */}
          <div className="mt-5 lg:mt-0 min-h-[200px] transition-all duration-300">
            {/* Tab header — solo desktop */}
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

            {/* ── Friends Tab ── */}
            {activeTab === "friends" && (
              <div className="animate-fade-in space-y-4">
                {/* Cabecera con botón añadir */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    {t("profile.friendsList")}
                    <span className="ml-2 text-sm font-normal text-slate-400">
                      ({friends.length})
                    </span>
                  </h3>
                  <button
                    onClick={() => setShowAddFriend(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                  >
                    <span className="material-symbols-outlined text-base">
                      person_add
                    </span>
                    Añadir
                  </button>
                </div>

                {friends.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500 gap-3">
                    <span className="material-symbols-outlined text-5xl">
                      group_off
                    </span>
                    <p className="text-sm font-medium">
                      Aún no tienes amigos añadidos
                    </p>
                    <button
                      onClick={() => setShowAddFriend(true)}
                      className="text-primary text-sm font-bold hover:underline"
                    >
                      Buscar personas
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm group"
                      >
                        <img
                          src={friend.avatar}
                          alt={friend.nombre}
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">
                            {friend.nombre}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {friend.badge}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFriend(friend.id)}
                          className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full bg-red-50 dark:bg-red-900/20 text-red-400 flex items-center justify-center hover:bg-red-100 transition-all shrink-0"
                          title="Eliminar amigo"
                        >
                          <span className="material-symbols-outlined text-sm">
                            person_remove
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Botón añadir en mobile */}
                <button
                  onClick={() => setShowAddFriend(true)}
                  className="w-full mt-2 py-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-sm font-semibold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  Buscar más personas
                </button>
              </div>
            )}

            {/* ── Posts Tab ── */}
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

            {/* ── Achievements Tab ── */}
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
