import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Ruta absoluta a la carpeta raíz del backend (/app en Docker, back/ en local)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_BASE = path.join(__dirname, "..", "..", "public");

// Carpetas que deben existir — las creamos si no están
const UPLOAD_DIRS = [
  path.join(PUBLIC_BASE, "images", "eventos"),
  path.join(PUBLIC_BASE, "images", "usuarios"),
  path.join(PUBLIC_BASE, "images", "comunidad"),
  path.join(PUBLIC_BASE, "images", "pois"),
];

for (const dir of UPLOAD_DIRS) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Directorio creado: ${dir}`);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determinamos la carpeta destino según el campo del archivo
    let folder = path.join(PUBLIC_BASE, "images", "eventos");

    if (file.fieldname === "fotoPerfil") {
      folder = path.join(PUBLIC_BASE, "images", "usuarios");
    } else if (file.fieldname === "fotoPublicacion") {
      folder = path.join(PUBLIC_BASE, "images", "comunidad");
    } else if (file.fieldname === "imagenPoi") {
      folder = path.join(PUBLIC_BASE, "images", "pois");
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    let prefix = "evento";
    if (file.fieldname === "fotoPerfil") {
      prefix = "user";
    } else if (file.fieldname === "fotoPublicacion") {
      prefix = "publicacion";
    } else if (file.fieldname === "imagenPoi") {
      prefix = "poi";
    }

    const fileName = `${prefix}-${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Formato de imagen no válido"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
