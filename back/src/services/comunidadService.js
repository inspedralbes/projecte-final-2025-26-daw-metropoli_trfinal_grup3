import comunidadModel from "../models/comunidadModel.js";

const getAllPublicaciones = async () => {
  return await comunidadModel.getAll();
};

const createPublicacion = async (data) => {
  return await comunidadModel.create(data);
};

const addComentario = async (id_publicacion, comentarioData) => {
  return await comunidadModel.addComentario(id_publicacion, comentarioData);
};

const addRespuesta = async (id_publicacion, id_comentario, respuestaData) => {
  return await comunidadModel.addRespuesta(
    id_publicacion,
    id_comentario,
    respuestaData,
  );
};

const toggleLike = async (id_publicacion, userId) => {
  return await comunidadModel.toggleLike(id_publicacion, userId);
};

export default {
  getAllPublicaciones,
  createPublicacion,
  addComentario,
  addRespuesta,
  toggleLike,
};
