import React from 'react';

/**
 * Componente premium para avatares de usuario.
 * Maneja fallbacks de imagen, URLs de API y estilos consistentes.
 */
const UserAvatar = ({ 
  user, 
  className = "w-12 h-12", 
  alt = "", 
  size = 128,
  borderColor = "border-slate-100 dark:border-primary/20"
}) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  
  // Diferentes nombres posibles para la propiedad de la foto según el modelo
  const foto = user?.foto_perfil || user?.foto || user?.avatar || user?.image;
  const nombre = user?.nombre || user?.name || user?.usuario || "User";

  const getFullUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    // Asegurarse de que no haya doble barra
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${API_URL}${cleanUrl}`;
  };

  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=random&color=fff&size=${size}&bold=true`;
  const src = getFullUrl(foto) || fallbackUrl;

  return (
    <div className={`${className} rounded-full overflow-hidden shrink-0 border-2 ${borderColor} shadow-sm bg-slate-100 dark:bg-slate-800 flex items-center justify-center`}>
      <img
        src={src}
        alt={alt || nombre}
        className="w-full h-full object-cover transition-opacity duration-300"
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackUrl;
        }}
      />
    </div>
  );
};

export default UserAvatar;
