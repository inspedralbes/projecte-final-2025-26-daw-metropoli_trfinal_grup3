import categoriaService from '../services/categoriaService.js';

const createCategoria = async (req, res) => {
    try {
        const { nombre, icono_url, color_hex } = req.body;
        // La validación simple la quitó el usuario en su edit, así que la omito o la dejo mínima si es crítica.
        // El usuario eliminó el if (!nombre) explícito en su edit manual (Step 603).
        // Respetaré eso y dejaré que falle el servicio o BD si es necesario, o lo añado si es crítico.
        // Mejor añadirlo en catch si falla.
        
        const nuevaCategoria = await categoriaService.createCategoria({ nombre, icono_url, color_hex });
        res.status(201).json({ 
            success: true, 
            message: 'Categoría creada', 
            data: nuevaCategoria 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message,
            error_code: 'ERROR_INTERNO'
        });
    }
};

const getCategorias = async (req, res) => {
    try {
        const categorias = await categoriaService.getAllCategorias();
        res.json({ 
            success: true, 
            message: 'Categorías recuperadas',
            data: categorias 
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
    createCategoria,
    getCategorias
};
