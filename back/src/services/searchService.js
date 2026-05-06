import searchModel from '../models/searchModel.js';

const searchAll = async (searchTerm, categoryId = null) => {
    // Realizamos las búsquedas en paralelo para mayor velocidad
    const [usuarios, listas, lugares] = await Promise.all([
        searchModel.searchUsuarios(searchTerm),
        searchModel.searchListas(searchTerm, categoryId),
        searchModel.searchPOIs(searchTerm, categoryId)
    ]);

    return {
        usuarios,
        listas,
        lugares
    };
};

export default {
    searchAll
};
