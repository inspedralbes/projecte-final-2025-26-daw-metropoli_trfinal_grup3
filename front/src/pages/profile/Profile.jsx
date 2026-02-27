import { useState, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "../../layouts/Navbar";
import { useFriends } from "../../context/FriendsContext";

// Lazy load del escáner (pesa bastante, solo se carga cuando se necesita)
const QrScanner = lazy(() => import("../../components/QrScanner"));

// ─── Vista Invitado ──────────────────────────────────────────────────────────
const GuestProfileView = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 md:pl-16">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl flex flex-col items-center text-center border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/10 to-transparent dark:from-primary/20 pointer-events-none"></div>

        <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6 relative z-10">
          <span className="material-symbols-outlined text-4xl text-primary font-variation-settings-filled">
            account_circle
          </span>
        </div>

        <h1 className="text-2xl font-black italic tracking-tight text-slate-800 dark:text-white mb-2 relative z-10">
          Unlock the Full <span className="text-primary">Experience</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 relative z-10">
          Inicia sesión o regístrate para acceder a todas las funcionalidades exclusivas del circuito.
        </p>

        <div className="flex flex-col gap-4 w-full mb-8 relative z-10">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-sm">
                qr_code_scanner
              </span>
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800 dark:text-white">Añade Amigos con QR</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Escanea códigos rápidamente en la pista.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-sm">
                emoji_events
              </span>
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800 dark:text-white">Consigue Logros</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Desbloquea medallas por tu asistencia.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-sm">
                chat_bubble
              </span>
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800 dark:text-white">Feed de la Comunidad</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Comenta y reacciona a los eventos.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full relative z-10">
          <Link
            to="/login"
            className="w-full py-3.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-[#ff1e3c] transition-colors shadow-lg shadow-primary/30 flex justify-center items-center"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/signup"
            className="w-full py-3.5 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-2 border-slate-200 dark:border-slate-700 flex justify-center items-center"
          >
            Registrarse
          </Link>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

// ─── Modal: Mi código QR ────────────────────────────────────────────────────
const MyQrModal = ({ user, onClose }) => {
  // El QR contiene un JSON con los datos del usuario
  // TODO: cuando haya login, usar el ID real del usuario autenticado
  const qrData = JSON.stringify({ userId: user.id_usuario || user.id, nombre: user.nombre });

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-6 md:pb-0">
      <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-800 dark:text-white text-lg">
            Mi código QR
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500 text-lg">
              close
            </span>
          </button>
        </div>
        <div className="flex flex-col items-center gap-4 p-6">
          <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-100">
            <QRCodeSVG
              value={qrData}
              size={200}
              level="H"
              includeMargin={false}
            />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-800 dark:text-white">
              {user.nombre}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Deja que otro usuario escanee este QR para añadirte como amigo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Modal: Escanear QR de amigo ─────────────────────────────────────────────
const ScanQrModal = ({ allUsers, onAdd, onClose }) => {
  const { addFriend, isFriend } = useFriends();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleResult = (decoded) => {
    try {
      const data = JSON.parse(decoded);
      const found = allUsers.find((u) => u.id === data.userId);
      if (!found) {
        setError("Usuario no encontrado");
        return;
      }
      setResult(found);
    } catch {
      setError("QR no válido");
    }
  };

  const handleAdd = () => {
    if (result) {
      addFriend(result.id);
      onAdd(result);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-6 md:pb-0">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-800 dark:text-white text-lg">
            Escanear QR
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500 text-lg">
              close
            </span>
          </button>
        </div>
        <div className="p-5">
          {result ? (
            // Confirmación tras escanear
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-primary/30">
                <img
                  src={result.avatar}
                  alt={result.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-800 dark:text-white text-lg">
                  {result.nombre}
                </p>
                <p className="text-xs text-slate-400">{result.badge}</p>
              </div>
              {isFriend(result.id) ? (
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                  Ya sois amigos
                </div>
              ) : (
                <button
                  onClick={handleAdd}
                  className="w-full py-3 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">
                    person_add
                  </span>
                  Añadir como amigo
                </button>
              )}
            </div>
          ) : error ? (
            // Error de escaneo
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="material-symbols-outlined text-4xl text-red-400">
                qr_code_scanner
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {error}
              </p>
              <button
                onClick={() => setError(null)}
                className="text-primary text-sm font-bold hover:underline"
              >
                Intentar de nuevo
              </button>
            </div>
          ) : (
            // Escáner activo
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
                  <span className="material-symbols-outlined animate-spin">
                    progress_activity
                  </span>
                  Cargando cámara...
                </div>
              }
            >
              <QrScanner onResult={handleResult} onError={setError} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Página de Perfil ─────────────────────────────────────────────────────────

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const storedUser = localStorage.getItem("usuario");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  
  // Utilidad para construir la URL del avatar
  const getAvatarUrl = (fotoUrl) => {
    if (!fotoUrl) return "https://i.pravatar.cc/150?img=12";
    if (fotoUrl.startsWith("http")) return fotoUrl;
    return `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${fotoUrl}`;
  };

  // Si no hay usuario real (Invitado), pintar GuestProfileView
  if (!currentUser) {
    return <GuestProfileView />;
  }

  const [activeTab, setActiveTab] = useState("posts");
  const [showMyQr, setShowMyQr] = useState(false);
  const [showScanQr, setShowScanQr] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);
  const { friends, allUsers, removeFriend } = useFriends();

  const handleFriendAdded = (user) => {
    setLastAdded(user);
    setTimeout(() => setLastAdded(null), 3000);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-display select-none transition-colors duration-300 md:pl-16">
      {/* Modales QR */}
      {showMyQr && (
        <MyQrModal
          user={currentUser}
          onClose={() => setShowMyQr(false)}
        />
      )}
      {showScanQr && (
        <ScanQrModal
          allUsers={allUsers}
          onAdd={handleFriendAdded}
          onClose={() => setShowScanQr(false)}
        />
      )}

      {/* Toast de amigo añadido */}
      {lastAdded && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold animate-fade-in">
          <span className="material-symbols-outlined text-base">
            check_circle
          </span>
          {lastAdded.nombre} añadido como amigo
        </div>
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
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 rounded-full text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[22px]">
              settings
            </span>
          </Link>
        </div>
      </div>

      {/* Contenido */}
      <div className="overflow-y-auto no-scrollbar pb-24 md:pb-10 px-5 md:max-w-6xl md:mx-auto">
        <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-10 lg:items-start">
          {/* Columna izquierda — sticky en desktop */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-lg overflow-hidden mb-3">
                <img
                  src={getAvatarUrl(currentUser.foto)}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                {currentUser.nombre}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                {currentUser.bio || "F1 Enthusiast & Gold Member"}
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

            {/* Stats */}
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
            <button 
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("usuario");
                navigate("/login");
              }}
              className="w-full py-4 text-red-500 font-semibold text-sm rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              Log Out
            </button>
          </div>

          {/* Columna derecha */}
          <div className="mt-5 lg:mt-0 min-h-[200px]">
            {/* Tab pills — solo desktop */}
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

            {/* ── Tab Amigos ── */}
            {activeTab === "friends" && (
              <div className="animate-fade-in space-y-4">
                {/* Cabecera con botones QR */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    {t("profile.friendsList")}
                    <span className="ml-2 text-sm font-normal text-slate-400">
                      ({friends.length})
                    </span>
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowMyQr(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:border-primary hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">
                        qr_code_2
                      </span>
                      Mi QR
                    </button>
                    <button
                      onClick={() => setShowScanQr(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                    >
                      <span className="material-symbols-outlined text-base">
                        qr_code_scanner
                      </span>
                      Escanear
                    </button>
                  </div>
                </div>

                {/* Lista de amigos */}
                {friends.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500 gap-3">
                    <span className="material-symbols-outlined text-5xl">
                      group_off
                    </span>
                    <p className="text-sm font-medium">
                      Aún no tienes amigos añadidos
                    </p>
                    <button
                      onClick={() => setShowScanQr(true)}
                      className="flex items-center gap-1.5 text-primary text-sm font-bold hover:underline"
                    >
                      <span className="material-symbols-outlined text-base">
                        qr_code_scanner
                      </span>
                      Escanear el QR de alguien
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                {/* Botón escanear al fondo */}
                <button
                  onClick={() => setShowScanQr(true)}
                  className="w-full mt-2 py-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-sm font-semibold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">
                    qr_code_scanner
                  </span>
                  Escanear QR de un amigo
                </button>
              </div>
            )}

            {/* ── Tab Posts ── */}
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

            {/* ── Tab Logros ── */}
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
