import multimediaModel from '../models/multimediaModel.js';

const createMultimedia = async (mediaData) => {
    const { id_poi, url_archivo, tipo, titulo, orden } = mediaData;
    return await multimediaModel.create([id_poi, url_archivo, tipo, titulo, orden]);
};

const getMultimediaByPoi = async (idPoi) => {
    return await multimediaModel.getByPoiId(idPoi);
};

export default {
    createMultimedia,
    getMultimediaByPoi
};
