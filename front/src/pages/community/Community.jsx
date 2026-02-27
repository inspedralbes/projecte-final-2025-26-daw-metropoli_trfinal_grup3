import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../layouts/Navbar";
import {
  getPublicaciones,
  createPublicacion,
} from "../../../services/communicationManager";
import socket from "../../../services/socketManager"; // Importamos la antena de radio

const Community = () => {
  const [activeTab, setActiveTab] = useState("Recent");
  const tabs = ["Recent", "Official", "Fan Zone", "Popular"];

  // Estado para publicaciones de la API
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para el modal de nueva publicación
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    texto: "",
    foto: "",
    tipo_publicacion: "popular",
    ubicacion: "",
  });

  // Extraemos la función de descarga para poder reusarla
  const cargarPublicacionesDesdeBD = async () => {
    try {
      const data = await getPublicaciones();
      setPublicaciones(data.data || []);
    } catch (err) {
      console.error("Error fetching publicaciones:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // GET: Cargar publicaciones al montar el componente
  useEffect(() => {
    // 1. Bajamos al entrar a la pantalla
    cargarPublicacionesDesdeBD();

    // 2. Encendemos la radio: Si alguien publica algo nuevo, actualizamos el feed
    socket.on("nueva_publicacion", (nuevaPub) => {
      console.log("📡 Ha llegado un post nuevo desde el servidor!", nuevaPub);
      cargarPublicacionesDesdeBD();
    });

    // 3. Escuchamos si alguien ha cambiado su foto o nombre de perfil
    socket.on("perfil_actualizado", (usuarioActualizado) => {
      console.log("📡 Un usuario ha cambiado su perfil:", usuarioActualizado);

      // En vez de bajar todas las publicaciones de nuevo (costoso),
      // recorremos las que ya tenemos en memoria y actualizamos solo las de ese usuario
      setPublicaciones((listaActual) =>
        listaActual.map((publicacion) => {
          // Si la publicación es del usuario que se ha editado, actualizamos sus datos
          if (
            String(publicacion.id_usuario) ===
            String(usuarioActualizado.id_usuario)
          ) {
            return {
              ...publicacion,
              nombre_usuario: usuarioActualizado.nuevo_nombre,
              foto_perfil_usuario: usuarioActualizado.nueva_foto,
            };
          }
          // Si no, la dejamos exactamente igual
          return publicacion;
        }),
      );
    });

    // 4. Cuando nos vayamos de la vista Comunidad, apagamos las dos radios
    return () => {
      socket.off("nueva_publicacion");
      socket.off("perfil_actualizado");
    };
  }, []);

  // POST: Crear nueva publicación
  const handleCreate = async () => {
    if (!newPost.texto && !newPost.foto) return;
    try {
      await createPublicacion({
        id_usuario: 1, // TODO: reemplazar con el id del usuario autenticado
        texto: newPost.texto,
        foto: newPost.foto,
        tipo_publicacion: newPost.tipo_publicacion,
        ubicacion: newPost.ubicacion,
      });
      // setPublicaciones(prev => [data.data, ...prev]); -> Nos saltamos añadirlo manualmente
      // Porque ahora la Radio (Socket) nos avisará un milisegundo despues y la app recarga el Post sola
      setNewPost({
        texto: "",
        foto: "",
        tipo_publicacion: "popular",
        ubicacion: "",
      });
      setShowModal(false);
    } catch (err) {
      console.error("Error creando publicación:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-white font-display select-none transition-colors duration-300 md:pl-16">
      {/* Header */}
      <div className="w-full pt-6 px-5 pb-2 z-20 flex justify-between items-center transition-colors shrink-0 touch-none md:max-w-6xl md:mx-auto">
        <div className="md:hidden flex items-center gap-2">
          <Link to="/home">
            <img
              src="/logo/logo1.png"
              alt="Circuit de Catalunya"
              className="h-12 w-auto object-contain block dark:hidden"
            />
            <img
              src="/logo/logo.png"
              alt="Circuit de Catalunya"
              className="h-12 w-auto object-contain hidden dark:block"
            />
          </Link>
        </div>
        <h1 className="hidden md:block text-2xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white">
          Community <span className="text-primary">Feed</span>
        </h1>
        <Link
          to="/profile"
          className="w-10 h-10 rounded-full border-2 border-primary p-0.5 overflow-hidden shadow-sm"
        >
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="overflow-y-auto no-scrollbar pb-24 md:pb-10 px-5 pt-2 md:max-w-6xl md:mx-auto">
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8 lg:items-start">
          {/* Main Feed */}
          <div>
            {/* Tabs */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-5 px-5 mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[10px] font-bold px-5 py-2.5 rounded-full uppercase tracking-wider shrink-0 cursor-pointer transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                      : "bg-white dark:bg-[#1e1e1e] text-slate-400 dark:text-white/40 border border-slate-100 dark:border-white/5 shadow-sm dark:shadow-none hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {loading && (
                <p className="text-center text-slate-400 dark:text-white/40 text-sm py-8">
                  Cargando publicaciones...
                </p>
              )}
              {error && (
                <p className="text-center text-red-400 text-sm py-8">
                  Error: {error}
                </p>
              )}
              {!loading && !error && publicaciones.length === 0 && (
                <p className="text-center text-slate-400 dark:text-white/40 text-sm py-8">
                  No hay publicaciones todavía. ¡Sé el primero!
                </p>
              )}
              {!loading &&
                !error &&
                publicaciones.map((pub) => (
                  <article
                    key={pub.id_publicacion}
                    className="bg-white dark:bg-[#1e1e1e] rounded-[24px] shadow-sm dark:shadow-none border border-slate-100 dark:border-white/5 overflow-hidden transition-all"
                  >
                    <div className="p-5 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-primary p-0.5 shrink-0 overflow-hidden">
                        <img
                          alt="User"
                          className="w-full h-full object-cover rounded-full"
                          src={`https://i.pravatar.cc/150?u=${pub.id_usuario}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-slate-800 dark:text-white">
                            Usuario #{pub.id_usuario}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-white/40 font-bold">
                            {pub.fecha_publicacion
                              ? new Date(
                                  pub.fecha_publicacion,
                                ).toLocaleDateString()
                              : ""}
                          </span>
                        </div>
                        {pub.texto && (
                          <p className="text-sm text-slate-600 dark:text-white/70 leading-relaxed mb-3 font-medium">
                            {pub.texto}
                          </p>
                        )}
                      </div>
                    </div>
                    {pub.foto && (
                      <div className="px-5 pb-2">
                        <img
                          alt="Publicación"
                          className="w-full h-56 object-cover rounded-[16px] shadow-md"
                          src={pub.foto}
                        />
                      </div>
                    )}
                    <div className="p-4 flex items-center gap-6 border-t border-slate-100 dark:border-white/5">
                      <button className="flex items-center gap-1.5 text-slate-400 dark:text-white/40 hover:text-primary transition-colors cursor-pointer group">
                        <span className="material-symbols-outlined text-[20px] group-active:scale-125 transition-transform">
                          favorite
                        </span>
                        <span className="text-xs font-bold">
                          {pub.likes ?? 0}
                        </span>
                      </button>
                      <button className="flex items-center gap-1.5 text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white ml-auto cursor-pointer transition-colors">
                        <span className="material-symbols-outlined text-[20px]">
                          share
                        </span>
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          </div>

          {/* Right Sidebar — desktop only */}
          <div className="hidden lg:flex flex-col gap-5 sticky top-6">
            {/* Group QR Invite */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-[24px] border border-slate-100 dark:border-white/5 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-1 bg-primary rounded-full"></div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/60">
                  Your Group
                </h3>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    qr_code_2
                  </span>
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm">
                    Invite Friends
                  </p>
                  <p className="text-xs text-slate-400">
                    Share your group QR code
                  </p>
                </div>
              </div>
              <button className="w-full bg-primary text-white font-bold py-2.5 rounded-xl text-sm shadow-lg shadow-primary/30 hover:bg-[#ff1e3c] transition-colors">
                Show QR Code
              </button>
            </div>

            {/* Trending Topics */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-[24px] border border-slate-100 dark:border-white/5 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-1 bg-primary rounded-full"></div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/60">
                  Trending
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  "#SpanishGP",
                  "#F1 2026",
                  "#Qualifying",
                  "#CatalunyaCircuit",
                  "#FanZone",
                ].map((tag, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">
                      {tag}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {(Math.random() * 10 + 1).toFixed(1)}k posts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active fans */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-[24px] border border-slate-100 dark:border-white/5 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-1 bg-primary rounded-full"></div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/60">
                  Online Now
                </h3>
              </div>
              <div className="flex -space-x-2 mb-3">
                {[12, 15, 20, 25, 30].map((img) => (
                  <img
                    key={img}
                    src={`https://i.pravatar.cc/40?img=${img}`}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900"
                    alt="User"
                  />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-primary flex items-center justify-center">
                  <span className="text-[8px] font-black text-white">+48</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-700 dark:text-white">
                  53 fans
                </span>{" "}
                at the circuit right now
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAB — new post */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-5 md:bottom-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/40 z-[80] active:scale-90 transition-transform cursor-pointer hover:bg-[#ff1e3c]"
      >
        <span className="material-symbols-outlined text-3xl font-bold">
          add
        </span>
      </button>

      {/* QR tab — mobile only */}
      <div className="md:hidden fixed left-0 top-1/2 -translate-y-1/2 w-12 h-24 bg-white/10 backdrop-blur-md rounded-r-2xl border-y border-r border-white/20 z-50 flex items-center justify-center shadow-lg cursor-pointer hover:bg-white/20 transition-all active:scale-95 group">
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
          <span className="material-symbols-outlined text-white text-xl">
            qr_code_2
          </span>
        </div>
      </div>

      {/* Modal nueva publicación */}
      {/* =====================================================================
                IMPORTANTE PARA EL BACK — NO ELIMINAR ESTAS PARTES AL REDISEÑAR:

                1. `showModal` controla si el modal está visible.
                   - Abrir modal:  onClick={() => setShowModal(true)}
                   - Cerrar modal: onClick={() => setShowModal(false)}

                2. `newPost` es el objeto que se envía al back. Campos:
                   - texto:            string  — OBLIGATORIO si no hay foto
                   - foto:             string  — URL de imagen, OPCIONAL
                   - tipo_publicacion: string  — OBLIGATORIO. Valores: 'popular' | 'oficial' | 'fanzone'
                   - ubicacion:        string  — OPCIONAL

                   Cada input/select debe actualizar newPost así:
                   onChange={(e) => setNewPost({ ...newPost, NOMBRE_CAMPO: e.target.value })}

                3. El botón de envío DEBE tener: onClick={handleCreate}
                   handleCreate hace el POST a /api/comunidad via communicationManager.

                4. id_usuario está hardcodeado como 1 en handleCreate.
                   TODO: reemplazar con el id del usuario autenticado cuando haya login.
                   Grasias :D
            ===================================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-6 md:pb-0">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-slate-800 dark:text-white text-lg">
                Nueva publicación
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-slate-500 text-lg">
                  close
                </span>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Campo texto — newPost.texto — OBLIGATORIO si no hay foto */}
              <div>
                <textarea
                  value={newPost.texto}
                  onChange={(e) =>
                    setNewPost({ ...newPost, texto: e.target.value })
                  }
                  placeholder="¿Qué está pasando en el circuito? 🏎️"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-primary rounded-2xl p-4 text-base text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none h-28"
                />
              </div>

              <div className="space-y-4">
                {/* Campo foto — newPost.foto — OPCIONAL, URL de imagen */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400">
                      link
                    </span>
                  </div>
                  <input
                    type="text"
                    value={newPost.foto}
                    onChange={(e) =>
                      setNewPost({ ...newPost, foto: e.target.value })
                    }
                    placeholder="URL de la foto (opcional)"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors"
                  />
                </div>

                {/* Campo tipo_publicacion — newPost.tipo_publicacion — OBLIGATORIO */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400">
                      category
                    </span>
                  </div>
                  <select
                    value={newPost.tipo_publicacion}
                    onChange={(e) =>
                      setNewPost({
                        ...newPost,
                        tipo_publicacion: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-10 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors appearance-none"
                  >
                    <option value="popular">Popular</option>
                    <option value="oficial">Oficial</option>
                    <option value="fanzone">Fan Zone</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón enviar — DEBE mantener onClick={handleCreate} */}
              <button
                onClick={handleCreate}
                className="w-full mt-2 bg-primary text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-primary/30 active:scale-95 transition-all hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">send</span>
                Publicar
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
