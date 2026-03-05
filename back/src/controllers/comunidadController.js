import comunidadService from "../services/comunidadService.js";
import { emitirMensaje } from "../config/socket.js";
import { filterText, filterImageUrl } from "../services/moderationService.js";

// GET /api/comunidad
const getPublicaciones = async (req, res) => {
  try {
    const publicaciones = await comunidadService.getAllPublicaciones();
    res.json({
      success: true,
      message: "Publicaciones recuperadas",
      data: publicaciones,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error_code: "ERROR_INTERNO",
    });
  }
};

// POST /api/comunidad
const createPublicacion = async (req, res) => {
  try {
    const {
      id_usuario,
      nombre_usuario,
      foto_perfil,
      texto,
      foto,
      tipo_publicacion,
      ubicacion,
    } = req.body;

    // Moderació de text
    if (texto) {
      const textoCheck = await filterText(texto);
      if (textoCheck.bloqueado) {
        return res.status(400).json({
          success: false,
          message: `Tu publicación ha sido bloqueada por contenido inapropiado: ${textoCheck.razon}`,
          error_code: "CONTENIDO_BLOQUEADO",
        });
      }
    }

    //  Moderació de imatge
    if (foto) {
      const fotoCheck = await filterImageUrl(foto);
      if (fotoCheck.bloqueado) {
        return res.status(400).json({
          success: false,
          message: `La imagen ha sido bloqueada por contenido inapropiado: ${fotoCheck.razon}`,
          error_code: "IMAGEN_BLOQUEADA",
        });
      }
    }

    const nuevaPublicacion = await comunidadService.createPublicacion({
      id_usuario,
      nombre_usuario,
      foto_perfil,
      texto,
      foto,
      tipo_publicacion,
      ubicacion,
    });

    emitirMensaje("nueva_publicacion", nuevaPublicacion);

    res.status(201).json({
      success: true,
      message: "Publicación creada",
      data: nuevaPublicacion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error_code: "ERROR_INTERNO",
    });
  }
};

// POST /api/comunidad/:id/comentarios
const addComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, nombre_usuario, foto_perfil, texto } = req.body;

    if (!texto || texto.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "El comentario no puede estar vacío.",
      });
    }

    // Moderació del comentari
    const textoCheck = await filterText(texto);
    if (textoCheck.bloqueado) {
      return res.status(400).json({
        success: false,
        message: `Comentario bloqueado: ${textoCheck.razon}`,
        error_code: "CONTENIDO_BLOQUEADO",
      });
    }

    const publicacionActualizada = await comunidadService.addComentario(id, {
      id_usuario,
      nombre_usuario,
      foto_perfil,
      texto,
    });

    if (!publicacionActualizada) {
      return res
        .status(404)
        .json({ success: false, message: "Publicación no encontrada." });
    }

    // Emitimos el nuevo comentario para que se actualice en tiempo real
    const comentarioNuevo = publicacionActualizada.comentarios[0];
    emitirMensaje("nuevo_comentario", {
      id_publicacion: id,
      comentario: comentarioNuevo,
    });

    res.status(201).json({
      success: true,
      message: "Comentario añadido",
      data: publicacionActualizada,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error_code: "ERROR_INTERNO",
    });
  }
};

// POST /api/comunidad/:id/comentarios/:cid/respuestas
const addRespuesta = async (req, res) => {
  try {
    const { id, cid } = req.params;
    const { id_usuario, nombre_usuario, foto_perfil, texto } = req.body;

    if (!texto || texto.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "La respuesta no puede estar vacía.",
      });
    }

    // Moderació de la resposta
    const textoCheck = await filterText(texto);
    if (textoCheck.bloqueado) {
      return res.status(400).json({
        success: false,
        message: `Respuesta bloqueada: ${textoCheck.razon}`,
        error_code: "CONTENIDO_BLOQUEADO",
      });
    }

    const publicacionActualizada = await comunidadService.addRespuesta(
      id,
      cid,
      {
        id_usuario,
        nombre_usuario,
        foto_perfil,
        texto,
      },
    );

    if (!publicacionActualizada) {
      return res.status(404).json({
        success: false,
        message: "Publicación o comentario no encontrado.",
      });
    }

    emitirMensaje("nueva_respuesta", {
      id_publicacion: id,
      id_comentario: cid,
    });

    res.status(201).json({
      success: true,
      message: "Respuesta añadida",
      data: publicacionActualizada,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error_code: "ERROR_INTERNO",
    });
  }
};

// POST /api/comunidad/:id/like
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.body.id_usuario ?? 1;

    const publicacionActualizada = await comunidadService.toggleLike(
      id,
      id_usuario,
    );
    if (!publicacionActualizada) {
      return res
        .status(404)
        .json({ success: false, message: "Publicación no encontrada." });
    }

    emitirMensaje("like_actualizado", {
      id_publicacion: id,
      likes: publicacionActualizada.likes,
    });

    res.json({
      success: true,
      likes: publicacionActualizada.likes,
      likes_usuarios: publicacionActualizada.likes_usuarios,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error_code: "ERROR_INTERNO",
    });
  }
};

export default {
  getPublicaciones,
  createPublicacion,
  addComentario,
  addRespuesta,
  toggleLike,
};
