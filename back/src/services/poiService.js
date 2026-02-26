import poiModel from '../models/poiModel.js';
import horarioModel from '../models/horarioModel.js';
import multimediaModel from '../models/multimediaModel.js';
import pool from '../config/mysql.js';

const createPoiSimple = async (poiData) => {
    return await poiModel.create(poiData);
};

const createPoiCompleto = async (fullData) => {
    const { horarios, multimedia, ...poiData } = fullData;
    
    // Obtenemos una conexión del pool para la transacción
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Crear POI
        const nuevoPoi = await poiModel.create(poiData, connection);
        const idPoi = nuevoPoi.id_poi;

        // 2. Insertar Horarios (usando el modelo de Horario)
        if (horarios && horarios.length > 0) {
            const horarioValues = horarios.map(h => [idPoi, h.id_evento, h.dia_semana, h.hora_apertura, h.hora_cierre]);
            await horarioModel.createBulk(horarioValues, connection);
        }

        // 3. Insertar Multimedia (usando el modelo de Multimedia)
        if (multimedia && multimedia.length > 0) {
             const mediaValues = multimedia.map(m => [idPoi, m.url_archivo, m.tipo, m.titulo, m.orden]);
             await multimediaModel.createBulk(mediaValues, connection);
        }

        await connection.commit();
        return { id_poi: idPoi, ...fullData };

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
    createPoiCompleto,
    getAllPois,
    deletePoi
};
