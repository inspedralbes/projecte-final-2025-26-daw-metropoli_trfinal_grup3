import calculoRutaService from '../services/calculoRutaService.js';

const calcularRuta = async (req, res) => {
    try {
        const { origen, destino, lat, lng } = req.query; 

        if (!destino) {
            return res.status(400).json({ 
                success: false, 
                message: 'El parámetro destino (ID del POI) es requerido.',
                error_code: 'PARAMETRO_DESTINO_FALTANTE'
            });
        }

        let ruta;
        if (lat && lng) {
            // Navegación desde coordenadas actuales del usuario
            ruta = await calculoRutaService.calcularRutaDesdeCoords(parseFloat(lat), parseFloat(lng), destino);
        } else if (origen) {
            // Navegación tradicional entre dos IDs de POI
            ruta = await calculoRutaService.calcularRuta(origen, destino);
        } else {
            return res.status(400).json({ 
                success: false, 
                message: 'Debes proporcionar un ID de origen o tus coordenadas (lat, lng).',
                error_code: 'PARAMETROS_INSUFICIENTES'
            });
        }
        
        res.json({
            success: true,
            message: 'Ruta calculada con éxito',
            data: ruta
        });

    } catch (error) {
        console.error("CRITICAL ERROR in calcularRuta:", error);
        res.status(500).json({ 
            success: false, 
            message: `Error interno del servidor: ${error.message}`,
            error_details: error.stack,
            error_code: 'ERROR_INTERNO'
        });
    }
};

export default {
    calcularRuta
};
