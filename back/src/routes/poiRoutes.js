import express from 'express';
import poiController from '../controllers/poiController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Creación de POIs
router.post('/', poiController.createPoiSimple);
router.post('/completo', poiController.createPoiCompleto);

// Obtener todos los POIs
router.get('/', poiController.getPois);

// Obtener los POIs más cercanos a una coordenada (debe ir ANTES de /:id para evitar conflictos)
router.get('/cercanos', poiController.getPoisCercanos);

// Subir o actualizar la imagen de un POI existente
router.post('/:id/imagen', upload.single('imagenPoi'), poiController.uploadPoiImage);

// Eliminar un POI
router.delete('/:id', poiController.deletePoi);

export default router;
