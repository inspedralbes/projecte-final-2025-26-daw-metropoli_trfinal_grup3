import tramoModel from '../models/tramoModel.js';
import nodoModel from '../models/nodoModel.js';
import { calculateDistance } from '../utils/distanceUtils.js';

const createTramo = async (tramoData) => {
    return await tramoModel.create(tramoData);
};

const getAllTramos = async () => {
    return await tramoModel.getAll();
};

/**
 * Recibe un array de objetos { id_nodo_origen, id_nodo_destino }
 * Calcula la distancia real y los inserta en la base de datos.
 */
const createTramosBulk = async (tramosArray) => {
    if (!Array.isArray(tramosArray) || tramosArray.length === 0) return 0;

    const allNodos = await nodoModel.getAll();
    let createdCount = 0;

    for (const link of tramosArray) {
        const origen = allNodos.find(n => n.id_nodo === parseInt(link.id_nodo_origen, 10));
        const destino = allNodos.find(n => n.id_nodo === parseInt(link.id_nodo_destino, 10));

        if (origen && destino) {
            const dist = calculateDistance(
                origen.latitud, origen.longitud,
                destino.latitud, destino.longitud
            );

            // A -> B
            await tramoModel.create({
                id_nodo_origen: origen.id_nodo,
                id_nodo_destino: destino.id_nodo,
                distancia_metros: dist.toFixed(2),
                es_accesible: 1, 
                tipo_terreno: 'asfalto'
            });
            createdCount++;

            // B -> A (Only if es_doble_via is strictly true)
            if (link.es_doble_via === true) {
                await tramoModel.create({
                    id_nodo_origen: destino.id_nodo,
                    id_nodo_destino: origen.id_nodo,
                    distancia_metros: dist.toFixed(2),
                    es_accesible: 1, 
                    tipo_terreno: 'asfalto'
                });
                createdCount++;
            }
        }
    }

    return createdCount;
};

/**
 * Recibe un array de coordenadas [{lat, lng}, ...] y un flag isBidirectional.
 * Crea los nodos si no existen y los tramos entre ellos.
 */
const createPathFromCoords = async (coords, isBidirectional) => {
    if (!Array.isArray(coords) || coords.length < 2) return 0;

    const nodeIds = [];
    const connection = null; // Usaremos la query por defecto

    for (const coord of coords) {
        // Buscamos si ya existe un nodo muy cerca (umbral de 1 metro aprox)
        // Por simplicidad en este MVP, crearemos nodos nuevos para cada punto de la polilínea
        // a menos que el usuario esté pinchando exactamente en un POI (esto se gestionará en el front)
        
        const newNode = await nodoModel.create({
            latitud: coord.lat,
            longitud: coord.lng,
            descripcion: 'Punto de ruta dibujado'
        }, connection);
        nodeIds.push(newNode.id_nodo);
    }

    const tramosToCreate = [];
    for (let i = 0; i < nodeIds.length - 1; i++) {
        tramosToCreate.push({
            id_nodo_origen: nodeIds[i],
            id_nodo_destino: nodeIds[i + 1],
            es_doble_via: isBidirectional
        });
    }

    return await createTramosBulk(tramosToCreate);
};

const getTramosByNode = async (nodeId) => {
    return await tramoModel.getByNodeId(nodeId);
};

const deleteTramo = async (id) => {
    return await tramoModel.deleteById(id);
};

export default {
    createTramo,
    getAllTramos,
    createTramosBulk,
    createPathFromCoords,
    getTramosByNode,
    deleteTramo
};
