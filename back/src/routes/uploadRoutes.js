import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../../public/uploads/comunidad");

// Creamos la carpeta si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
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
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No se recibió ninguna imagen." });
  }
  const url = `/uploads/comunidad/${req.file.filename}`;
  res.json({ success: true, url });
});

export default router;
