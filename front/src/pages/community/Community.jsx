import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../layouts/Navbar";
import Header from "../../layouts/Header";
import {
  getPublicaciones,
  createPublicacion,
  createComentario,
  toggleLike,
  uploadFotoComunidad,
  getAmigos,
  getActividad,
  searchUsers,
  getListas,
  getFriendsListas,
  toggleLikeLista,
  createLista,
  getUsuarioListas,
} from "../../services/communicationManager";
import socket from "../../services/socketManager";
import ChatModal from "../../components/community/ChatModal";
import UserAvatar from "../../components/UserAvatar";
import FriendStatusRow from "../../components/shared/FriendStatusRow";
import Toast from "../../components/Toast";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("ca-ES", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const compressImage = (file, maxPx = 1024, quality = 0.8) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        if (width >= height) {
          height = Math.round((height * maxPx) / width);
          width = maxPx;
        } else {
          width = Math.round((width * maxPx) / height);
          height = maxPx;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob)
            return reject(new Error("No s'ha pogut comprimir la imatge"));
          resolve(
            new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
              type: "image/jpeg",
            }),
          );
        },
        "image/jpeg",
        quality,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No s'ha pogut carregar la imatge"));
    };
    img.src = url;
  });

// ─── Sub-componente: Card de una publicación ─────────────────────────────────
const PostCard = ({ pub, onComentarioCreado }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(pub.likes ?? 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [textoComentario, setTextoComentario] = useState("");
  const interactedRef = React.useRef(false); // evita que el useEffect sobreescriba el estado local tras interacción

  const navigate = useNavigate();
  const usuarioInfo = localStorage.getItem("usuario");
  const usuarioLogged = usuarioInfo ? JSON.parse(usuarioInfo) : null;

  useEffect(() => {
    // Solo sincronizar desde el servidor si el usuario NO ha interactuado todavía
    if (!interactedRef.current && usuarioLogged && pub.likes_usuarios) {
      setLiked(pub.likes_usuarios.includes(String(usuarioLogged.id_usuario)));
    }
    // Siempre actualizar el conteo desde el servidor (si no hay interacción activa)
    if (!interactedRef.current) {
      setLikesCount(pub.likes ?? 0);
    }
  }, [pub]);

  const handleLike = async () => {
    if (!usuarioLogged) {
      navigate("/login");
      return;
    }
    if (isLikeLoading) return;
    interactedRef.current = true; // marcar que el usuario ha interactuado
    const prevLiked = liked;
    const prevCount = likesCount;
    setIsLikeLoading(true);
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);
    try {
      const res = await toggleLike(pub._id, {
        id_usuario: usuarioLogged.id_usuario,
      });
      setLikesCount(res.likes);
    } catch {
      setLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleComentario = async (e) => {
    e.preventDefault();
    if (!usuarioLogged) {
      navigate("/login");
      return;
    }
    if (!textoComentario.trim()) return;
    try {
      await createComentario(pub._id, {
        id_usuario: usuarioLogged.id_usuario,
        nombre_usuario: usuarioLogged.nombre,
        foto_perfil: usuarioLogged.foto_perfil || null,
        texto: textoComentario.trim(),
      });
      setTextoComentario("");
      onComentarioCreado(pub._id);
    } catch (err) {
      console.error(err);
    }
  };

  const hasImage = !!pub.foto;

  return (
    <article className="bg-white dark:bg-slate-950 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden mb-6 transition-all hover:shadow-md">
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${pub.id_usuario}`}>
            <UserAvatar
              user={{
                foto_perfil: pub.foto_perfil,
                nombre: pub.nombre_usuario,
              }}
              className="w-10 h-10"
            />
          </Link>
          <div>
            <Link to={`/profile/${pub.id_usuario}`}>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-none hover:text-primary transition-colors tracking-tight">
                {pub.nombre_usuario}
              </h4>
            </Link>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
              {formatDate(pub.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-4">
        <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed mb-4">
          {pub.texto}
        </p>
        {hasImage && (
          <div className="rounded-2xl overflow-hidden border border-gray-50 dark:border-white/5 bg-black/5 dark:bg-white/5">
            <img
              src={pub.foto}
              className="w-full max-h-[500px] object-contain"
              onError={(e) =>
                (e.target.src =
                  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop")
              }
            />
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-t border-gray-50 dark:border-white/5 flex items-center gap-6">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors ${liked ? "text-primary" : "text-slate-400"}`}
        >
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
          <span className="text-xs font-bold">{likesCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-slate-400"
        >
          <span className="material-symbols-outlined text-xl">chat_bubble</span>
          <span className="text-xs font-bold">
            {pub.comentarios?.length || 0}
          </span>
        </button>
      </div>

      {showComments && (
        <div className="px-5 pb-5 pt-2 space-y-4 bg-gray-50/50 dark:bg-white/5">
          <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
            {pub.comentarios?.map((com) => (
              <div key={com._id} className="flex gap-2">
                <Link to={`/profile/${com.id_usuario}`}>
                  <UserAvatar
                    user={{
                      foto_perfil: com.foto_perfil,
                      nombre: com.nombre_usuario,
                    }}
                    className="w-6 h-6"
                  />
                </Link>
                <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-2xl rounded-tl-none border border-gray-100 dark:border-white/5">
                  <Link to={`/profile/${com.id_usuario}`}>
                    <p className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors">
                      {com.nombre_usuario}
                    </p>
                  </Link>
                  <p className="text-xs text-slate-700 dark:text-slate-200">
                    {com.texto}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleComentario} className="flex gap-2">
            <input
              value={textoComentario}
              onChange={(e) => setTextoComentario(e.target.value)}
              placeholder="Escriu un comentari..."
              className="flex-1 bg-white dark:bg-slate-800 text-xs rounded-xl px-4 py-2 focus:outline-none border border-gray-200 dark:border-white/5 shadow-sm"
            />
            <button
              type="submit"
              className="w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-md"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

// ─── Sub-componente: Card de una lista ───────────────────────────────────────
const ListaCard = ({ lista, userLists = [] }) => {
  const navigate = useNavigate();
  const usuarioInfo = localStorage.getItem("usuario");
  const usuarioLogged = usuarioInfo ? JSON.parse(usuarioInfo) : null;
  const [liked, setLiked] = useState(lista.user_liked > 0);
  const [likesCount, setLikesCount] = useState(lista.likes || 0);
  const [toast, setToast] = useState(null);

  const isSaved = userLists.some(
    (ul) =>
      ul.nombre === lista.nombre &&
      (ul.pois?.length || 0) === (lista.pois?.length || 0),
  );

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!usuarioLogged) {
      navigate("/login");
      return;
    }

    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const res = await toggleLikeLista(
        lista.id_lista,
        usuarioLogged.id_usuario,
      );
      setLikesCount(res.likes);
      setLiked(res.liked);
    } catch {
      setLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleSaveList = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!usuarioLogged) {
      navigate("/login");
      return;
    }

    if (isSaved) {
      setToast({
        message: "Ja tens aquesta llista guardada!",
        type: "warning",
      });
      return;
    }

    try {
      const newListData = {
        id_usuario: usuarioLogged.id_usuario,
        nombre: lista.nombre,
        descripcion: lista.descripcion || "Guardada des de la comunitat",
        visibilidad: "private",
        pois: lista.pois?.map((p) => p.id_poi) || [],
      };
      const res = await createLista(newListData);
      if (res.success) {
        setToast({
          message: "Llista guardada a les teves rutes!",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error saving list:", error);
      setToast({ message: "Error al guardar la llista", type: "error" });
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div
        className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer mb-6"
        onClick={() => navigate("/map", { state: { focusedList: lista } })}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={
              lista.imagen_url
                ? `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${lista.imagen_url}`
                : "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&q=80"
            }
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            alt={lista.nombre}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div className="flex-1 pr-4">
              <h3 className="text-white font-bold text-lg leading-tight mb-1 truncate">
                {lista.nombre}
              </h3>
              <div className="flex items-center gap-2">
                <UserAvatar
                  user={{
                    foto_perfil: lista.usuario_foto,
                    nombre: lista.usuario_nombre,
                  }}
                  className="w-5 h-5 border border-white/20"
                />
                <span className="text-white/70 text-[10px] font-medium tracking-tight">
                  Per {lista.usuario_nombre}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveList}
                className={`flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-md transition-all ${isSaved ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-white/20 text-white hover:bg-white/30"}`}
                title={
                  isSaved ? "Llista ja guardada" : "Guardar a les meves llistes"
                }
              >
                <span
                  className="material-symbols-outlined text-sm"
                  style={{
                    fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  bookmark
                </span>
              </button>
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md transition-all ${liked ? "bg-pink-500 text-white" : "bg-white/20 text-white hover:bg-white/30"}`}
              >
                <span
                  className="material-symbols-outlined text-sm"
                  style={{
                    fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  favorite
                </span>
                <span className="text-[10px] font-black">{likesCount}</span>
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
            {lista.descripcion ||
              "Sense descripció disponible per aquesta ruta."}
          </p>
          <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1 text-slate-400">
              <span className="material-symbols-outlined text-sm">
                location_on
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {lista.pois?.length || 0} Punts
              </span>
            </div>
            <span className="text-pink-500 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
              Veure mapa →
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const Community = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const usuarioInfo = localStorage.getItem("usuario");
  const usuarioLogged = usuarioInfo ? JSON.parse(usuarioInfo) : null;

  const [view, setView] = useState("feed"); // feed, activity, search, lists
  const [subView, setSubView] = useState("public"); // public, friends
  const [publicaciones, setPublicaciones] = useState([]);
  const [actividad, setActividad] = useState([]);
  const [listas, setListas] = useState([]);
  const [userLists, setUserLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [amigos, setAmigos] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState({
    texto: "",
    tipo_publicacion: "popular",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const cargarPublicaciones = async () => {
    try {
      const data = await getPublicaciones();
      setPublicaciones(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarActividad = async () => {
    try {
      const res = await getActividad();
      if (res.success) setActividad(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cargarListas = async () => {
    // Si no hay usuario o no ha cargado, no intentamos cargar listas privadas
    if (!usuarioLogged?.id_usuario) {
      if (subView === "friends") {
        setListas([]);
        return;
      }
      // Para públicas podemos continuar sin ID
    }

    setLoading(true);
    try {
      let res;
      if (subView === "public") {
        res = await getListas(usuarioLogged?.id_usuario || null);
      } else {
        res = await getFriendsListas(usuarioLogged?.id_usuario);
      }
      setListas(res.data || []);
    } catch (err) {
      console.error(err);
      setListas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.length < 2) {
      setSearchResults([]);
      if (view === "search") setView("feed");
      if (view === "lists") cargarListas();
      return;
    }

    if (view === "lists") {
      const filtered = listas.filter(
        (l) =>
          l.nombre.toLowerCase().includes(q.toLowerCase()) ||
          l.descripcion?.toLowerCase().includes(q.toLowerCase()),
      );
      setListas(filtered);
    } else {
      setView("search");
      try {
        const res = await searchUsers(q);
        if (res.success) setSearchResults(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    cargarPublicaciones();
    cargarActividad();
    if (usuarioLogged) {
      getAmigos(usuarioLogged.id_usuario).then((r) => setAmigos(r.data || []));
      // Cargamos solo las listas propias del usuario para detectar duplicados correctamente
      getUsuarioListas(usuarioLogged.id_usuario).then((r) =>
        setUserLists(r.data || []),
      );
    }

    if (view === "lists") {
      cargarListas();
    }

    socket.on("nueva_publicacion", cargarPublicaciones);
    socket.on("nuevo_comentario", cargarPublicaciones);

    return () => {
      socket.off("nueva_publicacion");
      socket.off("nuevo_comentario");
    };
  }, [view, subView]);

  const handleCreatePost = async () => {
    if (!newPost.texto && !selectedFile) return;
    try {
      let fotoUrl = "";
      if (selectedFile) {
        const fileToUpload = await compressImage(selectedFile);
        const uploadRes = await uploadFotoComunidad(fileToUpload);
        fotoUrl = `${import.meta.env.VITE_API_URL || ""}${uploadRes.url}`;
      }
      await createPublicacion({
        id_usuario: usuarioLogged.id_usuario,
        nombre_usuario: usuarioLogged.nombre,
        foto_perfil: usuarioLogged.foto_perfil || null,
        texto: newPost.texto,
        foto: fotoUrl,
        tipo_publicacion: newPost.tipo_publicacion,
      });
      setNewPost({ texto: "", tipo_publicacion: "popular" });
      setSelectedFile(null);
      setPreviewUrl("");
      setShowPostModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f0f4f9] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-display transition-colors duration-300 pb-32">
      <Header />

      <div className="sticky top-0 z-40 px-6 pt-4 pb-4 bg-[#f0f4f9]/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-gray-100 dark:border-white/5">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* Search Bar */}
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t("collections.search", "Busca amics o llistes...")}
              className="w-full bg-white dark:bg-slate-950 border border-gray-100 dark:border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm group-focus-within:shadow-md font-display"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setView("feed")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium tracking-tight transition-all border ${view === "feed" ? "bg-primary text-primary-text border-transparent shadow-md shadow-primary/20" : "bg-white dark:bg-slate-950 text-slate-400 border-gray-100 dark:border-white/5 hover:border-gray-200"}`}
            >
              <span className="material-symbols-outlined text-sm">groups</span>
              {t("nav.community", "Comunitat")}
            </button>
            <button
              onClick={() => setView("activity")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium tracking-tight transition-all border ${view === "activity" ? "bg-primary text-primary-text border-transparent shadow-md shadow-primary/20" : "bg-white dark:bg-slate-950 text-slate-400 border-gray-100 dark:border-white/5 hover:border-gray-200"}`}
            >
              <span
                className="material-symbols-outlined text-sm"
                style={{
                  fontVariationSettings:
                    view === "activity" ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                bolt
              </span>
              {t("community.tabs.recent", "Recents")}
            </button>
            <button
              onClick={() => setView("lists")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium tracking-tight transition-all border ${view === "lists" ? "bg-primary text-primary-text border-transparent shadow-md shadow-primary/20" : "bg-white dark:bg-slate-950 text-slate-400 border-gray-100 dark:border-white/5 hover:border-gray-200"}`}
            >
              <span className="material-symbols-outlined text-sm">map</span>
              Llistes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        {/* Friends Horizontal List */}
        <div className="mb-8">
          <FriendStatusRow friends={amigos} onFriendClick={setSelectedFriend} />
        </div>

        {/* ─── Main Views ─── */}
        <main>
          {view === "feed" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {loading ? (
                <div className="text-center py-20 opacity-30 font-bold uppercase tracking-widest text-xs">
                  {t("common.loading", "Carregant publicacions...")}
                </div>
              ) : (
                publicaciones.map((pub, idx) => (
                  <PostCard
                    key={pub.id_publicacion || pub._id || pub.id || idx}
                    pub={pub}
                    onComentarioCreado={cargarPublicaciones}
                  />
                ))
              )}
            </div>
          )}

          {view === "activity" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-indigo-500 mb-6">
                {t("profile.recentPosts", "Activitat Recent")}
              </h3>
              {actividad.map((act, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex gap-4 items-center shadow-sm"
                >
                  <Link to={`/profile/${act.id_usuario}`}>
                    <UserAvatar
                      user={{ foto: act.foto, nombre: act.usuario }}
                      className="w-10 h-10"
                    />
                  </Link>
                  <div className="flex-1">
                    <p className="text-xs text-slate-700 dark:text-slate-200">
                      <Link to={`/profile/${act.id_usuario}`}>
                        <span className="font-bold hover:text-primary transition-colors">
                          {act.usuario}
                        </span>
                      </Link>{" "}
                      {t("profile.posts", "ha creat una nova publicació")}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {formatDate(act.fecha)}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-indigo-500 opacity-30">
                    bolt
                  </span>
                </div>
              ))}
            </div>
          )}

          {view === "lists" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex gap-2 mb-8 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-gray-100 dark:border-white/5 w-fit">
                <button
                  onClick={() => setSubView("public")}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subView === "public" ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Públiques
                </button>
                <button
                  onClick={() => setSubView("friends")}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subView === "friends" ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Amics
                </button>
              </div>

              {loading ? (
                <div className="text-center py-20 opacity-30 font-bold uppercase tracking-widest text-xs">
                  Carregant llistes...
                </div>
              ) : listas.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-dashed border-gray-200 dark:border-white/10">
                  <span className="material-symbols-outlined text-4xl text-slate-200 mb-4">
                    map
                  </span>
                  <p className="text-sm font-medium text-slate-400">
                    No s'han trobat llistes en aquesta categoria.
                  </p>
                </div>
              ) : (
                listas.map((lista) => (
                  <ListaCard
                    key={lista.id_lista}
                    lista={lista}
                    userLists={userLists}
                  />
                ))
              )}
            </div>
          )}

          {view === "search" && (
            <div className="animate-in fade-in zoom-in-95 duration-300 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
                {t("collections.search", "Resultats")} para "{searchQuery}"
              </h3>
              {searchResults.length === 0 ? (
                <div className="text-center py-20 opacity-30">
                  {t("community.noFriends", "No s'han trobat usuaris")}
                </div>
              ) : (
                searchResults.map((user, idx) => (
                  <Link
                    key={user.id_usuario || user.id || idx}
                    to={`/profile/${user.id_usuario}`}
                    className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex gap-4 items-center hover:border-primary/30 transition-all shadow-sm"
                  >
                    <UserAvatar user={user} className="w-12 h-12" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-white">
                        {user.nombre}
                      </h4>
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">
                        {user.bio ||
                          t("editProfile.bioPlaceholder", "Sense biografia")}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300">
                      chevron_right
                    </span>
                  </Link>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* FAB - Add Post */}
      <button
        onClick={() => {
          if (!usuarioLogged) {
            navigate("/login");
            return;
          }
          setShowPostModal(true);
        }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-text rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 z-40 hover:scale-110 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* New Post Modal */}
      {showPostModal && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowPostModal(false)}
        >
          <div
            className="w-full md:max-w-lg bg-white dark:bg-slate-950 rounded-[2.5rem] p-8 animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold tracking-tight">
                {t("community.newPost", "Nova Publicació")}
              </h2>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-slate-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <textarea
              value={newPost.texto}
              onChange={(e) =>
                setNewPost({ ...newPost, texto: e.target.value })
              }
              placeholder={t("editProfile.bioPlaceholder", "Explica algo...")}
              className="w-full bg-gray-50 dark:bg-white/5 rounded-2xl p-4 text-sm focus:outline-none min-h-[280px] resize-none border border-gray-100 dark:border-white/5"
            />
            <div className="mt-4">
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full py-3 bg-gray-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 rounded-xl text-[10px] font-display font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
              >
                <span className="material-symbols-outlined text-lg">image</span>{" "}
                {t("community.photo", "Photo")}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files[0];
                if (f) {
                  setSelectedFile(f);
                  setPreviewUrl(URL.createObjectURL(f));
                }
              }}
            />
            {previewUrl && (
              <div className="relative mt-4 rounded-xl overflow-hidden aspect-video border border-gray-100">
                <img src={previewUrl} className="w-full h-full object-cover" />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl("");
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white w-6 h-6 rounded-full flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-sm">
                    close
                  </span>
                </button>
              </div>
            )}
            <button
              onClick={handleCreatePost}
              className="w-full mt-6 bg-primary text-white dark:text-black py-4 rounded-2xl font-display font-semibold shadow-xl shadow-primary/20 active:scale-95 transition-transform"
            >
              {t("community.publish", "Publicar")}
            </button>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {selectedFriend && (
        <ChatModal
          friend={selectedFriend}
          user={usuarioLogged}
          onClose={() => setSelectedFriend(null)}
        />
      )}

      <Navbar />
    </div>
  );
};

export default Community;
