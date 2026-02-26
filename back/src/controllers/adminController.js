import cacheService from '../services/cacheService.js';
import qrService from '../services/qrService.js';

/**
 * POST /api/admin/recalcular
 * 1. Regenera los PNGs de todos los QRs registrados en la DB.
 * 2. Recalcula la caché en memoria (Dijkstra) con los datos actuales.
 */
export const recalculateCache = async (req, res) => {
    try {
        // Paso 1: Recalcular las rutas en memoria RAM
        await cacheService.recalculateGlobalCache();

        // Paso 2: Generar/actualizar los archivos PNG de cada QR
        const qrsGenerados = await qrService.generateAllQrCodes();

        res.json({
            success: true,
            message: 'Caché actualizada',
            qrs_generados: qrsGenerados.length,
            qrs: qrsGenerados
        });
    } catch (error) {
        console.error('Error en recalculateCache:', error);
        res.status(500).json({
            success: false,
            message: 'Error al recalcular la caché',
            error: error.message
        });
    }
};

export default {
    recalculateCache
};
