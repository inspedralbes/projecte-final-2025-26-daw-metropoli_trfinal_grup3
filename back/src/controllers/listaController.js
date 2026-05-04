import listaModel from '../models/listaModel.js';
import poiModel from '../models/poiModel.js';

const createLista = async (req, res) => {
    try {
        const { id_usuario, nombre, descripcion, visibilidad, pois } = req.body;
        
        if (!id_usuario || !nombre) {
            return res.status(400).json({ success: false, message: 'Usuario y nombre son requeridos' });
        }

        const newLista = await listaModel.create({ id_usuario, nombre, descripcion, visibilidad });
        
        if (pois && Array.isArray(pois)) {
            for (let i = 0; i < pois.length; i++) {
                await listaModel.addPoiToLista(newLista.id_lista, pois[i], i + 1);
            }
        }

        res.status(201).json({ success: true, data: newLista });
    } catch (error) {
        console.error('Error in createLista:', error);
        res.status(500).json({ success: false, message: 'Error al crear la lista' });
    }
};

const getPublicListas = async (req, res) => {
    try {
        const listas = await listaModel.getPublicListas();
        
        // Adjuntamos los POIs a cada lista
        const listasConPois = await Promise.all(listas.map(async (lista) => {
            const pois = await listaModel.getPoisByListaId(lista.id_lista);
            return { ...lista, pois };
        }));

        res.json({ success: true, data: listasConPois });
    } catch (error) {
        console.error('Error in getPublicListas:', error);
        res.status(500).json({ success: false, message: 'Error al obtener las listas' });
    }
};

const getListaById = async (req, res) => {
    try {
        const { id } = req.params;
        const lista = await listaModel.getById(id);
        
        if (!lista) {
            return res.status(404).json({ success: false, message: 'Lista no encontrada' });
        }

        const pois = await listaModel.getPoisByListaId(id);
        res.json({ success: true, data: { ...lista, pois } });
    } catch (error) {
        console.error('Error in getListaById:', error);
        res.status(500).json({ success: false, message: 'Error al obtener la lista' });
    }
};

const getUsuarioListas = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const listas = await listaModel.getByUsuarioId(id_usuario);
        
        // Adjuntamos los POIs a cada lista
        const listasConPois = await Promise.all(listas.map(async (lista) => {
            const pois = await listaModel.getPoisByListaId(lista.id_lista);
            return { ...lista, pois };
        }));

        res.json({ success: true, data: listasConPois });
    } catch (error) {
        console.error('Error in getUsuarioListas:', error);
        res.status(500).json({ success: false, message: 'Error al obtener las listas del usuario' });
    }
};

const deleteLista = async (req, res) => {
    try {
        const { id } = req.params;
        await listaModel.deleteById(id);
        res.json({ success: true, message: 'Lista eliminada correctamente' });
    } catch (error) {
        console.error('Error in deleteLista:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar la lista' });
    }
};

const updateLista = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, visibilidad, imagen_url, pois } = req.body;

        await listaModel.update(id, { nombre, descripcion, visibilidad, imagen_url });

        if (pois && Array.isArray(pois)) {
            // Limpiamos los POIs actuales y añadimos los nuevos para actualizar la ruta
            await listaModel.removeAllPoisFromLista(id);
            for (let i = 0; i < pois.length; i++) {
                await listaModel.addPoiToLista(id, pois[i].id_poi || pois[i], i + 1);
            }
        }

        res.json({ success: true, message: 'Lista actualizada correctamente' });
    } catch (error) {
        console.error('Error in updateLista:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar la lista' });
    }
};

const uploadListaImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No se ha subido ninguna imagen' });
        }
        // Devolvemos la ruta relativa para que el front la guarde en imagen_url
        const relativePath = `/images/listas/${req.file.filename}`;
        res.json({ success: true, data: { imagen_url: relativePath } });
    } catch (error) {
        console.error('Error in uploadListaImage:', error);
        res.status(500).json({ success: false, message: 'Error al subir la imagen' });
    }
};

export default {
    createLista,
    getPublicListas,
    getListaById,
    getUsuarioListas,
    deleteLista,
    updateLista,
    uploadListaImage
};
