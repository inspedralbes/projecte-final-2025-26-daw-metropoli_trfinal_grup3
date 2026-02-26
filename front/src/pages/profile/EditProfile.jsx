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
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-display select-none transition-colors duration-300 md:pl-16">
      {/* Top Bar */}
      <div className="w-full pt-6 px-5 pb-4 bg-gray-50 dark:bg-slate-950 z-20 transition-colors duration-300 touch-none md:max-w-3xl md:mx-auto">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/profile")}
            className="bg-white dark:bg-slate-900 p-2 rounded-full text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl block">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">
            {t("editProfile.title")}
          </h1>
          <button
            onClick={handleGuardar}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${guardado ? "bg-emerald-500 text-white shadow-emerald-500/30" : "bg-primary text-white hover:bg-primary/90 shadow-primary/30"
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

      {/* Scrollable Content */}
      <div className="overflow-y-auto no-scrollbar pb-24 md:pb-10 pt-4 px-5 space-y-8 md:max-w-3xl md:mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors border-2 border-white dark:border-slate-900"
              >
                <span className="material-symbols-outlined text-xl">
                  photo_camera
                </span>
              </button>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {t("editProfile.changeAvatar")}
            </p>

            {/* Avatar Picker */}
            {showAvatarPicker && (
              <div className="w-full max-w-sm mt-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 animate-fade-in">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
                  {t("editProfile.chooseAvatar")}
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {AVATAR_OPTIONS.map((url) => (
                    <button
                      key={url}
                      onClick={() => {
                        setAvatar(url);
                        setShowAvatarPicker(false);
                      }}
                      className={`relative aspect-square rounded-full overflow-hidden transition-all duration-300 ${
                        avatar === url
                          ? "ring-4 ring-primary ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-800 scale-95"
                          : "hover:scale-105 hover:shadow-md opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={url}
                        alt="avatar option"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full h-px bg-slate-100 dark:bg-slate-800 mb-8"></div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span className="material-symbols-outlined text-slate-400 text-lg">
                  person
                </span>
                {t("editProfile.name")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                placeholder={t("editProfile.namePlaceholder")}
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-2xl px-4 py-3.5 text-base text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                  errors.name
                    ? "border-red-400 focus:ring-red-400"
                    : "border-slate-200 dark:border-slate-800 focus:border-primary"
                }`}
              />
              <div className="flex justify-between items-center mt-1.5 px-1">
                <p className="text-red-500 text-xs font-medium">
                  {errors.name}
                </p>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider">
                  {name.trim().length}/40
                </p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span className="material-symbols-outlined text-slate-400 text-lg">
                  description
                </span>
                {t("editProfile.bio")}
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={100}
                rows={3}
                placeholder={t("editProfile.bioPlaceholder")}
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-2xl px-4 py-3.5 text-base text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none ${
                  errors.bio
                    ? "border-red-400 focus:ring-red-400"
                    : "border-slate-200 dark:border-slate-800 focus:border-primary"
                }`}
              />
              <div className="flex justify-between items-center mt-1.5 px-1">
                <p className="text-red-500 text-xs font-medium">{errors.bio}</p>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider">
                  {bio.length}/100
                </p>
              </div>
            </div>

            {/* Info card */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-4 flex gap-3 items-start">
              <span className="material-symbols-outlined text-blue-500 text-xl mt-0.5">
                info
              </span>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                {t(
                  "editProfile.infoNote",
                  "Your profile information is visible to other fans in the community. Changes to your avatar will update across all your posts and comments.",
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default EditProfile;
