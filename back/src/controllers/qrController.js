import qrService from '../services/qrService.js';
import cacheService from '../services/cacheService.js';

/**
 * GET /api/qrs/slug/:slug
 * Busca en la caché mundial (O(1)) los POIs más cercanos para ese QR.
 */
export const getQrBySlug = (req, res) => {
  const { slug } = req.params;
  const data = cacheService.getBySlug(slug);

  if (!data) {
    return res.status(404).json({
      success: false,
      message: `QR con slug '${slug}' no encontrado en la caché mundial. ¿Has ejecutado 'Recalcular Mapa'?`,
      error_code: 'RECURSO_NO_ENCONTRADO'
    });
  }

  res.status(200).json({ success: true, data });
};

/**
 * POST /api/qrs/generar/:id_nodo?zona=...
 * Genera el QR para ese nodo Y calcula los 3 POIs más cercanos (Dijkstra on-demand).
 * Se usa cuando el admin selecciona un punto concreto del mapa.
 */
export const generateQrWithNearestPois = async (req, res) => {
  try {
    const { id_nodo } = req.params;
    const { zona }    = req.query;

    const data = await qrService.generateQrWithNearestPois(id_nodo, zona);

    res.status(200).json({
      success: true,
      message: `QR generado y ${data.pois_cercanos.length} POIs más cercanos calculados`,
      data
    });
  } catch (error) {
    const status = error.status || 500;
    console.error(`Error en generateQrWithNearestPois para nodo ${req.params.id_nodo}:`, error);
    res.status(status).json({
      success: false,
      message: error.message || 'Error al generar QR con POIs cercanos',
      error: error.message
    });
  }
};

/**
 * GET /api/qrs/:id_nodo?zona=...
 * Solo genera un QR para el nodo indicado (sin calcular rutas).
 */
export const generateQrCode = async (req, res) => {
  try {
    const { id_nodo } = req.params;
    const { zona }    = req.query;

    const data = await qrService.generateQrCode(id_nodo, zona);

    res.status(200).json({
      success: true,
      message: 'QR Code generated successfully',
      data
    });
  } catch (error) {
    const status = error.status || 500;
    console.error(`Error generating QR code for node ${req.params.id_nodo}:`, error);
    res.status(status).json({
      success: false,
      message: error.message || 'Error generating QR code',
      error: error.message
    });
  }
};

/**
 * GET /api/qrs
 * Devuelve todos los QR codes registrados.
 */
export const getQrCodes = async (req, res) => {
  try {
    const qrs = await qrService.getAllQrCodes();
    res.status(200).json({
      success: true,
      message: 'QR Codes retrieved successfully',
      data: qrs
    });
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving QR codes',
      error: error.message
    });
  }
};


