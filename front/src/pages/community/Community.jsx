import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../layouts/Navbar";
import {
  getPublicaciones,
  createPublicacion,
  createComentario,
  createRespuesta,
  toggleLike,
  uploadFotoComunidad,
  getAmigos,
} from "../../services/communicationManager";
import socket from "../../services/socketManager";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("ca-ES", {
        day: "2-digit",
        month: "short",
      })
    : "";

/**
 * Comprime una imagen usando Canvas API para que no supere ~800KB.
 * Redimensiona a máx 1024px y exporta como JPEG al 80% de calidad.
 */
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
          if (!blob) return reject(new Error("No s'ha pogut comprimir la imatge"));
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

// ─── Sub-componente: Formulario de texto (comentario o respuesta) ──────────────
const InputComentario = ({ placeholder, onSubmit, autoFocus = false }) => {
  const [texto, setTexto] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    await onSubmit(texto.trim());
    setTexto("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
      <input
        autoFocus={autoFocus}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-white/10 dark:bg-slate-800 text-slate-800 dark:text-white text-xs rounded-full px-4 py-2 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-white/30 backdrop-blur-md"
      />
      <button
        type="submit"
        className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors shrink-0 border border-white/30"
      >
        <span className="material-symbols-outlined text-[16px]">send</span>
      </button>
    </form>
  );
};

// ─── Sub-componente: Card de una publicación ─────────────────────────────────
const PostCard = ({ pub, onComentarioCreado }) => {
  const [showComments, setShowComments] = useState(false);
  const [respondendoA, setRespondendoA] = useState(null);
  const [moderationError, setModerationError] = useState("");

  // Likes
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(pub.likes ?? 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const navigate = useNavigate();
  const usuarioInfo = localStorage.getItem("usuario");
  const usuarioLogged = usuarioInfo ? JSON.parse(usuarioInfo) : null;

  const handleLike = async () => {
    if (!usuarioLogged) {
      navigate("/login");
      return;
    }
    if (isLikeLoading) return;
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
      setLiked(res.likes_usuarios?.includes(String(usuarioLogged.id_usuario)) ?? !prevLiked);
    } catch {
      setLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleComentario = async (texto) => {
    if (!usuarioLogged) {
      navigate("/login");
      return;
    }
    setModerationError("");
    try {
      await createComentario(pub._id, {
        id_usuario: usuarioLogged.id_usuario,
        nombre_usuario: usuarioLogged.nombre,
        foto_perfil: usuarioLogged.foto_perfil || null,
        texto,
      });
      onComentarioCreado(pub._id);
    } catch (err) {
      setModerationError(err.message);
    }
  };

  const comentarios = pub.comentarios || [];
  const hasImage = !!pub.foto;

  return (
    <article 
      className={`relative w-full rounded-[3rem] overflow-hidden shadow-xl transition-all duration-500 group mb-6 ${
        hasImage ? "aspect-[4/5]" : "bg-white dark:bg-slate-900 p-8 min-h-[200px] flex flex-col justify-between border border-gray-100 dark:border-white/5"
      }`}
    >
      {hasImage ? (
        <>
          <img 
            src={pub.foto} 
            alt="Post" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-white/30 p-0.5 overflow-hidden backdrop-blur-md">
                <img src={pub.foto_perfil || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">{pub.nombre_usuario}</p>
                <p className="text-white/60 text-[10px] mt-1 uppercase tracking-widest">{formatDate(pub.createdAt)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white text-4xl font-medium tracking-tighter leading-none pointer-events-auto">
                {pub.texto}
              </h3>
              
              <div className="flex items-center gap-4 pointer-events-auto">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 transition-all ${liked ? 'bg-white text-black border-white' : 'bg-white/10 text-white'}`}
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                  <span className="text-xs font-bold">{likesCount}</span>
                </button>
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all hover:bg-white/20"
                >
                  <span className="material-symbols-outlined text-lg">chat_bubble</span>
                  <span className="text-xs font-bold">{comentarios.length}</span>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 p-0.5 overflow-hidden">
              <img src={pub.foto_perfil || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <p className="text-black dark:text-white font-bold text-sm leading-none">{pub.nombre_usuario}</p>
              <p className="text-gray-400 text-[10px] mt-1 uppercase tracking-widest">{formatDate(pub.createdAt)}</p>
            </div>
          </div>

          <p className="text-[#1a1a1a] dark:text-white text-2xl font-medium tracking-tight mb-8">
            {pub.texto}
          </p>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${liked ? 'bg-black text-white border-black' : 'bg-gray-50 dark:bg-white/5 text-gray-400 border-gray-200 dark:border-white/10'}`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
              <span className="text-xs font-bold">{likesCount}</span>
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 dark:bg-white/5 text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-100"
            >
              <span className="material-symbols-outlined text-lg">chat_bubble</span>
              <span className="text-xs font-bold">{comentarios.length}</span>
            </button>
          </div>
        </>
      )}

      {showComments && (
        <div className={`absolute inset-0 z-20 flex flex-col bg-black/90 backdrop-blur-xl transition-all duration-300 p-8 ${hasImage ? 'rounded-[3rem]' : ''}`}>
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-white font-bold text-lg">Comentaris</h4>
            <button onClick={() => setShowComments(false)} className="text-white/60 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 mb-4">
            {comentarios.length === 0 ? (
              <p className="text-white/40 text-center text-sm mt-10">Encara no hi ha comentaris.</p>
            ) : (
              comentarios.map(com => (
                <div key={com._id} className="flex gap-3">
                  <img src={com.foto_perfil || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-white text-xs font-bold">{com.nombre_usuario}</p>
                    <p className="text-white/80 text-sm">{com.texto}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <InputComentario placeholder="Escriu un comentari..." onSubmit={handleComentario} />
          {moderationError && <p className="text-red-400 text-[10px] mt-2">{moderationError}</p>}
        </div>
      )}
    </article>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const Community = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const usuarioInfo = localStorage.getItem("usuario");
  const usuarioLogged = usuarioInfo ? JSON.parse(usuarioInfo) : null;

  const [activeTab, setActiveTab] = useState("Recent");
  const tabs = [
    { key: "Recent", label: "Recents" },
    { key: "Official", label: "Oficial" },
    { key: "Fan Zone", label: "Fan Zone" },
    { key: "Popular", label: "Popular" },
  ];

  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [modalError, setModalError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);
  const [newPost, setNewPost] = useState({
    texto: "",
    foto: "",
    tipo_publicacion: "popular",
  });

  const [amigos, setAmigos] = useState([]);

  const cargarPublicaciones = async () => {
    try {
      const data = await getPublicaciones();
      setPublicaciones(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPublicaciones();

    if (usuarioLogged) {
      getAmigos(usuarioLogged.id_usuario)
        .then((data) => {
          setAmigos(data.data || []);
        })
        .catch((err) => console.error("Error al cargar amigos", err));
    }

    socket.on("nueva_publicacion", cargarPublicaciones);
    socket.on("nuevo_comentario", cargarPublicaciones);

    return () => {
      socket.off("nueva_publicacion");
      socket.off("nuevo_comentario");
    };
  }, []);

  const handleCreate = async () => {
    if (!newPost.texto && !selectedFile) return;
    setModalError("");
    try {
      let fotoUrl = "";

      if (selectedFile) {
        const fileToUpload = await compressImage(selectedFile);
        const uploadRes = await uploadFotoComunidad(fileToUpload);
        const apiBase = import.meta.env.VITE_API_URL || window.location.origin;
        fotoUrl = `${apiBase}${uploadRes.url}`;
      }

      await createPublicacion({
        id_usuario: usuarioLogged.id_usuario,
        nombre_usuario: usuarioLogged.nombre,
        foto_perfil: usuarioLogged.foto_perfil || null,
        texto: newPost.texto,
        foto: fotoUrl,
        tipo_publicacion: newPost.tipo_publicacion,
      });
      setNewPost({
        texto: "",
        foto: "",
        tipo_publicacion: "popular",
      });
      setSelectedFile(null);
      setPreviewUrl("");
      setShowModal(false);
    } catch (err) {
      setModalError(err.message);
    }
  };

  const tabFiltro = {
    Recent: null,
    Official: "oficial",
    "Fan Zone": "fanzone",
    Popular: "popular",
  };

  const publicacionesFiltradas = tabFiltro[activeTab]
    ? publicaciones.filter((p) => p.tipo_publicacion === tabFiltro[activeTab])
    : publicaciones;

  return (
    <div className="min-h-screen w-full bg-[#f0f4f9] dark:bg-slate-950 text-[#1a1a1a] dark:text-white font-display transition-colors duration-300">
      <header className="pt-12 px-6 flex justify-between items-start md:max-w-6xl md:mx-auto w-full">
        <h1 className="text-[32px] leading-[1.1] font-medium tracking-tight">
          La Comunitat <br />
          <span className="italic font-normal">està passant ara!</span>
        </h1>
        <Link
          to="/profile"
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0"
        >
          <img
            src={usuarioLogged?.foto_perfil || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </Link>
      </header>

      <div className="overflow-y-auto no-scrollbar pb-32 px-6 mt-8 md:max-w-6xl md:mx-auto">
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8 lg:items-start">
          <main>
            <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 py-2 px-6 rounded-full transition-all duration-300 border border-transparent shadow-sm whitespace-nowrap uppercase text-[10px] font-bold tracking-widest ${
                    activeTab === tab.key
                      ? "bg-white text-black"
                      : "bg-[#1a1a1a] text-white dark:bg-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-0">
              {loading && (
                <p className="text-center py-10 opacity-50">Carregant publicacions...</p>
              )}
              {!loading &&
                publicacionesFiltradas.map((pub) => (
                  <PostCard key={pub._id} pub={pub} onComentarioCreado={cargarPublicaciones} />
                ))}
            </div>
          </main>

          <aside className="hidden lg:flex flex-col gap-8 sticky top-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Tendències</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-black dark:text-white">#Barcelona</span>
                  <span className="text-[10px] text-gray-400 uppercase">120 posts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-black dark:text-white">#Urbà</span>
                  <span className="text-[10px] text-gray-400 uppercase">85 posts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-black dark:text-white">#Comunitat</span>
                  <span className="text-[10px] text-gray-400 uppercase">42 posts</span>
                </div>
              </div>
            </div>

            <div className="bg-black text-white dark:bg-white dark:text-black rounded-[2.5rem] p-8 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4">Amics</h3>
              <div className="flex -space-x-3 mb-6">
                {amigos.slice(0, 5).map((a) => (
                  <img
                    key={a.id_amigo}
                    src={a.foto_amigo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    className="w-10 h-10 rounded-full border-2 border-black dark:border-white object-cover"
                  />
                ))}
              </div>
              <p className="text-sm font-medium">Tens {amigos.length} amics connectats</p>
            </div>
          </aside>
        </div>
      </div>

      <button
        onClick={() => {
          if (!usuarioLogged) {
            setShowLoginAlert(true);
          } else {
            setShowModal(true);
          }
        }}
        className="fixed bottom-24 right-6 w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition-transform"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {showModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4" 
          onClick={() => setShowModal(false)}
        >
          <div 
            className="w-full md:max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] p-8 flex flex-col space-y-6 animate-in slide-in-from-bottom duration-300" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-medium tracking-tight">Nova publicació</h2>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <textarea 
              value={newPost.texto} 
              onChange={e => setNewPost({...newPost, texto: e.target.value})}
              placeholder="Què està passant?" 
              className="w-full bg-gray-50 dark:bg-slate-800 rounded-3xl p-6 text-lg focus:outline-none focus:ring-1 focus:ring-black/10 min-h-[150px] resize-none"
              autoFocus
            />
            
            <div className="flex gap-4">
              <button 
                onClick={() => fileInputRef.current.click()}
                className="flex-1 py-4 rounded-3xl bg-gray-100 dark:bg-white/5 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest"
              >
                <span className="material-symbols-outlined text-lg">image</span>
                Imatge
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                className="hidden" 
                onChange={e => {
                  const file = e.target.files[0];
                  if(file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); }
                }} 
              />

              <select
                value={newPost.tipo_publicacion}
                onChange={(e) => setNewPost({ ...newPost, tipo_publicacion: e.target.value })}
                className="flex-1 py-4 px-4 rounded-3xl bg-gray-100 dark:bg-white/5 font-bold text-xs uppercase tracking-widest outline-none appearance-none text-center"
              >
                <option value="popular">🔥 Popular</option>
                <option value="oficial">📢 Oficial</option>
                <option value="fanzone">🏁 Fan Zone</option>
              </select>
            </div>

            {previewUrl && (
              <div className="relative rounded-3xl overflow-hidden aspect-video border border-gray-100">
                <img src={previewUrl} className="w-full h-full object-cover" />
                <button 
                  onClick={() => {setSelectedFile(null); setPreviewUrl("");}} 
                  className="absolute top-4 right-4 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}

            {modalError && <p className="text-red-500 text-xs text-center font-bold">{modalError}</p>}

            <button 
              onClick={handleCreate} 
              className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-3xl font-bold uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-transform"
            >
              Publicar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Alerta de Inicio de Sesión */}
      {showLoginAlert && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-5 transition-opacity"
          onClick={() => setShowLoginAlert(false)}
        >
          <div
            className="bg-white dark:bg-[#12080a] rounded-[32px] shadow-2xl max-w-sm w-full p-6 text-center border border-slate-100 dark:border-white/5 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-500 text-3xl">
                lock
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
              Inicia sessió
            </h3>
            <p className="text-sm text-slate-500 dark:text-white/60 mb-6 font-medium leading-relaxed">
              Necessites iniciar sessió per compartir publicacions i unir-te a
              la conversa.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginAlert(false)}
                className="flex-1 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-white font-bold py-3.5 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel·lar
              </button>
              <button
                onClick={() => {
                  setShowLoginAlert(false);
                  navigate("/login");
                }}
                className="flex-1 bg-black dark:bg-white text-white dark:text-black font-bold py-3.5 rounded-2xl shadow-lg active:scale-95 transition-all"
              >
                Anar al login
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default Community;
