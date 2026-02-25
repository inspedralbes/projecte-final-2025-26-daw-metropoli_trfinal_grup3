import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/eventos/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const fileName = `evento-${Date.now()}${ext}`;
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
