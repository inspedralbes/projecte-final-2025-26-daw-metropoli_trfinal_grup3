import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSearch } from "../../context/SearchContext";
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
  updateLista,
  getUsuarioListas,
  getListaById,
  createLista,
  toggleLikeLista,
  guardarLista,
  getListas,
  getFriendsListas
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
const PostCard = ({ pub, onComentarioCreado, userLists = [] }) => {
  const { t } = useTranslation();
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(pub.likes ?? 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [textoComentario, setTextoComentario] = useState("");
  const [comentarioFile, setComentarioFile] = useState(null);
  const [comentarioPreview, setComentarioPreview] = useState("");
  const fileInputRef = useRef(null);
  const [attachedLista, setAttachedLista] = useState(null);
  const [routeSaving, setRouteSaving] = useState(false);
  const [routeSaved, setRouteSaved] = useState(false);
  const interactedRef = React.useRef(false);

  const navigate = useNavigate();
  const usuarioInfo = localStorage.getItem("usuario");
  const usuarioLogged = usuarioInfo ? JSON.parse(usuarioInfo) : null;

  // Parse [lista:ID] marker from the post text
  const listaMarkerMatch = pub.texto?.match(/\[lista:(\d+)\]/);
  const listaId = listaMarkerMatch ? listaMarkerMatch[1] : null;
  const displayText = pub.texto?.replace(/\s*\[lista:\d+\]/, "").trim();

  useEffect(() => {
    if (listaId) {
      getListaById(listaId)
        .then((res) => setAttachedLista(res.data || res))
        .catch(() => {});
    }
  }, [listaId]);

  useEffect(() => {
    if (!interactedRef.current && usuarioLogged && pub.likes_usuarios) {
      setLiked(pub.likes_usuarios.includes(String(usuarioLogged.id_usuario)));
    }
    if (!interactedRef.current) {
      setLikesCount(pub.likes ?? 0);
    }
  }, [pub]);

  const handleLike = async () => {
    if (!usuarioLogged) { navigate("/login"); return; }
    if (isLikeLoading) return;
    interactedRef.current = true;
    const prevLiked = liked;
    const prevCount = likesCount;
    setIsLikeLoading(true);
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);
    try {
      const res = await toggleLike(pub._id, { id_usuario: usuarioLogged.id_usuario });
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
    if (!usuarioLogged) { navigate("/login"); return; }
    if (!textoComentario.trim() && !comentarioFile) return;

    // Filtro de palabras restringidas
    const restrictedWords = [
      "mierda", "puta", "puto", "gilipollas", "cabron", "cabrón", "cojones", "joder", "hostia", "follar",
      "pendejo", "zorra", "maricon", "maricón", "idiota", "estupido", "estúpido", "imbecil", "imbécil",
      "basura", "asco", "fuck", "shit", "bitch"
    ];

    const foundWord = restrictedWords.find(word =>
      textoComentario.toLowerCase().includes(word.toLowerCase())
    );

    if (foundWord) {
      alert(t("community.alerts.restricted_word", "Opa! El teu missatge conté paraules no permeses (ex: \"{{word}}\"). Per favor, mantingues el respecte a la comunitat.", { word: foundWord }));
      return;
    }

    try {
      let fotoUrl = null;
      if (comentarioFile) {
        const fileToUpload = await compressImage(comentarioFile);
        const uploadRes = await uploadFotoComunidad(fileToUpload);
        fotoUrl = `${import.meta.env.VITE_API_URL || ""}${uploadRes.url}`;
      }

      await createComentario(pub._id, {
        id_usuario: usuarioLogged.id_usuario,
        nombre_usuario: usuarioLogged.nombre,
        foto_perfil: usuarioLogged.foto_perfil || null,
        texto: textoComentario.trim() || t("community.photo_comment", "📸 Foto"),
        foto: fotoUrl,
      });
      setTextoComentario("");
      setComentarioFile(null);
      setComentarioPreview("");
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
              user={{ foto_perfil: pub.foto_perfil, nombre: pub.nombre_usuario }}
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
        {displayText && (
          <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed mb-4">
            {displayText}
          </p>
        )}
        {hasImage && (
          <div className="rounded-2xl overflow-hidden border border-gray-50 dark:border-white/5 bg-black/5 dark:bg-white/5">
            <img
              src={pub.foto}
              className="w-full max-h-[500px] object-contain"
              onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop")}
            />
          </div>
        )}

        {/* Attached route card — compact inline preview */}
        {attachedLista && (() => {
          const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
          const imgSrc = attachedLista.imagen_url
            ? (attachedLista.imagen_url.startsWith("http") ? attachedLista.imagen_url : `${API}${attachedLista.imagen_url}`)
            : "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80";
          const isOwner = usuarioLogged && String(attachedLista.id_usuario) === String(usuarioLogged?.id_usuario);
          const alreadySaved = routeSaved || userLists.some((ul) => ul.id_lista === attachedLista.id_lista);

          const handleSaveRoute = async (e) => {
            e.stopPropagation();
            if (!usuarioLogged) { navigate("/login"); return; }
            if (alreadySaved) return;
            setRouteSaved(true);
            try {
              await createLista({
                id_usuario: usuarioLogged.id_usuario,
                nombre: attachedLista.nombre,
                descripcion: `[GUARDADA de: ${attachedLista.usuario_nombre || 'Comunidad'}] ${attachedLista.descripcion || ""}`,
                visibilidad: "private",
                imagen_url: attachedLista.imagen_url || null,
                pois: (attachedLista.pois || []).map((p) => p.id_poi || p.id),
              });
            } catch (err) { 
              console.error(err); 
              setRouteSaved(false);
            }
          };

          return (
            <div
              className="mt-3 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 cursor-pointer group"
              onClick={() => navigate("/map", { state: { focusedList: attachedLista } })}
            >
              {/* Cover image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={imgSrc}
                  alt={attachedLista.nombre}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-white font-bold text-sm leading-tight truncate">{attachedLista.nombre}</p>
                    <p className="text-white/60 text-[10px] mt-0.5">
                      {t("community.points_count", "{{count}} punts", { count: attachedLista.pois?.length || 0 })}
                      {attachedLista.usuario_nombre ? ` · ${attachedLista.usuario_nombre}` : ""}
                    </p>
                  </div>
                  {!isOwner && (
                    <button
                      onClick={handleSaveRoute}
                      disabled={alreadySaved || routeSaving}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                        alreadySaved ? "bg-amber-500 text-white" : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: alreadySaved ? "'FILL' 1" : "'FILL' 0" }}>
                        bookmark
                      </span>
                      {alreadySaved ? t("collections.saved", "Guardada") : routeSaving ? "..." : t("collections.save", "Guardar")}
                    </button>
                  )}
                  {isOwner && (
                    <span className="bg-emerald-500/80 backdrop-blur-sm text-white text-[9px] font-black uppercase px-2 py-1 rounded-full">
                      {t("community.your_route", "La teva ruta")}
                    </span>
                  )}
                </div>
              </div>
              {/* Footer */}
              <div className="px-4 py-2.5 bg-white dark:bg-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>route</span>
                <span className="text-[10px] text-slate-400 font-medium">{t("community.tap_to_view_route", "Toca per veure la ruta al mapa")}</span>
                <span className="material-symbols-outlined text-slate-300 text-sm ml-auto">chevron_right</span>
              </div>
            </div>
          );
        })()}

        {/* Loading placeholder while route loads */}
        {listaId && !attachedLista && (
          <div className="mt-3 bg-gray-50 dark:bg-white/5 rounded-2xl h-36 flex items-center justify-center gap-3 border border-gray-100 dark:border-white/10 animate-pulse">
            <span className="material-symbols-outlined text-slate-300">route</span>
            <span className="text-xs text-slate-400">{t("community.loading_route", "Carregant ruta...")}</span>
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-t border-gray-50 dark:border-white/5 flex items-center gap-6">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors ${liked ? "text-primary" : "text-slate-400"}`}
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>
            favorite
          </span>
          <span className="text-xs font-bold">{likesCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-slate-400"
        >
          <span className="material-symbols-outlined text-xl">chat_bubble</span>
          <span className="text-xs font-bold">{pub.comentarios?.length || 0}</span>
        </button>
      </div>

      {showComments && (
        <div className="px-5 pb-5 pt-2 space-y-4 bg-gray-50/50 dark:bg-white/5">
          <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
            {pub.comentarios?.map((com) => (
              <div key={com._id} className="flex gap-2">
                <Link to={`/profile/${com.id_usuario}`}>
                  <UserAvatar user={{ foto_perfil: com.foto_perfil, nombre: com.nombre_usuario }} className="w-6 h-6" />
                </Link>
                <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-2xl rounded-tl-none border border-gray-100 dark:border-white/5 max-w-[85%]">
                  <Link to={`/profile/${com.id_usuario}`}>
                    <p className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors">{com.nombre_usuario}</p>
                  </Link>
                  <p className="text-xs text-slate-700 dark:text-slate-200">{com.texto}</p>
                  {com.foto && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-gray-100 dark:border-white/5">
                      <img src={com.foto} alt="Comentario" className="max-w-full max-h-32 object-contain" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {comentarioPreview && (
              <div className="relative self-start mt-2">
                <img src={comentarioPreview} className="h-16 w-16 object-cover rounded-xl border border-gray-200" alt="Preview" />
                <button
                  type="button"
                  onClick={() => { setComentarioFile(null); setComentarioPreview(""); }}
                  className="absolute -top-2 -right-2 bg-black/60 text-white w-5 h-5 rounded-full flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[10px]">close</span>
                </button>
              </div>
            )}
            <form onSubmit={handleComentario} className="flex gap-2 items-center">
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) {
                    setComentarioFile(f);
                    setComentarioPreview(URL.createObjectURL(f));
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${comentarioFile ? "bg-primary/10 text-primary" : "bg-gray-100 dark:bg-slate-800 text-slate-400 hover:text-primary"}`}
              >
                <span className="material-symbols-outlined text-sm">image</span>
              </button>
              <input
                value={textoComentario}
                onChange={(e) => setTextoComentario(e.target.value)}
                placeholder={t("community.write_comment", "Escriu un comentari...")}
                className="flex-1 bg-white dark:bg-slate-800 text-xs rounded-xl px-4 py-2 focus:outline-none border border-gray-200 dark:border-white/5 shadow-sm"
              />
              <button 
                type="submit" 
                disabled={!textoComentario.trim() && !comentarioFile}
                className="w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-md disabled:opacity-50 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </article>
  );
};

// ─── Sub-componente: Card de una lista ───────────────────────────────────────
const ListaCard = ({ lista, userLists = [], onListaChanged }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const usuarioInfo = localStorage.getItem("usuario");
  const usuarioLogged = usuarioInfo ? JSON.parse(usuarioInfo) : null;
  const [liked, setLiked] = useState(lista.user_liked > 0);
  const [likesCount, setLikesCount] = useState(lista.likes || 0);
  const [toast, setToast] = useState(null);
  const isOwner = usuarioLogged && String(lista.id_usuario) === String(usuarioLogged.id_usuario);

  const isSaved = userLists.some(
    (ul) =>
      ul.nombre === lista.nombre &&
      (ul.pois?.length || 0) === (lista.pois?.length || 0),
  );
  const [localSaved, setLocalSaved] = useState(false);

  const handleUnshare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await updateLista(lista.id_lista, {
        nombre: lista.nombre,
        descripcion: lista.descripcion,
        visibilidad: "private",
        pois: lista.pois?.map((p) => ({ id_poi: p.id_poi })) || [],
      });
      setToast({ message: t("community.toast.unshared", "Ruta retirada de la Comunitat."), type: "info" });
      if (onListaChanged) onListaChanged();
    } catch (error) {
      console.error("Error unsharing list:", error);
      setToast({ message: t("community.toast.unshare_error", "Error al retirar la ruta."), type: "error" });
    }
  };

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

    if (isSaved || localSaved) {
      setToast({
        message: t("community.toast.already_saved", "Ja tens aquesta llista guardada!"),
        type: "warning",
      });
      return;
    }

    setLocalSaved(true);

    try {
      const res = await createLista({
        id_usuario: usuarioLogged.id_usuario,
        nombre: lista.nombre,
        descripcion: `[GUARDADA de: ${lista.usuario_nombre || 'Comunidad'}] ${lista.descripcion || ""}`,
        visibilidad: "private",
        imagen_url: lista.imagen_url || null,
        pois: (lista.pois || []).map((p) => p.id_poi || p.id),
      });
      if (res.success) {
        setToast({
          message: t("community.toast.saved_to_routes", "Llista guardada a les teves rutes!"),
          type: "success",
        });
        if (onListaChanged) onListaChanged();
      }
    } catch (error) {
      console.error("Error saving list:", error);
      setLocalSaved(false);
      setToast({ message: t("community.toast.save_error", "Error al guardar la llista"), type: "error" });
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
                  {t("community.by", "Per {{name}}", { name: lista.usuario_nombre })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Owner badge + unshare button */}
              {isOwner && (
                <button
                  onClick={handleUnshare}
                  className="flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-md bg-emerald-500/80 text-white hover:bg-red-500/80 transition-all group"
                  title={t("community.unshare", "Retirar de la Comunitat")}
                >
                  <span className="material-symbols-outlined text-sm group-hover:hidden" style={{ fontVariationSettings: "'FILL' 1" }}>
                    public
                  </span>
                  <span className="material-symbols-outlined text-sm hidden group-hover:block">
                    public_off
                  </span>
                </button>
              )}
              {/* Save bookmark (for non-owners) */}
              {!isOwner && (
                <button
                  onClick={handleSaveList}
                  className={`flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-md transition-all ${(isSaved || localSaved) ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-white/20 text-white hover:bg-white/30"}`}
                  title={
                    (isSaved || localSaved) ? t("community.toast.already_saved", "Llista ja guardada") : t("community.save_to_my_lists", "Guardar a les meves llistes")
                  }
                >
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{
                      fontVariationSettings: (isSaved || localSaved) ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    bookmark
                  </span>
                </button>
              )}
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
              t("community.no_description_available", "Sense descripció disponible per aquesta ruta.")}
          </p>
          <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1 text-slate-400">
              <span className="material-symbols-outlined text-sm">
                location_on
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {t("community.points_count", "{{count}} Punts", { count: lista.pois?.length || 0 })}
              </span>
            </div>
            <span className="text-pink-500 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
              {t("community.view_map", "Veure mapa →")}
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

  // Desktop search from global SearchContext (Header)
  const { searchQuery: desktopSearchQuery } = useSearch();

  const [view, setView] = useState("feed"); // feed, activity, search, lists
  const [publicaciones, setPublicaciones] = useState([]);
  const [actividad, setActividad] = useState([]);
  const [userLists, setUserLists] = useState([]);
  const [loading, setLoading] = useState(true);
  // Local search query for mobile input
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [amigos, setAmigos] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [publicListas, setPublicListas] = useState([]);
  const [friendsListas, setFriendsListas] = useState([]);
  const [loadingListas, setLoadingListas] = useState(false);

  // Active query: desktop context or mobile local
  const searchQuery = desktopSearchQuery || mobileSearchQuery;

  const [showPostModal, setShowPostModal] = useState(false);
  const [postAttachedRoute, setPostAttachedRoute] = useState(null); // lista object attached to post
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
    setLoadingListas(true);
    try {
      const [pubRes, friendRes] = await Promise.all([
        getListas(usuarioLogged?.id_usuario),
        usuarioLogged ? getFriendsListas(usuarioLogged.id_usuario) : Promise.resolve({ data: [] })
      ]);
      if (pubRes.success) setPublicListas(pubRes.data || []);
      if (friendRes.success) setFriendsListas(friendRes.data || []);
    } catch (error) {
      console.error("Error loading lists:", error);
    } finally {
      setLoadingListas(false);
    }
  };



  const handleSearch = async (q) => {
    setMobileSearchQuery(q);
    if (q.length < 2) {
      setSearchResults([]);
      if (view === "search") setView("feed");
      return;
    }

    setView("search");
    try {
      const res = await searchUsers(q);
      if (res.success) setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Also trigger search when desktopSearchQuery changes
  useEffect(() => {
    if (desktopSearchQuery.trim().length >= 2) {
      setView("search");
      searchUsers(desktopSearchQuery)
        .then((res) => { if (res.success) setSearchResults(res.data); })
        .catch(console.error);
    } else if (!desktopSearchQuery && !mobileSearchQuery) {
      setSearchResults([]);
      if (view === "search") setView("feed");
    }
  }, [desktopSearchQuery]);

  useEffect(() => {
    cargarPublicaciones();
    cargarActividad();
    cargarListas();
    if (usuarioLogged) {
      getAmigos(usuarioLogged.id_usuario).then((r) => setAmigos(r.data || []));
      getUsuarioListas(usuarioLogged.id_usuario).then((r) => setUserLists(r.data || []));
    }

    socket.on("nueva_publicacion", cargarPublicaciones);
    socket.on("nuevo_comentario", cargarPublicaciones);

    return () => {
      socket.off("nueva_publicacion");
      socket.off("nuevo_comentario");
    };
  }, []);


  const handleCreatePost = async () => {
    // Need at least text, photo, or attached route
    if (!newPost.texto && !selectedFile && !postAttachedRoute) return;

    // --- FILTRO DE PALABRAS RESTRINGIDAS ---
    const restrictedWords = [
      "mierda", "puta", "puto", "gilipollas", "cabron", "cabrón", "cojones", "joder", "hostia", "follar",
      "pendejo", "zorra", "maricon", "maricón", "idiota", "estupido", "estúpido", "imbecil", "imbécil",
      "basura", "asco", "fuck", "shit", "bitch"
    ];

    const foundWord = restrictedWords.find(word =>
      newPost.texto.toLowerCase().includes(word.toLowerCase())
    );

    if (foundWord) {
      setToast({
        message: t("community.alerts.restricted_word", "Opa! El teu missatge conté paraules no permeses (ex: \"{{word}}\"). Per favor, mantingues el respecte a la comunitat.", { word: foundWord }),
        type: "warning"
      });
      return;
    }
    // ----------------------------------------

    try {
      let fotoUrl = "";
      if (selectedFile) {
        const fileToUpload = await compressImage(selectedFile);
        const uploadRes = await uploadFotoComunidad(fileToUpload);
        fotoUrl = `${import.meta.env.VITE_API_URL || ""}${uploadRes.url}`;
      }

      // If a route is attached, fetch its full data (with POIs) then make it public
      if (postAttachedRoute) {
        try {
          const fullLista = await getListaById(postAttachedRoute.id_lista);
          const listaData = fullLista.data || fullLista;
          await updateLista(postAttachedRoute.id_lista, {
            nombre: listaData.nombre,
            descripcion: listaData.descripcion,
            visibilidad: "public",
            imagen_url: listaData.imagen_url || null,
            pois: (listaData.pois || []).map((p) => ({ id_poi: p.id_poi || p.id })),
          });
          setUserLists((prev) =>
            prev.map((l) =>
              l.id_lista === postAttachedRoute.id_lista ? { ...l, visibilidad: "public" } : l
            )
          );
        } catch (routeErr) {
          console.error("Error making route public:", routeErr);
          setToast({ message: t("community.toast.share_error", "Error al compartir la ruta. Intenta-ho de nou."), type: "error" });
          return;
        }
      }

      const finalText = [
        newPost.texto,
        postAttachedRoute ? `[lista:${postAttachedRoute.id_lista}]` : "",
      ].filter(Boolean).join(" ") ||
        (postAttachedRoute ? t("community.shared_route_post", "He compartit la ruta \"{{name}}\" a la comunitat! 🗺️ [lista:{{id}}]", { name: postAttachedRoute.nombre, id: postAttachedRoute.id_lista }) : "");

      await createPublicacion({
        id_usuario: usuarioLogged.id_usuario,
        nombre_usuario: usuarioLogged.nombre,
        foto_perfil: usuarioLogged.foto_perfil || null,
        texto: finalText,
        foto: fotoUrl,
        tipo_publicacion: newPost.tipo_publicacion,
      });

      const routeName = postAttachedRoute?.nombre;
      setNewPost({ texto: "", tipo_publicacion: "popular" });
      setSelectedFile(null);
      setPreviewUrl("");
      setPostAttachedRoute(null);
      setShowPostModal(false);

      if (routeName) {
        setToast({ message: t("community.toast.shared_success", "Ruta \"{{name}}\" compartida a la Comunitat! 🎉", { name: routeName }), type: "success" });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: t("community.toast.publish_error", "Error al publicar. Intenta-ho de nou."), type: "error" });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f0f4f9] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-display transition-colors duration-300 pb-32">
      <Header />
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="sticky top-0 md:top-[80px] z-40 px-6 pt-4 pb-4 bg-[#f0f4f9]/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 md:mt-[80px]">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* Search Bar — mobile only, desktop uses the Header */}
          <div className="relative group md:hidden">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              type="text"
              value={mobileSearchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t("community.searchPlaceholder", "Busca amics o llistes...")}
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
              onClick={() => setView("listas")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium tracking-tight transition-all border ${view === "listas" ? "bg-primary text-primary-text border-transparent shadow-md shadow-primary/20" : "bg-white dark:bg-slate-950 text-slate-400 border-gray-100 dark:border-white/5 hover:border-gray-200"}`}
            >
              <span
                className="material-symbols-outlined text-sm"
                style={{
                  fontVariationSettings: view === "listas" ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                list_alt
              </span>
              {t("community.tabs.listas", "Llistes")}
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
              {/* Posts */}
              {loading ? (
                <div className="text-center py-20 opacity-30 font-bold uppercase tracking-widest text-xs">
                  {t("community.loading_posts", "Carregant publicacions...")}
                </div>
              ) : (
                publicaciones.map((pub, idx) => (
                  <PostCard
                    key={pub.id_publicacion || pub._id || pub.id || idx}
                    pub={pub}
                    onComentarioCreado={cargarPublicaciones}
                    userLists={userLists}
                  />
                ))
              )}
            </div>
          )}



          {view === "listas" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-primary mb-6">
                  {t("community.friends_lists", "Llistes dels amics")}
                </h3>
                {loadingListas ? (
                  <div className="text-center py-10 opacity-30 font-bold uppercase tracking-widest text-xs">
                    {t("community.loading_lists", "Carregant llistes...")}
                  </div>
                ) : friendsListas.length === 0 ? (
                  <div className="text-center py-10 opacity-30">
                    {t("community.no_friends_lists", "No hi ha llistes d'amics")}
                  </div>
                ) : (
                  friendsListas.map((lista) => (
                    <ListaCard key={lista.id_lista} lista={lista} userLists={userLists} onListaChanged={cargarListas} />
                  ))
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-tight text-primary mb-6">
                  {t("community.public_lists", "Llistes Públiques")}
                </h3>
                {loadingListas ? (
                  <div className="text-center py-10 opacity-30 font-bold uppercase tracking-widest text-xs">
                    {t("community.loading_lists", "Carregant llistes...")}
                  </div>
                ) : publicListas.length === 0 ? (
                  <div className="text-center py-10 opacity-30">
                    {t("community.no_public_lists", "No hi ha llistes públiques")}
                  </div>
                ) : (
                  publicListas.map((lista) => (
                    <ListaCard key={lista.id_lista} lista={lista} userLists={userLists} onListaChanged={cargarListas} />
                  ))
                )}
              </div>
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
                      {t("community.activity.created_post", "ha creat una nova publicació")}
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


          {view === "search" && (
            <div className="animate-in fade-in zoom-in-95 duration-300 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
                {t("community.search_results", "Resultats per a \"{{query}}\"", { query: searchQuery })}
              </h3>
              {searchResults.length === 0 ? (
                <div className="text-center py-20 opacity-30">
                  {t("community.no_users_found", "No s'han trobat usuaris")}
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
          onClick={() => { setShowPostModal(false); setPostAttachedRoute(null); }}
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
                onClick={() => { setShowPostModal(false); setPostAttachedRoute(null); }}
                className="text-slate-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Attached route preview */}
            {postAttachedRoute && (
              <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700/40">
                <span className="material-symbols-outlined text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>route</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 truncate">{postAttachedRoute.nombre}</p>
                  <p className="text-[10px] text-emerald-500">
                    {t("community.attach_route_info", "{{count}} punts · Es farà pública", { count: postAttachedRoute.pois?.length || 0 })}
                  </p>
                </div>
                <button onClick={() => setPostAttachedRoute(null)} className="text-emerald-400 hover:text-emerald-600">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            )}

            <textarea
              value={newPost.texto}
              onChange={(e) => setNewPost({ ...newPost, texto: e.target.value })}
              placeholder={postAttachedRoute ? t("community.add_comment_on_route", "Afegeix un comentari sobre \"{{name}}\"...", { name: postAttachedRoute.nombre }) : t("community.explain_something", "Explica alguna cosa...")}
              className="w-full bg-gray-50 dark:bg-white/5 rounded-2xl p-4 text-sm focus:outline-none min-h-[200px] resize-none border border-gray-100 dark:border-white/5"
            />

            {/* Action buttons row */}
            <div className="mt-4 flex gap-2">
              {/* Photo button — hidden when a route is attached */}
              {!postAttachedRoute && (
                <button
                  onClick={() => fileInputRef.current.click()}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-display font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    selectedFile
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "bg-gray-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-white/20"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">image</span>
                  {selectedFile ? t("community.photo_attached", "Foto adjunta") : t("community.photo", "Foto")}
                </button>
              )}

              {/* Route button — hidden when a photo is selected */}
              {!selectedFile && usuarioLogged && (
                <button
                  onClick={() => {
                    document.getElementById("route-picker-dropdown").classList.toggle("hidden");
                  }}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    postAttachedRoute
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700"
                      : "bg-gray-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-white/20"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">route</span>
                  {postAttachedRoute ? t("community.route_attached", "Ruta adjunta ✓") : t("community.attach_route", "Adjuntar Ruta")}
                </button>
              )}
            </div>

            {/* Route picker dropdown */}
            {usuarioLogged && (
              <div id="route-picker-dropdown" className="hidden mt-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
                {userLists.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    {t("community.no_routes_created", "No tens cap ruta creada.")}{" "}
                    <button onClick={() => navigate("/create-list")} className="text-primary font-bold hover:underline">{t("community.create_route", "Crear ruta")}</button>
                  </div>
                ) : (
                  <div className="max-h-40 overflow-y-auto">
                    {userLists.map((lista) => (
                      <button
                        key={lista.id_lista}
                        onClick={() => {
                          setPostAttachedRoute(lista);
                          document.getElementById("route-picker-dropdown").classList.add("hidden");
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-white/10 transition-all border-b border-gray-100 dark:border-white/5 last:border-0 ${
                          postAttachedRoute?.id_lista === lista.id_lista ? "bg-emerald-50 dark:bg-emerald-900/20" : ""
                        }`}
                      >
                        <span className="material-symbols-outlined text-slate-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>route</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate text-slate-800 dark:text-white">{lista.nombre}</p>
                          <p className="text-[10px] text-slate-400">{t("community.points_count", "{{count}} punts", { count: lista.pois?.length || 0 })}</p>
                        </div>
                        {lista.visibilidad === "public" && (
                          <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">{t("collections.filterPublic", "Pública")}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files[0];
                if (f) { setSelectedFile(f); setPreviewUrl(URL.createObjectURL(f)); }
              }}
            />
            {previewUrl && (
              <div className="relative mt-4 rounded-xl overflow-hidden aspect-video border border-gray-100">
                <img src={previewUrl} className="w-full h-full object-cover" />
                <button
                  onClick={() => { setSelectedFile(null); setPreviewUrl(""); }}
                  className="absolute top-2 right-2 bg-black/50 text-white w-6 h-6 rounded-full flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            )}
            <button
              onClick={handleCreatePost}
              disabled={!newPost.texto && !selectedFile && !postAttachedRoute}
              className="w-full mt-6 bg-primary text-white dark:text-black py-4 rounded-2xl font-display font-semibold shadow-xl shadow-primary/20 active:scale-95 transition-transform disabled:opacity-40"
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

      {/* Alertas con diseño (Toast) con z-index superior al modal */}
      {toast && (
        <div className="fixed inset-0 z-[11000] pointer-events-none flex items-end justify-center pb-24">
          <div className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default Community;
