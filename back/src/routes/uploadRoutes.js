import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../../public/uploads/comunidad");

// Creamos la carpeta si no existe (también al arrancar)
const ensureUploadDir = () => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("[Upload] Directorio creado:", uploadDir);
  }
};
ensureUploadDir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadDir(); // Garantizamos que existe justo antes de escribir
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nombre = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, nombre);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes (jpg, png, webp, gif)"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}); // máx 5MB

// POST /api/upload/comunidad
router.post("/comunidad", upload.single("foto"), (req, res) => {
  try {
    if (!req.file) {
      console.error("[Upload] No se recibió ningún archivo.");
      return res
        .status(400)
        .json({ success: false, message: "No se recibió ninguna imagen." });
    }
    console.log("[Upload] Archivo guardado:", req.file.path);
    const url = `/uploads/comunidad/${req.file.filename}`;
    res.json({ success: true, url });
  } catch (err) {
    console.error("[Upload] Error inesperado:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Manejador de errores de multer (tamaño, formato, permisos de disco, etc.)
router.use((err, _req, res, _next) => {
  console.error("[Upload] Error de multer:", err.message);
  if (err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(413)
      .json({ success: false, message: "La imagen supera el límite de 5MB." });
  }
  res.status(400).json({ success: false, message: err.message });
});

export default router;
