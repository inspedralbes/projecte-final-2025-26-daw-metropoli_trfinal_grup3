const categoriaService = require('../services/categoriaService');

const createCategoria = async (req, res) => {
    try {
        const { nombre, icono_url, color_hex } = req.body;
        const nuevaCategoria = await categoriaService.createCategoria({ nombre, icono_url, color_hex });
        res.status(201).json({
            success: true,
            message: 'Categoría creada',
            data: nuevaCategoria
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCategorias = async (req, res) => {
    try {
        const categorias = await categoriaService.getAllCategorias();
        res.json({ success: true, data: categorias });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createCategoria,
    getCategorias
};
