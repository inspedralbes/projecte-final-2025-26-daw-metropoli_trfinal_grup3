import tramoModel from '../models/tramoModel.js';
import nodoModel from '../models/nodoModel.js';
import poiModel from '../models/poiModel.js';
import calculateShortestPath from '../utils/dijkstra.js';

const calcularRuta = async (idPoiOrigen, idPoiDestino) => {
    // 1. Obtener Nodos de Acceso
    const nodoOrigen = await poiModel.getNodoAccesoId(idPoiOrigen);
    const nodoDestino = await poiModel.getNodoAccesoId(idPoiDestino);

    if (!nodoOrigen || !nodoDestino) {
        throw new Error('Uno de los POIs no tiene un punto de acceso válido o no existe.');
    }

    if (nodoOrigen === nodoDestino) {
        return { 
            distancia_total: 0, 
            nodos: [await nodoModel.getById(nodoOrigen)] 
        };
    }

    // 2. Obtener todos los tramos para construir el grafo
    const tramos = await tramoModel.getAll();

    // 3. Construir Grafo
    const graph = {};
    
    // Inicializar grafo con todos los nodos posibles (extraídos de los tramos)
    tramos.forEach(t => {
        if (!graph[t.id_nodo_origen]) graph[t.id_nodo_origen] = [];
        if (!graph[t.id_nodo_destino]) graph[t.id_nodo_destino] = [];

        // Añadir arista origen -> destino
        graph[t.id_nodo_origen].push({ node: String(t.id_nodo_destino), weight: parseFloat(t.distancia_metros) });

        // Si es bidireccional, añadir arista destino -> origen
        if (t.es_bidireccional) {
            graph[t.id_nodo_destino].push({ node: String(t.id_nodo_origen), weight: parseFloat(t.distancia_metros) });
        }
    });

    // 4. Calcular Ruta (Dijkstra)
    // Nota: calculateShortestPath se exporta como default en utils/dijkstra.js (según edit del usuario)
    // Ojo: el usuario editó dijkstra.js para usar export default { calculateShortestPath }.
    // Entonces import calculateShortestPath from ... traerá el objeto { calculateShortestPath: fn }
    // Debería ser: import dijkstraUtils from ... y usar dijkstraUtils.calculateShortestPath
    // O cambiar dijkstra.js a export default fn.
    // Revisando el edit del usuario en dijkstra.js:
    // export default { calculateShortestPath };
    // Entonces:
    const rutaNodosIds = calculateShortestPath.calculateShortestPath(graph, nodoOrigen, nodoDestino);

    if (!rutaNodosIds) {
        throw new Error('No se ha encontrado una ruta entre estos puntos.');
    }

    // 5. Enriquecer Ruta (obtener coordenadas de los nodos)
    const rutaEnriquecida = [];
    // eslint-disable-next-line no-unused-vars
    let distanciaTotal = 0;

    for (let i = 0; i < rutaNodosIds.length; i++) {
        const idNodo = rutaNodosIds[i];
        const nodoInfo = await nodoModel.getById(idNodo);
        rutaEnriquecida.push(nodoInfo);
    }

    return {
        path: rutaNodosIds,
        detalles: rutaEnriquecida
    };
};

export default {
    calcularRuta
};
