import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determinamos la carpeta destino según el campo del archivo
        let folder = 'public/images/eventos/';
        if (file.fieldname === 'fotoPerfil') {
            folder = 'public/images/usuarios/';
        } else if (file.fieldname === 'fotoPublicacion') {
            folder = 'public/images/comunidad/';
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const prefix = file.fieldname === 'fotoPerfil' ? 'user' : 'evento';
        const fileName = `${prefix}-${Date.now()}${ext}`;
        cb(null, fileName);
    }
});

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Formato de imagen no válido'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export default upload;
