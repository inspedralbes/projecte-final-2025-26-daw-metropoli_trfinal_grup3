import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../../layouts/Header';
import Navbar from '../../layouts/Navbar';
import { 
  getUsuarioListas, 
  deleteLista, 
  updateLista,
  uploadListaImage 
} from '../../services/communicationManager';

// Mock data
const mockRoutes = [
  {
    id: 1,
    location: "Gràcia, Barcelona",
    title: "Tapes per Gràcia",
    price: "15€ / aprox",
    image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800&q=80",
  },
  {
    id: 2,
    location: "Gòtic, Barcelona",
    title: "Cafès secrets",
    price: "10€ / aprox",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  },
  {
    id: 3,
    location: "Poblenou, Barcelona",
    title: "Urbex BCN",
    price: "Gratis",
    image: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800&q=80",
  },
  {
    id: 4,
    location: "Montjuïc, Barcelona",
    title: "Vistes de nit",
    price: "Gratis",
    image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&q=80",
  }
];

const Collections = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [listas, setListas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    descripcion: "",
    visibilidad: "private",
    imagen_url: "",
    pois: []
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("usuario");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchUserLists(parsedUser.id_usuario);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserLists = async (userId) => {
    try {
      setLoading(true);
      const res = await getUsuarioListas(userId);
      if (res.success) {
        setListas(res.data);
      } else {
        setError(t("collections.errorLoading", "No se pudieron cargar tus colecciones."));
      }
    } catch (err) {
      console.error("Error fetching lists:", err);
      setError(t("collections.errorConnection", "Error de conexión con el servidor."));
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = listas.filter(route =>
    route.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (route.descripcion && route.descripcion.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEditClick = (route) => {
    setSelectedRoute(route);
    setEditForm({
      nombre: route.nombre,
      descripcion: route.descripcion || "",
      visibilidad: route.visibilidad,
      imagen_url: route.imagen_url || "",
      pois: [...(route.pois || [])]
    });
    setIsEditModalOpen(true);
  };

  const handleRemovePoi = (idPoi) => {
    setEditForm(prev => ({
      ...prev,
      pois: prev.pois.filter(p => p.id_poi !== idPoi)
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsSaving(true);
      // Usamos el ID de la ruta seleccionada para la subida
      const res = await uploadListaImage(selectedRoute.id_lista, file);
      if (res.success) {
        setEditForm(prev => ({ ...prev, imagen_url: res.data.imagen_url }));
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRoute = async () => {
    if (!editForm.nombre.trim()) return;
    
    try {
      setIsSaving(true);
      // Auditoría de datos: Enviamos el objeto mapeado
      const updateData = {
        nombre: editForm.nombre,
        descripcion: editForm.descripcion,
        visibilidad: editForm.visibilidad,
        imagen_url: editForm.imagen_url,
        pois: editForm.pois.map(p => p.id_poi) // Backend espera array de IDs
      };

      const res = await updateLista(selectedRoute.id_lista, updateData);
      
      if (res.success) {
        // Actualizamos estado local
        const updatedListas = listas.map(l => 
          l.id_lista === selectedRoute.id_lista 
          ? { ...l, ...editForm } 
          : l
        );
        setListas(updatedListas);
        setIsEditModalOpen(false);
      } else {
        throw new Error(res.message || "Error al actualizar");
      }
      
    } catch (err) {
      console.error("Error updating route:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f0f4f9] dark:bg-slate-950 text-[#1a1a1a] dark:text-white font-display p-4 md:pl-20 pb-24 transition-colors duration-300">
      <Header />
      {/* Top spacing for header */}
      <div className="pt-28">

      {/* Search Bar */}
      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>
        <input 
          type="text" 
          placeholder={t("collections.search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
        />
      </div>

      {/* Pills (Static for design matching) */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        <button className="flex items-center gap-2 bg-black dark:bg-primary text-white dark:text-primary-text px-4 py-2 rounded-full whitespace-nowrap">
          <img src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=100" alt="Gràcia" className="w-6 h-6 rounded-full object-cover" />
          Gràcia
        </button>
        <button className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-6 py-2 rounded-full whitespace-nowrap border border-gray-200 dark:border-gray-700">
          Gòtic
        </button>
        <button className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-6 py-2 rounded-full whitespace-nowrap border border-gray-200 dark:border-gray-700">
          Poblenou
        </button>
      </div>

      {/* Route Cards List / Loading / Empty / No Session */}
      <div className="flex flex-col gap-4">
        {!user ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-fade-in">
            <div className="w-24 h-24 bg-white/50 dark:bg-white/5 rounded-full flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-xl">
              <span className="material-symbols-outlined text-4xl opacity-40">lock</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{t("collections.noSessionTitle", "Inicia sesión")}</h3>
              <p className="text-sm text-gray-500 max-w-[250px] mx-auto">
                {t("collections.noSessionDesc", "Necessites iniciar sessió per veure les teves col·leccions personals.")}
              </p>
            </div>
            <Link 
              to="/login"
              className="bg-black dark:bg-primary text-white dark:text-primary-text px-8 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              {t("auth.login", "Iniciar sessió")}
            </Link>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            <p className="text-xs font-bold uppercase tracking-widest opacity-40">{t("common.loading", "Carregant...")}</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-3xl text-center">
            <span className="material-symbols-outlined text-3xl mb-2">error</span>
            <p className="text-sm font-bold">{error}</p>
          </div>
        ) : filteredRoutes.length > 0 ? (
          filteredRoutes.map(route => (
            <div 
              key={route.id_lista} 
              className="relative w-full h-64 md:h-72 rounded-[32px] overflow-hidden shadow-lg group cursor-pointer"
            >
              {/* Background Image (Using placeholder or real image if exists) */}
              <img 
                src={route.imagen_url 
                  ? (route.imagen_url.startsWith('http') ? route.imagen_url : `http://localhost:3000${route.imagen_url}`) 
                  : (route.image || `https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&q=80`)} 
                alt={route.nombre} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              
              {/* Bottom Info */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="flex flex-col space-y-1">
                  <h3 className="text-white text-2xl font-black leading-tight italic uppercase tracking-tighter">
                    {route.nombre}
                  </h3>
                  <p className="text-white/60 text-xs font-medium line-clamp-1 max-w-[200px]">
                    {route.descripcion || t("createList.noDesc", "Sense descripció")}
                  </p>
                </div>
                
                {/* Pencil Button (Non-functional as requested) */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(route);
                  }}
                  className="bg-white dark:bg-primary text-black dark:text-primary-text w-12 h-12 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
                  aria-label="Edit route"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    edit
                  </span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-fade-in">
             <div className="w-24 h-24 bg-white/50 dark:bg-white/5 rounded-full flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-xl">
              <span className="material-symbols-outlined text-4xl opacity-40">map</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{t("collections.emptyTitle", "Cap ruta trobada")}</h3>
              <p className="text-sm text-gray-500 max-w-[250px] mx-auto">
                {searchQuery 
                  ? t("collections.noSearchMatch", "No hi ha rutes que coincideixin amb la teva cerca.")
                  : t("collections.noLists", "Encara no has creat cap ruta personal.")}
              </p>
            </div>
            {!searchQuery && (
              <Link 
                to="/create-list"
                className="bg-black dark:bg-primary text-white dark:text-primary-text px-8 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                {t("createList.title", "Crear llista")}
              </Link>
            )}
          </div>
        )}
      </div>{/* end cards */}
      </div>{/* end pt-28 */}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsEditModalOpen(false)}
          ></div>
          
          <div className="relative w-full max-w-lg bg-black rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20 font-display">
            {/* Header */}
            <div className="p-8 pb-4 flex justify-between items-center">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                {t("collections.editTitle", "Editar Ruta")}
              </h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-8 pt-0 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Name & Desc */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">
                    {t("createList.nameLabel", "Nombre")}
                  </label>
                  <input 
                    type="text"
                    value={editForm.nombre}
                    onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-white transition-colors font-medium text-white"
                    placeholder="Nombre de la ruta..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">
                    {t("createList.descLabel", "Descripción")}
                  </label>
                  <textarea 
                    value={editForm.descripcion}
                    onChange={(e) => setEditForm({...editForm, descripcion: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-white transition-colors font-medium min-h-[100px] resize-none text-white"
                    placeholder="Añade una descripción..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">
                    {t("collections.imageLabel", "Imagen de Portada")}
                  </label>
                  
                  <div className="relative group">
                    {editForm.imagen_url ? (
                      <div className="relative rounded-2xl overflow-hidden h-40 border border-white/10 group">
                        <img 
                          src={editForm.imagen_url.startsWith('http') ? editForm.imagen_url : `http://localhost:3000${editForm.imagen_url}`} 
                          alt="Preview" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <label className="cursor-pointer bg-white text-black p-3 rounded-full hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">add_a_photo</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                          </label>
                          <button 
                            onClick={() => setEditForm({...editForm, imagen_url: ""})}
                            className="bg-red-500 text-white p-3 rounded-full hover:scale-110 transition-transform"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <span className="material-symbols-outlined text-4xl text-white/20 mb-2">image</span>
                          <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                            {t("collections.uploadImage", "Escoger de galería")}
                          </p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Visibility */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">
                  {t("settings.privacySecurity", "Visibilidad")}
                </label>
                <div className="flex gap-3">
                  {['public', 'private'].map((v) => (
                    <button
                      key={v}
                      onClick={() => setEditForm({...editForm, visibilidad: v})}
                      className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all border ${
                        editForm.visibilidad === v 
                        ? 'bg-white border-white text-black' 
                        : 'bg-transparent border-white/10 text-white opacity-60'
                      }`}
                    >
                      {v === 'public' ? t("collections.visibilityPublic", "Pública") : t("collections.visibilityPrivate", "Privada")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Points List */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1 flex justify-between">
                  <span>{t("createList.selection", "Puntos")}</span>
                  <span className="text-white">{editForm.pois.length}</span>
                </label>
                <div className="space-y-2">
                  {editForm.pois.length > 0 ? (
                    editForm.pois.map((poi) => (
                      <div key={poi.id_poi} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 text-white">
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-lg">location_on</span>
                          </div>
                          <span className="font-bold text-sm">{poi.nombre}</span>
                        </div>
                        <button 
                          onClick={() => handleRemovePoi(poi.id_poi)}
                          className="text-red-500 hover:bg-red-500/10 p-2 rounded-xl transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-white/40 italic text-sm">
                      {t("createList.noPoints", "No hay puntos en esta ruta")}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-8 pt-4 flex gap-4">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-4 rounded-2xl font-bold bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                {t("common.cancel", "Cancelar")}
              </button>
              <button 
                onClick={handleUpdateRoute}
                disabled={isSaving || !editForm.nombre.trim()}
                className="flex-[2] py-4 rounded-2xl font-bold bg-white text-black shadow-lg shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isSaving ? t("common.loading", "Guardando...") : t("common.save", "Guardar Cambios")}
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default Collections;
