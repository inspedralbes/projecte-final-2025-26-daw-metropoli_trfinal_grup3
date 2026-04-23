import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../layouts/Navbar";
import {
  getPublicaciones,
  createPublicacion,
  createComentario,
  toggleLike,
  uploadFotoComunidad,
  getAmigos,
  getActividad,
  searchUsers
} from "../../services/communicationManager";
import socket from "../../services/socketManager";
import ChatModal from "../../components/community/ChatModal";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("ca-ES", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
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

// ─── Sub-componente: Card de una publicación ─────────────────────────────────
const PostCard = ({ pub, onComentarioCreado }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(pub.likes ?? 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [textoComentario, setTextoComentario] = useState("");

  const navigate = useNavigate();
  const usuarioInfo = localStorage.getItem("usuario");
  const usuarioLogged = usuarioInfo ? JSON.parse(usuarioInfo) : null;

  useEffect(() => {
    if (usuarioLogged && pub.likes_usuarios) {
      setLiked(pub.likes_usuarios.includes(String(usuarioLogged.id_usuario)));
    }
  }, [pub, usuarioLogged]);

  const handleLike = async () => {
    if (!usuarioLogged) { navigate("/login"); return; }
    if (isLikeLoading) return;
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
    <article className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden mb-6 transition-all hover:shadow-md">
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={pub.foto_perfil || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
            className="w-10 h-10 rounded-full object-cover border border-gray-100" 
            onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          />
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-none">{pub.nombre_usuario}</h4>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">{formatDate(pub.createdAt)}</span>
          </div>
        </div>
        <span className="px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {pub.tipo_publicacion}
        </span>
      </div>

      <div className="px-5 pb-4">
        <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed mb-4">{pub.texto}</p>
        {hasImage && (
          <div className="rounded-2xl overflow-hidden aspect-video border border-gray-50 dark:border-white/5">
            <img 
              src={pub.foto} 
              className="w-full h-full object-cover" 
              onError={(e) => e.target.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop"}
            />
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-t border-gray-50 dark:border-white/5 flex items-center gap-6">
        <button onClick={handleLike} className={`flex items-center gap-2 transition-colors ${liked ? 'text-primary' : 'text-slate-400'}`}>
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
            <span className="text-xs font-bold">{likesCount}</span>
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-slate-400">
            <span className="material-symbols-outlined text-xl">chat_bubble</span>
            <span className="text-xs font-bold">{pub.comentarios?.length || 0}</span>
        </button>
      </div>

      {showComments && (
        <div className="px-5 pb-5 pt-2 space-y-4 bg-gray-50/50 dark:bg-white/5">
            <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
                {pub.comentarios?.map(com => (
                    <div key={com._id} className="flex gap-2">
                        <img src={com.foto_perfil || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-6 h-6 rounded-full object-cover" />
                        <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-2xl rounded-tl-none border border-gray-100 dark:border-white/5">
                            <p className="text-[10px] font-bold text-slate-400">{com.nombre_usuario}</p>
                            <p className="text-xs text-slate-700 dark:text-slate-200">{com.texto}</p>
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
                <button type="submit" className="w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-sm">send</span>
                </button>
            </form>
        </div>
      )}
    </article>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const Community = () => {
  const navigate = useNavigate();
  const usuarioInfo = localStorage.getItem("usuario");
  const usuarioLogged = usuarioInfo ? JSON.parse(usuarioInfo) : null;

  const [view, setView] = useState("feed"); // feed, activity, search
  const [publicaciones, setPublicaciones] = useState([]);
  const [actividad, setActividad] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [amigos, setAmigos] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState({ texto: "", tipo_publicacion: "popular" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const cargarPublicaciones = async () => {
    try {
      const data = await getPublicaciones();
      setPublicaciones(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const cargarActividad = async () => {
    try {
      const res = await getActividad();
      if (res.success) setActividad(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.length < 2) {
      setSearchResults([]);
      if (view === "search") setView("feed");
      return;
    }
    setView("search");
    try {
      const res = await searchUsers(q);
      if (res.success) setSearchResults(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    cargarPublicaciones();
    cargarActividad();
    if (usuarioLogged) {
      getAmigos(usuarioLogged.id_usuario).then(r => setAmigos(r.data || []));
    }

    socket.on("nueva_publicacion", cargarPublicaciones);
    socket.on("nuevo_comentario", cargarPublicaciones);

    return () => {
      socket.off("nueva_publicacion");
      socket.off("nuevo_comentario");
    };
  }, []);

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
      setSelectedFile(null); setPreviewUrl(""); setShowPostModal(false);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-display transition-colors duration-300 pb-32">
      
      {/* ─── Premium Header ─── */}
      <div className="sticky top-0 z-50 px-6 pt-10 pb-4 bg-[#f8fafc]/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">Comunitat</h1>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setView(view === "activity" ? "feed" : "activity")}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${view === "activity" ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" : "bg-white dark:bg-slate-900 text-slate-400 border border-gray-100 dark:border-white/5"}`}
              >
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: view === "activity" ? "'FILL' 1" : "'FILL' 0" }}>bolt</span>
              </button>
              <Link to="/profile" className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
                <img src={usuarioLogged?.foto_perfil || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-full h-full object-cover" />
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Busca amics o llistes..."
              className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm group-focus-within:shadow-md"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        
        {/* Friends Horizontal List */}
        <div className="mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Amics Online</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {amigos.map(amigo => (
                    <button 
                        key={amigo.id_usuario} 
                        onClick={() => setSelectedFriend(amigo)}
                        className="flex flex-col items-center gap-2 flex-shrink-0 group"
                    >
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full border-2 border-primary p-0.5 group-active:scale-90 transition-transform">
                                <img src={amigo.foto_perfil || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-full h-full object-cover rounded-full" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full"></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 max-w-[60px] truncate">{amigo.nombre}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* ─── Main Views ─── */}
        <main>
          {view === "feed" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {loading ? (
                <div className="text-center py-20 opacity-30 font-bold uppercase tracking-widest text-xs">Carregant publicacions...</div>
              ) : (
                publicaciones.map(pub => (
                  <PostCard key={pub._id} pub={pub} onComentarioCreado={cargarPublicaciones} />
                ))
              )}
            </div>
          )}

          {view === "activity" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4">
              <h3 className="text-xl font-black text-indigo-500 italic mb-6">Activitat Recent</h3>
              {actividad.map((act, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex gap-4 items-center shadow-sm">
                  <img src={act.foto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-700 dark:text-slate-200">
                      <span className="font-bold">{act.usuario}</span> ha creat una nova publicació
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">{formatDate(act.fecha)}</p>
                  </div>
                  <span className="material-symbols-outlined text-indigo-500 opacity-30">bolt</span>
                </div>
              ))}
            </div>
          )}

          {view === "search" && (
            <div className="animate-in fade-in zoom-in-95 duration-300 space-y-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Resultats per a "{searchQuery}"</h3>
               {searchResults.length === 0 ? (
                 <div className="text-center py-20 opacity-30">No s'han trobat usuaris</div>
               ) : (
                 searchResults.map(user => (
                    <Link 
                        key={user.id_usuario}
                        to={`/profile/${user.id_usuario}`}
                        className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex gap-4 items-center hover:border-primary/30 transition-all shadow-sm"
                    >
                        <img src={user.foto_perfil || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-12 h-12 rounded-full object-cover" />
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 dark:text-white">{user.nombre}</h4>
                            <p className="text-xs text-slate-400 truncate max-w-[200px]">{user.bio || "Sense biografia"}</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                    </Link>
                 ))
               )}
            </div>
          )}
        </main>
      </div>

      {/* FAB - Add Post */}
      <button 
        onClick={() => setShowPostModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center shadow-2xl z-40 hover:scale-110 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* New Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowPostModal(false)}>
          <div className="w-full md:max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black tracking-tight italic">Nova Publicació</h2>
                <button onClick={() => setShowPostModal(false)} className="text-slate-400"><span className="material-symbols-outlined">close</span></button>
            </div>
            <textarea 
                value={newPost.texto}
                onChange={e => setNewPost({...newPost, texto: e.target.value})}
                placeholder="Explica algo..." 
                className="w-full bg-gray-50 dark:bg-white/5 rounded-2xl p-4 text-sm focus:outline-none min-h-[120px] resize-none border border-gray-100 dark:border-white/5"
            />
            <div className="flex gap-4 mt-4">
                <button 
                    onClick={() => fileInputRef.current.click()}
                    className="flex-1 py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">image</span> Imatge
                </button>
                <select 
                    value={newPost.tipo_publicacion}
                    onChange={e => setNewPost({...newPost, tipo_publicacion: e.target.value})}
                    className="flex-1 py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none px-2"
                >
                    <option value="popular">Popular</option>
                    <option value="oficial">Oficial</option>
                    <option value="fanzone">Fan Zone</option>
                </select>
            </div>
            <input ref={fileInputRef} type="file" className="hidden" onChange={e => {
                const f = e.target.files[0];
                if(f) { setSelectedFile(f); setPreviewUrl(URL.createObjectURL(f)); }
            }} />
            {previewUrl && (
                <div className="relative mt-4 rounded-xl overflow-hidden aspect-video border border-gray-100">
                    <img src={previewUrl} className="w-full h-full object-cover" />
                    <button onClick={() => {setSelectedFile(null); setPreviewUrl("");}} className="absolute top-2 right-2 bg-black/50 text-white w-6 h-6 rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-sm">close</span></button>
                </div>
            )}
            <button onClick={handleCreatePost} className="w-full mt-6 bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-transform">Publicar</button>
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
