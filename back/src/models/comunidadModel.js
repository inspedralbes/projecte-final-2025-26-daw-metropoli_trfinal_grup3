import Publicacion from "./mongo/Publicacion.js";

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

export default {
  getAll,
  create,
  addComentario,
  addRespuesta,
  toggleLike,
};
