import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, List, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchResultsPanel = ({ isOpen, results, isLoading, query, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen || (!query && !isLoading)) return null;

  const hasResults = results && (
    results.usuarios?.length > 0 || 
    results.listas?.length > 0 || 
    results.lugares?.length > 0
  );

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/5 z-[100] overflow-hidden font-display"
      >
        <div className="max-h-[70vh] overflow-y-auto no-scrollbar p-2">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Buscant en el mapa...</p>
            </div>
          ) : !hasResults ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-800 dark:text-white font-bold">No hem trobat res</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Prova amb altres paraules clau</p>
            </div>
          ) : (
            <div className="space-y-6 p-2">
              {/* --- USUARIOS --- */}
              {results.usuarios?.length > 0 && (
                <section>
                  <h4 className="px-3 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-2">
                    <User size={12} /> Persones
                  </h4>
                  <div className="space-y-1">
                    {results.usuarios.map((u) => (
                      <button
                        key={u.id_usuario}
                        onClick={() => handleNavigate(`/profile/${u.id_usuario}`)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700">
                          {u.foto_perfil ? (
                            <img src={u.foto_perfil} alt={u.nombre} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <User size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">{u.nombre}</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">{u.bio || "Explorador de WeMap"}</p>
                        </div>
                        <ArrowRight size={16} className="text-gray-300 dark:text-slate-700 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* --- LISTAS / RUTAS --- */}
              {results.listas?.length > 0 && (
                <section>
                  <h4 className="px-3 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-2">
                    <List size={12} /> Rutes i Col·leccions
                  </h4>
                  <div className="space-y-1">
                    {results.listas.map((l) => (
                      <button
                        key={l.id_lista}
                        onClick={() => navigate("/map", { state: { focusedList: l } })}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700">
                          <img src={l.imagen_url} alt={l.nombre} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">{l.nombre}</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">{l.descripcion}</p>
                        </div>
                        <ArrowRight size={16} className="text-gray-300 dark:text-slate-700 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* --- LUGARES / POIS --- */}
              {results.lugares?.length > 0 && (
                <section>
                  <h4 className="px-3 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-2">
                    <MapPin size={12} /> Llocs d'interès
                  </h4>
                  <div className="space-y-1">
                    {results.lugares.map((p) => (
                      <button
                        key={p.id_poi}
                        onClick={() => handleNavigate(`/map?poi=${p.id_poi}`)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <MapPin size={20} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">{p.nombre}</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">{p.descripcion}</p>
                        </div>
                        <ArrowRight size={16} className="text-gray-300 dark:text-slate-700 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <div className="p-3 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-white/5 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-tighter font-bold">Explora amb WeMap AI</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchResultsPanel;
