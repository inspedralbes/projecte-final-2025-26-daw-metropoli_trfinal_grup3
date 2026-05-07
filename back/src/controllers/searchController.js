import searchService from '../services/searchService.js';

const search = async (req, res) => {
    try {
        const { q, cat } = req.query;

        if (!q || q.trim().length < 2) {
            return res.json({
                success: true,
                data: { usuarios: [], listas: [], lugares: [] }
            });
        }

        const results = await searchService.searchAll(q, cat);
        
        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error in search:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno en la búsqueda',
            error: error.message
        });
    }
};

export default {
    search
};
