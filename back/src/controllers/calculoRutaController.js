import calculoRutaService from '../services/calculoRutaService.js';

const calcularRuta = async (req, res) => {
    try {
        const { origen, destino } = req.query; 

        if (!origen || !destino) {
            return res.status(400).json({ 
                success: false, 
                message: 'Parámetros origen y destino son requeridos (ids de POI).',
                error_code: 'PARAMETROS_FALTANTES'
            });
        }

        const ruta = await calculoRutaService.calcularRuta(origen, destino);
        
        res.json({
            success: true,
            message: 'Ruta calculada con éxito',
            data: ruta
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

export default {
    calcularRuta
};
