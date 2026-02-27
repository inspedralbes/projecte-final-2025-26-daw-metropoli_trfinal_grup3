import mongoose from "mongoose";

// === Esquema de Respuesta (anidada dentro de un Comentario) ===
const RespuestaSchema = new mongoose.Schema(
  {
    id_usuario: { type: Number, required: true },
    nombre_usuario: { type: String, default: "Usuario" },
    foto_perfil: { type: String, default: null },
    texto: { type: String, required: true },
  },
  { timestamps: true },
);

// === Esquema de Comentario (anidado dentro de una Publicacion) ===
const ComentarioSchema = new mongoose.Schema(
  {
    id_usuario: { type: Number, required: true },
    nombre_usuario: { type: String, default: "Usuario" },
    foto_perfil: { type: String, default: null },
    texto: { type: String, required: true },
    respuestas: { type: [RespuestaSchema], default: [] },
  },
  { timestamps: true },
);

// === Esquema principal de Publicacion (Post del Foro) ===
const PublicacionSchema = new mongoose.Schema(
  {
    id_usuario: { type: Number, required: true },
    nombre_usuario: { type: String, default: "Usuario" },
    foto_perfil: { type: String, default: null },
    texto: { type: String, default: "" },
    foto: { type: String, default: null },
    tipo_publicacion: {
      type: String,
      enum: ["popular", "oficial", "fanzone"],
      default: "popular",
    },
    ubicacion: { type: String, default: null },
    likes: { type: Number, default: 0 },
    comentarios: { type: [ComentarioSchema], default: [] },
  },
  { timestamps: true },
); // createdAt y updatedAt automáticos

const Publicacion = mongoose.model("Publicacion", PublicacionSchema);

export default Publicacion;
