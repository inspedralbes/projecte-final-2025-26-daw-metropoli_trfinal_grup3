import Publicacion from "./mongo/Publicacion.js";
import Mensaje from "./mongo/Mensaje.js";

// =============================================
// PUBLICACIONES
// =============================================

const getAll = async () => {
  return await Publicacion.find().sort({ createdAt: -1 }).lean();
};

const create = async (data) => {
  const pub = new Publicacion(data);
  return await pub.save();
};

// =============================================
// COMENTARIOS
// =============================================

const addComentario = async (id_publicacion, comentarioData) => {
  const pub = await Publicacion.findByIdAndUpdate(
    id_publicacion,
    { $push: { comentarios: { $each: [comentarioData], $position: 0 } } },
    { new: true },
  );
  return pub;
};

// =============================================
// RESPUESTAS
// =============================================

const addRespuesta = async (id_publicacion, id_comentario, respuestaData) => {
  const pub = await Publicacion.findOneAndUpdate(
    { _id: id_publicacion, "comentarios._id": id_comentario },
    { $push: { "comentarios.$.respuestas": respuestaData } },
    { new: true },
  );
  return pub;
};

// =============================================
// LIKES
// =============================================

const toggleLike = async (id_publicacion, userId) => {
  // Comprobamos si el usuario ya dio like
  const pub = await Publicacion.findById(id_publicacion).select(
    "likes_usuarios likes",
  );
  if (!pub) return null;

  const yaLikeo = pub.likes_usuarios?.includes(String(userId));

  if (yaLikeo) {
    // Quitar like
    return await Publicacion.findByIdAndUpdate(
      id_publicacion,
      { $inc: { likes: -1 }, $pull: { likes_usuarios: String(userId) } },
      { new: true },
    );
  } else {
    // Dar like
    return await Publicacion.findByIdAndUpdate(
      id_publicacion,
      { $inc: { likes: 1 }, $addToSet: { likes_usuarios: String(userId) } },
      { new: true },
    );
  }
};

// =============================================
// ACTIVIDAD Y CHAT
// =============================================

const getActividadReciente = async () => {
  // Agregamos las últimas publicaciones y los últimos comentarios
  const ultimasPubs = await Publicacion.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select("nombre_usuario foto_perfil texto createdAt")
    .lean();

  const actividad = ultimasPubs.map(p => ({
    tipo: 'post',
    usuario: p.nombre_usuario,
    foto: p.foto_perfil,
    texto: p.texto,
    fecha: p.createdAt
  }));

  // Podríamos agregar más tipos de actividad aquí en el futuro
  return actividad.sort((a, b) => b.fecha - a.fecha);
};

const getChatHistory = async (room) => {
  return await Mensaje.find({ room }).sort({ createdAt: 1 }).limit(50).lean();
};

const saveMensaje = async (data) => {
  const msg = new Mensaje(data);
  return await msg.save();
};

export default {
  getAll,
  create,
  addComentario,
  addRespuesta,
  toggleLike,
  getActividadReciente,
  getChatHistory,
  saveMensaje
};
