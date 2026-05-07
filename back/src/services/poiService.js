import poiModel from '../models/poiModel.js';
import pool from '../config/mysql.js';

import nodoModel from '../models/nodoModel.js';

const createPoiSimple = async (poiData) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let finalNodoAccesoId = poiData.id_nodo_acceso;

        // Si no viene un ID de nodo, intentamos "snapping" o creamos uno nuevo
        if (!finalNodoAccesoId) {
            // 1. Snapping: ¿Hay algún nodo ya existente muy cerca (2 metros)?
            const nearest = await nodoModel.findNearestNode(poiData.latitud, poiData.longitud);
            
            if (nearest && nearest.distance < 0.002) {
                // Reutilizamos el nodo cercano
                finalNodoAccesoId = nearest.id_nodo;
            } else {
                // 2. Si no hay nada cerca, creamos un nodo nuevo
                const nodoResult = await nodoModel.create({
                    latitud: poiData.latitud,
                    longitud: poiData.longitud
                }, connection);
                finalNodoAccesoId = nodoResult.id_nodo;
            }
        }

        // 3. Asociar el ID final al POI y guardarlo
        const poiConNodo = {
            ...poiData,
            id_nodo_acceso: finalNodoAccesoId
        };

        const nuevoPoi = await poiModel.create(poiConNodo, connection);

        await connection.commit();
        return nuevoPoi;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};



const getAllPois = async () => {
    return await poiModel.getAll();
};

const deletePoi = async (id) => {
    return await poiModel.deleteById(id);
};

export default {
    createPoiSimple,
    getAllPois,
    deletePoi
};
