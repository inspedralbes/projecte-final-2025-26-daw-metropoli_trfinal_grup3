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

export default {
  getAll,
  create,
  addComentario,
  addRespuesta,
};
