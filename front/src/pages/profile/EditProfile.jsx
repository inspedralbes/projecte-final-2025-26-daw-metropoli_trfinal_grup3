import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../layouts/Navbar";
import { getUsuario, updatePerfil } from "../../../services/communicationManager";

const EditProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // TODO: Reemplazar con el ID real del usuario autenticado cuando haya login
  const ID_USUARIO_ACTUAL = 1;

  // Estado del formulario — se rellena desde la BD al cargar la pantalla
  const [nombre, setNombre] = useState("");
  const [bio, setBio] = useState("");

  // Estado de la foto: el archivo real que sube el usuario y la URL temporal para previsualizarla
  const [archivoDeFoto, setArchivoDeFoto] = useState(null);
  const [previsualizacionDeFoto, setPrevisualizacionDeFoto] = useState(null);

  const [guardado, setGuardado] = useState(false);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Al entrar a la pantalla, pedimos los datos actuales del usuario a la BD
  useEffect(() => {
    getUsuario(ID_USUARIO_ACTUAL)
      .then((res) => {
        if (res.success && res.data) {
          setNombre(res.data.nombre || "");
          setBio(res.data.bio || "");
          // Si tiene foto guardada en la BD, la mostramos como previsualización inicial
          if (res.data.foto_perfil) {
            setPrevisualizacionDeFoto(`${API_URL}${res.data.foto_perfil}`);
          }
        }
      })
      .catch((err) => console.error("Error al cargar el perfil:", err))
      .finally(() => setCargando(false));
  }, []);

  const validar = () => {
    const nuevosErrores = {};
    if (!nombre.trim()) nuevosErrores.nombre = t("editProfile.errorName");
    if (nombre.trim().length > 40) nuevosErrores.nombre = t("editProfile.errorNameLong");
    if (bio.length > 100) nuevosErrores.bio = t("editProfile.errorBioLong");
    return nuevosErrores;
  };

  const handleCambioFoto = (evento) => {
    const archivoSeleccionado = evento.target.files[0];
    if (archivoSeleccionado) {
      setArchivoDeFoto(archivoSeleccionado);
      // Creamos una URL temporal para mostrar la imagen antes de subirla
      setPrevisualizacionDeFoto(URL.createObjectURL(archivoSeleccionado));
    }
  };

  const handleGuardar = async () => {
    const erroresEncontrados = validar();
    if (Object.keys(erroresEncontrados).length > 0) {
      setErrores(erroresEncontrados);
      return;
    }
    setErrores({});

    // Siempre enviamos FormData para que el backend pueda recibir tanto texto como el archivo de foto
    const paqueteDeDatos = new FormData();
    paqueteDeDatos.append("nombre", nombre);
    paqueteDeDatos.append("bio", bio);

    // Solo adjuntamos la foto si el usuario ha seleccionado una nueva
    if (archivoDeFoto) {
      paqueteDeDatos.append("fotoPerfil", archivoDeFoto);
    }

    try {
      await updatePerfil(ID_USUARIO_ACTUAL, paqueteDeDatos);
      setGuardado(true);

      // Volvemos al perfil después de un breve momento para que el usuario vea la confirmación
      setTimeout(() => {
        navigate("/profile");
      }, 900);
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
    }
  };

  return (
    <div className="relative h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-display overflow-hidden select-none flex flex-col transition-colors duration-300 overscroll-none">
      {/* Header */}
      <div className="w-full pt-6 px-5 pb-4 bg-gray-50 dark:bg-slate-950 z-20 transition-colors duration-300 touch-none shrink-0">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/profile")}
            className="bg-white dark:bg-slate-900 p-2 rounded-full text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-800 active:bg-slate-100 dark:active:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl block">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">
            {t("editProfile.title")}
          </h1>
          <button
            onClick={handleGuardar}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${guardado ? "bg-emerald-500 text-white" : "bg-primary text-white active:scale-95"
              }`}
          >
            {guardado ? (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">check</span>
                {t("editProfile.saved")}
              </span>
            ) : (
              t("editProfile.save")
            )}
          </button>
        </div>
      </div>

      {/* Contenido desplazable */}
      <div className="flex-grow overflow-y-auto pb-32 px-5 space-y-6 pt-2">

        {/* Sección de la foto de perfil */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden">
              <img src={previsualizacionDeFoto} alt="Foto de perfil" className="w-full h-full object-cover" />
            </div>
            {/* El botón de la cámara abre el selector de archivo oculto */}
            <label
              htmlFor="selectorDeFoto"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">photo_camera</span>
            </label>
            {/* Input oculto para seleccionar imagen del dispositivo */}
            <input
              id="selectorDeFoto"
              type="file"
              accept="image/*"
              onChange={handleCambioFoto}
              className="hidden"
            />
          </div>
          <p className="text-xs text-slate-400">{t("editProfile.changeAvatar")}</p>
        </div>

        {/* Campos del formulario */}
        <div className="space-y-4">
          {/* Campo Nombre */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              {t("editProfile.name")}
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={40}
              placeholder={t("editProfile.namePlaceholder")}
              className={`w-full bg-white dark:bg-slate-900 border rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${errores.nombre ? "border-red-400 focus:ring-red-400" : "border-slate-200 dark:border-slate-700"
                }`}
            />
            {errores.nombre && <p className="text-red-500 text-xs mt-1 ml-1">{errores.nombre}</p>}
            <p className="text-[10px] text-slate-400 text-right mt-1">{nombre.trim().length}/40</p>
          </div>

          {/* Campo Bio */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              {t("editProfile.bio")}
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={100}
              rows={3}
              placeholder={t("editProfile.bioPlaceholder")}
              className={`w-full bg-white dark:bg-slate-900 border rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none ${errores.bio ? "border-red-400 focus:ring-red-400" : "border-slate-200 dark:border-slate-700"
                }`}
            />
            {errores.bio && <p className="text-red-500 text-xs mt-1 ml-1">{errores.bio}</p>}
            <p className="text-[10px] text-slate-400 text-right mt-1">{bio.length}/100</p>
          </div>

          {/* Tarjeta informativa */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-4 flex gap-3 items-start">
            <span className="material-symbols-outlined text-blue-400 text-lg mt-0.5">info</span>
            <p className="text-xs text-blue-600 dark:text-blue-300 leading-relaxed">
              {t("editProfile.infoNote")}
            </p>
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default EditProfile;
