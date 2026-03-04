import express from "express";
import comunidadController from "../controllers/comunidadController.js";

const router = express.Router();

// Publicaciones
router.get("/", comunidadController.getPublicaciones);
router.post("/", comunidadController.createPublicacion);

// Comentarios y respuestas
router.post("/:id/comentarios", comunidadController.addComentario);
router.post(
  "/:id/comentarios/:cid/respuestas",
  comunidadController.addRespuesta,
);

// Likes
router.post("/:id/like", comunidadController.toggleLike);

export default router;
