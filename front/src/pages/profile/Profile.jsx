import { useState, useEffect, lazy, Suspense, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "../../layouts/Navbar";
import { useFriends } from "../../context/FriendsContext";
import {
  getPublicaciones,
  getUsuario,
  followUsuario,
  unfollowUsuario,
  checkIsFollowing,
  getSeguidoresCounts,
  getSeguidores,
  getSiguiendo,
  getUsuarioListas,
  deleteLista,
} from "../../services/communicationManager";
import UserAvatar from "../../components/UserAvatar";

// Lazy load del escáner (pesa bastante, solo se carga cuando se necesita)
const QrScanner = lazy(() => import("../../components/QrScanner"));

// ─── Vista Invitado ──────────────────────────────────────────────────────────
const GuestProfileView = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen w-full bg-[#f0f4f9] dark:bg-slate-950 flex flex-col items-center justify-center p-6 md:pl-16 transition-colors duration-300 font-display">
      {/* Top Bar / Header Mimic */}
      <div className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-5 pt-10 pb-3 md:pl-24">
        <Link
          to="/"
          className="w-11 h-11 flex items-center justify-center bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-full text-slate-700 dark:text-white shadow-sm border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[24px]">home</span>
        </Link>

        <Link
          to="/settings"
          className="w-11 h-11 flex items-center justify-center bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-full text-slate-700 dark:text-white shadow-sm border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[24px]">
            settings
          </span>
        </Link>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
        {/* Large Location Icon */}
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-primary/20 relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
          <span className="material-symbols-outlined text-7xl text-primary font-variation-settings-filled relative z-10">
            location_on
          </span>
        </div>

        <h1 className="text-7xl font-medium tracking-tighter leading-none mb-4 text-slate-900 dark:text-white">
          wemap
        </h1>

        <p className="text-slate-500 dark:text-white/50 text-xl font-medium leading-tight mb-14 max-w-[280px]">
          {t("auth.tagline", "take yourself to places you've never been")}
        </p>

        <div className="flex flex-col gap-4 w-full max-w-[260px]">
          <Link
            to="/login"
            className="w-full py-5 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-lg hover:opacity-90 transition-all shadow-xl active:scale-95 flex justify-center items-center"
          >
            {t("auth.login", "Iniciar Sesión")}
          </Link>
          <Link
            to="/signup"
            className="w-full py-5 rounded-full bg-transparent text-black dark:text-white font-bold text-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all border-2 border-black/10 dark:border-white/10 flex justify-center items-center active:scale-95"
          >
            {t("auth.signup", "Registrarse")}
          </Link>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

// ─── Modal: Mi código QR ────────────────────────────────────────────────────
const MyQrModal = ({ user, onClose }) => {
  // El QR contiene la URL al perfil del usuario
  const qrData = `${window.location.origin}/profile/${user.id_usuario || user.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-6 md:pb-0">
      <div className="w-full max-w-xs bg-white dark:bg-[#12080a] rounded-[28px] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-800 dark:text-white text-lg">
            {t("profile.qr.myTitle", "Mi código QR")}
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
              {t(
                "profile.qr.myDesc",
                "Deja que otro usuario escanee este QR para añadirte como amigo",
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Modal: Escanear QR para seguir usuario ──────────────────────────────────
const ScanQrModal = ({ allUsers, onFollowed, onClose }) => {
  const { t } = useTranslation();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleResult = (decoded) => {
    try {
      let targetId;

      if (decoded.includes("/profile/")) {
        targetId = decoded.split("/profile/").pop();
      } else {
        try {
          const data = JSON.parse(decoded);
          targetId = data.userId || data.id_usuario || data.id;
        } catch (e) {
          targetId = decoded;
        }
      }

      if (!targetId || targetId === "undefined")
        throw new Error("Invalid QR data");

      const found = allUsers.find((u) => (u.id_usuario || u.id) == targetId);
      if (!found) {
        setError("Usuario no encontrado en wemap");
        setScanning(false);
        return;
      }

      setResult(found);
      setScanning(false);
    } catch (err) {
      console.error("Scan error:", err);
      setError("Código QR no válido para Metrópoli");
      setScanning(false);
    }
  };

  const handleFollow = async () => {
    if (!result || loading) return;
    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem("usuario") || "null");
      if (!currentUser) {
        setError(
          t("auth.errorLogin", "Debes iniciar sesión para seguir a alguien"),
        );
        return;
      }
      const myId = currentUser.id_usuario || currentUser.id;
      const targetId = result.id_usuario || result.id;

      if (myId == targetId) {
        setError(t("profile.qr.errorSelf", "No puedes seguirte a ti mismo"));
        return;
      }

      const { followUsuario } =
        await import("../../services/communicationManager");
      await followUsuario(myId, targetId);
      onFollowed(result);
      onClose();
    } catch (e) {
      console.error("Follow error:", e);
      setError(t("profile.qr.errorFollow", "No se pudo seguir al usuario"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#12080a] rounded-[32px] shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        <div className="flex items-center justify-between px-6 pt-8 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
              {result
                ? t("profile.qr.userFound", "Usuario Encontrado")
                : t("profile.qr.scanTitle", "Escanear para Seguir")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {result
                ? t(
                    "profile.qr.confirm",
                    "Confirma que quieres seguir a esta persona",
                  )
                : t("profile.qr.point", "Apunta con la cámara al código QR")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all transform hover:rotate-90"
          >
            <span className="material-symbols-outlined text-slate-500">
              close
            </span>
          </button>
        </div>

        <div className="p-6">
          {scanning ? (
            <div className="relative group">
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                    <span className="material-symbols-outlined animate-spin text-3xl">
                      progress_activity
                    </span>
                    <p className="text-sm font-medium">
                      {t("profile.qr.starting", "Iniciando cámara...")}
                    </p>
                  </div>
                }
              >
                <QrScanner
                  onResult={handleResult}
                  onError={(err) => {
                    setError(err);
                    setScanning(false);
                  }}
                />
              </Suspense>

              {/* Indicador de "Buscando..." */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                  {t("profile.qr.searching", "Buscando QR...")}
                </span>
              </div>
            </div>
          ) : result ? (
            /* Vista de Éxito / Confirmación */
            <div className="flex flex-col items-center py-4 animate-in fade-in zoom-in duration-300">
              <div className="w-24 h-24 rounded-full mb-4 relative">
                <UserAvatar
                  user={result}
                  className="w-full h-full"
                  size={200}
                />
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
                  <span className="material-symbols-outlined text-primary-text text-sm font-bold">
                    person_add
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
                {result.nombre}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center px-6 mb-8">
                {result.bio || "City Explorer"}
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setScanning(true);
                    setResult(null);
                    setError(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {t("common.retry", "Reintentar")}
                </button>
                <button
                  onClick={handleFollow}
                  disabled={loading}
                  className="flex-[2] py-3 px-4 rounded-2xl bg-primary text-primary-text font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all transform active:scale-95 disabled:opacity-60"
                >
                  {loading
                    ? t("community.following", "Siguiendo...")
                    : t("community.follow", "Seguir")}
                </button>
              </div>
            </div>
          ) : (
            /* Vista de Error */
            <div className="flex flex-col items-center py-8 text-center animate-in fade-in slide-in-from-bottom-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-red-500 text-3xl">
                  error
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 underline decoration-red-500 decoration-2 underline-offset-4">
                {t("profile.qr.error", "Error al escanear")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-[200px]">
                {error ||
                  t(
                    "profile.qr.invalid",
                    "No se ha podido detectar un código válido.",
                  )}
              </p>
              <button
                onClick={() => {
                  setScanning(true);
                  setError(null);
                }}
                className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">
                  refresh
                </span>
                {t("common.retry", "Intentar de nuevo")}
              </button>
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-medium">
            wemap Connectivity • City Routes
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Página de Perfil ─────────────────────────────────────────────────────────

const Profile = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem("usuario");
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  const [targetUser, setTargetUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(!!id && id !== "undefined");

  const isOwnProfile =
    !id ||
    id === "undefined" ||
    (currentUser && (id == currentUser.id || id == currentUser.id_usuario));
  const displayedUser = isOwnProfile ? currentUser : targetUser;
  const displayedUserId = displayedUser?.id_usuario || displayedUser?.id;

  // Utilidad para construir la URL de las fotos de posts (no avatares)
  const getFullPostImageUrl = (fotoUrl) => {
    if (!fotoUrl) return null;
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
  const { friends, allUsers, removeFriend, addFriend, isFriend } = useFriends();

  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [socialTab, setSocialTab] = useState("followers");
  const [userRoutes, setUserRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);

  useEffect(() => {
    if (!id || id === "undefined" || isOwnProfile) {
      setTargetUser(null);
      setLoadingUser(false);
      return;
    }

    const fetchTargetUser = async () => {
      try {
        setLoadingUser(true);
        const res = await getUsuario(id);
        // La API devuelve { success: true, data: {...} }, extraemos solo el usuario
        if (res && res.data) {
          setTargetUser(res.data);
        } else if (res && res.id_usuario) {
          // Por si la API devuelve el usuario directamente
          setTargetUser(res);
        }
      } catch (err) {
        console.error("Error fetching target user:", err);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchTargetUser();
  }, [id, isOwnProfile]);

  useEffect(() => {
    if (!displayedUserId) return;
    const fetchUserPosts = async () => {
      try {
        setLoadingPosts(true);
        const response = await getPublicaciones();
        if (response.success && response.data) {
          const myPosts = response.data.filter(
            (post) => Number(post.id_usuario) === Number(displayedUserId),
          );
          // Sort by newest first
          myPosts.sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en));
          setUserPosts(myPosts);
        }
      } catch (err) {
        console.error("Error fetching user posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchUserPosts();
  }, [displayedUserId]);

  useEffect(() => {
    if (!displayedUserId) return;
    const fetchUserRoutes = async () => {
      try {
        setLoadingRoutes(true);
        const response = await getUsuarioListas(displayedUserId);
        if (response.success && response.data) {
          setUserRoutes(response.data);
        }
      } catch (err) {
        console.error("Error fetching user routes:", err);
      } finally {
        setLoadingRoutes(false);
      }
    };
    fetchUserRoutes();
  }, [displayedUserId]);

  const handleFollowedViaQr = (user) => {
    setLastAdded(user);
    setFollowersCount((c) => c + 1);
    setTimeout(() => setLastAdded(null), 3000);
  };

  // Cargar contadores, listas y estado isFollowing
  useEffect(() => {
    if (!displayedUserId) return;
    getSeguidoresCounts(displayedUserId).then((res) => {
      if (res?.data) {
        setFollowersCount(res.data.followers);
        setFollowingCount(res.data.following);
      }
    });
    getSeguidores(displayedUserId).then((res) => {
      if (res?.data) setFollowersList(res.data);
    });
    getSiguiendo(displayedUserId).then((res) => {
      if (res?.data) setFollowingList(res.data);
    });
    if (!isOwnProfile && currentUser) {
      checkIsFollowing(
        currentUser.id_usuario || currentUser.id,
        displayedUserId,
      ).then((res) => {
        setIsFollowing(res?.isFollowing ?? false);
      });
    }
  }, [displayedUserId, isOwnProfile, currentUser]);

  useEffect(() => {
    if (!displayedUserId) return;
    const fetchUserRoutes = async () => {
      try {
        setLoadingRoutes(true);
        const res = await getUsuarioListas(displayedUserId);
        if (res && res.success) {
          setUserRoutes(res.data);
        }
      } catch (err) {
        console.error("Error fetching user routes:", err);
      } finally {
        setLoadingRoutes(false);
      }
    };
    fetchUserRoutes();
  }, [displayedUserId]);

  const handleDeleteRoute = async (id_lista) => {
    if (
      !window.confirm(
        t(
          "profile.confirmDeleteRoute",
          "¿Estás seguro de que quieres eliminar esta ruta?",
        ),
      )
    )
      return;
    try {
      await deleteLista(id_lista);
      setUserRoutes((prev) => prev.filter((r) => r.id_lista !== id_lista));
    } catch (err) {
      console.error("Error deleting route:", err);
    }
  };

  const handleFollow = async () => {
    if (!currentUser || followLoading) return;
    setFollowLoading(true);
    try {
      const myId = currentUser.id_usuario || currentUser.id;
      if (isFollowing) {
        await unfollowUsuario(myId, displayedUserId);
        setIsFollowing(false);
        setFollowersCount((c) => Math.max(0, c - 1));
      } else {
        await followUsuario(myId, displayedUserId);
        setIsFollowing(true);
        setFollowersCount((c) => c + 1);
      }
    } catch (e) {
      console.error("Error toggling follow:", e);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  if (!displayedUser && !isOwnProfile) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 text-slate-500">
        <span className="material-symbols-outlined text-6xl mb-4">
          person_off
        </span>
        <h2 className="text-xl font-bold">{t("profile.user_not_found", "Usuario no encontrado")}</h2>
        <Link
          to="/community"
          className="mt-4 text-primary font-bold hover:underline"
        >
          {t("profile.back_to_community", "Volver a Comunidad")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-display select-none transition-colors duration-300 md:pl-16 pb-32">
      {/* Modales QR */}
      {showMyQr && (
        <MyQrModal user={currentUser} onClose={() => setShowMyQr(false)} />
      )}
      {showScanQr && (
        <ScanQrModal
          allUsers={allUsers}
          onFollowed={handleFollowedViaQr}
          onClose={() => setShowScanQr(false)}
        />
      )}

      {/* Toast: ahora sigues a alguien */}
      {lastAdded && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold animate-fade-in">
          <span className="material-symbols-outlined text-base">
            person_check
          </span>
          {t("profile.nowFollowing", "¡Ahora sigues a")} {lastAdded.nombre}!
        </div>
      )}

      {/* Top Bar */}
      <div className="w-full pt-6 px-5 pb-4 bg-gray-50 dark:bg-slate-950 z-20 transition-colors duration-300 touch-none md:max-w-6xl md:mx-auto">
        <div className="flex justify-between items-center mb-2">
          {/* Home Icon instead of "Aplicación" */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#12080a] rounded-full text-slate-700 dark:text-white shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[22px]">
                home
              </span>
            </Link>
          </div>
          <h1 className="hidden md:block text-2xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white">
            {t("profile.my", "Mi")}{" "}
            <span className="text-primary">{t("nav.profile", "Perfil")}</span>
          </h1>
          <Link
            to="/settings"
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#12080a] rounded-full text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[22px]">
              settings
            </span>
          </Link>
        </div>
      </div>

      {/* Contenido */}
      <div className="px-5 md:max-w-6xl md:mx-auto">
        <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-10 lg:items-start">
          {/* Columna izquierda — sticky en desktop */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-[#12080a] rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
              <div className="mb-3">
                <UserAvatar
                  user={displayedUser}
                  className="w-24 h-24 lg:w-32 lg:h-32"
                  size={256}
                />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                {displayedUser.nombre}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                {displayedUser.bio || "Urban Explorer & Map Enthusiast"}
              </p>
              {isOwnProfile ? (
                <div className="flex flex-wrap justify-center gap-2">
                  <Link
                    to="/profile/edit"
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-primary text-primary text-xs font-black uppercase tracking-tight hover:bg-primary/10 transition-all active:scale-95 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-base font-bold">
                      edit
                    </span>
                    {t("profile.editProfile", "Editar Perfil")}
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("usuario");
                      navigate("/login");
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-primary-text text-xs font-black uppercase tracking-tight hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
                  >
                    <span className="material-symbols-outlined text-base font-bold">
                      logout
                    </span>
                    {t("settings.logout", "Log Out")}
                  </button>
                </div>
              ) : (
                /* Botón Seguir / Siguiendo — único botón en perfiles ajenos */
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-tight transition-all shadow-sm active:scale-95 ${
                    isFollowing
                      ? "border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-red-400 hover:text-red-400"
                      : "bg-primary text-primary-text hover:opacity-90 shadow-primary/20"
                  }`}
                >
                  <span className="material-symbols-outlined text-base font-bold">
                    {isFollowing ? "person_check" : "person_add"}
                  </span>
                  {isFollowing
                    ? t("community.following", "Siguiendo")
                    : t("community.follow", "Seguir")}
                </button>
              )}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="mt-5 lg:mt-0 min-h-[200px]">
            {/* Tab pills — visible en todo tipo de pantallas */}
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
              {[
                {
                  key: "posts",
                  label: t("profile.posts", "Publicaciones"),
                  icon: "grid_view",
                },
                {
                  key: "friends",
                  label: t("profile.friends", "Amigos"),
                  icon: "group",
                },
                {
                  key: "routes",
                  label: t("profile.routes", "Rutas"),
                  icon: "route",
                },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeTab === key ? "bg-primary text-primary-text shadow-lg shadow-primary/20" : "bg-white dark:bg-[#12080a] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:border-primary/40"}`}
                >
                  <span className="material-symbols-outlined text-base">
                    {icon}
                  </span>
                  {label}
                </button>
              ))}
            </div>

            {/* ── Tab Seguidores ── */}
            {activeTab === "friends" && (
              <div className="animate-fade-in space-y-4">
                {/* Cabecera con sub-tabs y botón QR */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      onClick={() => setSocialTab("followers")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        socialTab === "followers"
                          ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      }`}
                    >
                      {t("profile.followers", "Seguidores")} ({followersCount})
                    </button>
                    <button
                      onClick={() => setSocialTab("following")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        socialTab === "following"
                          ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      }`}
                    >
                      {t("profile.following", "Siguiendo")} ({followingCount})
                    </button>
                  </div>
                  {isOwnProfile && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowMyQr(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#12080a] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:border-primary hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">
                          qr_code_2
                        </span>
                        {t("profile.qr.myTitle", "Mi QR")}
                      </button>
                      <button
                        onClick={() => setShowScanQr(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-text text-xs font-bold hover:opacity-90 transition-colors shadow-lg shadow-primary/20"
                      >
                        <span className="material-symbols-outlined text-base">
                          qr_code_scanner
                        </span>
                        {t("community.follow", "Seguir")}
                      </button>
                    </div>
                  )}
                </div>

                {/* Lista de seguidores o seguidos */}
                {(socialTab === "followers" ? followersList : followingList)
                  .length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500 gap-3">
                    <span className="material-symbols-outlined text-5xl">
                      group_off
                    </span>
                    <p className="text-sm font-medium">
                      {socialTab === "followers"
                        ? t(
                            "profile.noFollowers",
                            "Aún nadie sigue este perfil",
                          )
                        : t("profile.noFollowing", "No sigue a nadie todavía")}
                    </p>
                    {isOwnProfile && socialTab === "followers" && (
                      <button
                        onClick={() => setShowScanQr(true)}
                        className="flex items-center gap-1.5 text-primary text-sm font-bold hover:underline"
                      >
                        <span className="material-symbols-outlined text-base">
                          qr_code_scanner
                        </span>
                        {t(
                          "profile.qr.scanHelp",
                          "Escanea el QR de alguien para seguirlo",
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(socialTab === "followers"
                      ? followersList
                      : followingList
                    ).map((person) => (
                      <a
                        key={person.id_usuario}
                        href={`/profile/${person.id_usuario}`}
                        className="flex items-center gap-3 bg-white dark:bg-[#12080a] p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary/40 transition-colors"
                      >
                        <UserAvatar user={person} className="w-12 h-12" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">
                            {person.nombre}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                            {person.bio || "City Explorer"}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-base">
                          chevron_right
                        </span>
                      </a>
                    ))}
                  </div>
                )}

                {/* Botón escanear al fondo */}
                {isOwnProfile && (
                  <button
                    onClick={() => setShowScanQr(true)}
                    className="w-full mt-2 py-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-sm font-semibold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">
                      qr_code_scanner
                    </span>
                    {t(
                      "profile.qr.scanHelp",
                      "Escanear QR para seguir a alguien",
                    )}
                  </button>
                )}
              </div>
            )}

            {/* ── Tab Posts ── */}
            {activeTab === "posts" && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 lg:hidden">
                  {t("profile.recentPosts", "Actividad Reciente")}
                </h3>
                <div className="flex flex-col gap-4">
                  {loadingPosts ? (
                    <div className="col-span-2 text-center py-10 text-slate-500">
                      <span className="material-symbols-outlined animate-spin text-2xl mb-2">
                        progress_activity
                      </span>
                      <p>
                        {t("profile.loadingPosts", "Cargando publicaciones...")}
                      </p>
                    </div>
                  ) : userPosts.length === 0 ? (
                    <div className="col-span-2 text-center py-10 text-slate-500 bg-white dark:bg-[#12080a] rounded-2xl border border-slate-100 dark:border-slate-800">
                      {t("profile.noPosts", "No tienes publicaciones todavía.")}
                    </div>
                  ) : (
                    userPosts.map((post, idx) => (
                      <div
                        key={post.id_publicacion || post.id || post._id || idx}
                        className="bg-white dark:bg-[#12080a] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
                      >
                        {post.foto && (
                          <div className="bg-black/5 dark:bg-white/5">
                            <img
                              src={getFullPostImageUrl(post.foto)}
                              alt="Post"
                              className="w-full max-h-[500px] object-contain"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                            {post.texto || "Sin descripción"}
                          </p>
                          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-base">
                                favorite
                              </span>
                              {post.likes || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-base">
                                chat_bubble
                              </span>
                              {post.comentarios ? post.comentarios.length : 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ── Tab Rutas ── */}
            {activeTab === "routes" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    {isOwnProfile
                      ? t("profile.myRoutes", "Mis Rutas")
                      : t("profile.userRoutes", "Rutas del usuario")}
                  </h3>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                    {userRoutes.length}
                  </span>
                </div>

                {loadingRoutes ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <span className="material-symbols-outlined animate-spin text-3xl mb-2">
                      progress_activity
                    </span>
                    <p className="text-sm font-medium">
                      {t("common.loading", "Cargando...")}
                    </p>
                  </div>
                ) : userRoutes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500 bg-white dark:bg-[#12080a] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center px-4">
                    <span className="material-symbols-outlined text-5xl mb-3 text-slate-300 dark:text-slate-700">
                      map
                    </span>
                    <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isOwnProfile
                        ? t(
                            "profile.noRoutesSelf",
                            "Aún no has guardado ninguna ruta",
                          )
                        : t(
                            "profile.noRoutesUser",
                            "Este usuario no tiene rutas públicas",
                          )}
                    </p>
                    {isOwnProfile && (
                      <>
                        <p className="text-sm max-w-[250px] mx-auto mb-5">
                          {t(
                            "profile.noRoutesDesc",
                            "Explora el mapa y crea itinerarios para que aparezcan aquí.",
                          )}
                        </p>
                        <Link
                          to="/map"
                          className="px-6 py-2.5 bg-primary text-primary-text font-bold rounded-full shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
                        >
                          {t("profile.goToMap", "Ir al Mapa")}
                        </Link>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {userRoutes.map((route) => (
                      <div
                        key={route.id_lista}
                        className="bg-white dark:bg-[#12080a] p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 group"
                      >
                        <div className="w-16 h-16 bg-primary/5 rounded-xl flex items-center justify-center shrink-0 border border-primary/10">
                          <span className="material-symbols-outlined text-3xl text-primary">
                            route
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 dark:text-white truncate uppercase italic tracking-tighter">
                            {route.nombre}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-2">
                            {route.descripcion || "Sin descripción"}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                              <span className="material-symbols-outlined text-xs">
                                location_on
                              </span>
                              {route.pois?.length || 0} punts
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Link
                            to={`/map?route=${route.id_lista}`}
                            className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-primary-text transition-all active:scale-90"
                            title={t("profile.viewOnMap", "Ver en mapa")}
                          >
                            <span className="material-symbols-outlined text-xl">
                              map
                            </span>
                          </Link>
                          {isOwnProfile && (
                            <button
                              onClick={() => handleDeleteRoute(route.id_lista)}
                              className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                              title={t("common.delete", "Eliminar")}
                            >
                              <span className="material-symbols-outlined text-xl">
                                delete
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
