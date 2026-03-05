import tramoModel from '../models/tramoModel.js';
import nodoModel from '../models/nodoModel.js';
import poiModel from '../models/poiModel.js';
import dijkstraUtils from '../utils/dijkstra.js';

const calcularRuta = async (idPoiOrigen, idPoiDestino) => {
    // 1. Obtener Nodos de Acceso
    const idNodoOrigen = await poiModel.getNodoAccesoId(idPoiOrigen);
    const idNodoDestino = await poiModel.getNodoAccesoId(idPoiDestino);

    if (!idNodoOrigen || !idNodoDestino) {
        throw new Error('Uno de los POIs no tiene un punto de acceso (nodo) configurado o no existe.');
    }

    if (String(idNodoOrigen) === String(idNodoDestino)) {
        const nodo = await nodoModel.getById(idNodoOrigen);
        return { 
            distancia_total: 0, 
            path: [idNodoOrigen],
            detalles: [nodo] 
        };
    }

    // 2. Obtener todos los tramos
    const tramos = await tramoModel.getAll();
    if (!tramos || tramos.length === 0) {
        throw new Error('No hay tramos de navegación definidos en el sistema.');
    }

    // 3. Construir Grafo
    const graph = {};
    tramos.forEach(t => {
        const u = String(t.id_nodo_origen);
        const v = String(t.id_nodo_destino);
        const weight = parseFloat(t.distancia_metros) || 1;

        if (!graph[u]) graph[u] = [];
        if (!graph[v]) graph[v] = [];

        // Añadimos arista en ambos sentidos por defecto para asegurar conectividad
        // A menos que explícitamente se añada soporte para sentido único en el futuro
        graph[u].push({ node: v, weight });
        graph[v].push({ node: u, weight });
    });

    // 4. Calcular Ruta
    const rutaNodosIds = dijkstraUtils.calculateShortestPath(graph, idNodoOrigen, idNodoDestino);

    if (!rutaNodosIds) {
        throw new Error('No se ha encontrado un camino a través de los tramos hacia el destino.');
    }

    // 5. Enriquecer Ruta
    const rutaEnriquecida = [];
    for (const idNodo of rutaNodosIds) {
        const nodoInfo = await nodoModel.getById(idNodo);
        rutaEnriquecida.push(nodoInfo);
    }

    return {
        path: rutaNodosIds,
        detalles: rutaEnriquecida
    };
};

const calcularRutaDesdeCoords = async (lat, lng, idPoiDestino) => {
    // 1. Encontrar el nodo más cercano
    const nodoOrigenInfo = await nodoModel.findNearestNode(lat, lng);
    const idNodoDestino = await poiModel.getNodoAccesoId(idPoiDestino);

    if (!nodoOrigenInfo) {
        throw new Error('No se encontraron nodos de navegación cercanos a tu posición.');
    }
    if (!idNodoDestino) {
        throw new Error('El destino seleccionado no tiene un punto de acceso configurado.');
    }

    const idNodoOrigen = nodoOrigenInfo.id_nodo;

    if (String(idNodoOrigen) === String(idNodoDestino)) {
        return { 
            distancia_total: 0, 
            path: [idNodoOrigen],
            detalles: [nodoOrigenInfo]
        };
    }

    // 2. Obtener tramos
    const tramos = await tramoModel.getAll();
    if (!tramos || tramos.length === 0) {
        throw new Error('No hay una red de tramos disponible para navegar en el sistema.');
    }

    // 3. Construir Grafo
    const graph = {};
    tramos.forEach(t => {
        const u = String(t.id_nodo_origen);
        const v = String(t.id_nodo_destino);
        const weight = parseFloat(t.distancia_metros) || 1;

        if (!graph[u]) graph[u] = [];
        if (!graph[v]) graph[v] = [];

        // Bidireccional por defecto para máxima conectividad
        graph[u].push({ node: v, weight });
        graph[v].push({ node: u, weight });
    });

    console.log(`[DEBUG] Dijkstra: Buscando ruta desde ${idNodoOrigen} hasta ${idNodoDestino}`);
    console.log(`[DEBUG] Grafo: ${Object.keys(graph).length} nodos con conexiones.`);
    console.log(`[DEBUG] Nodo Origen en grafo? ${!!graph[String(idNodoOrigen)]}`);
    console.log(`[DEBUG] Nodo Destino en grafo? ${!!graph[String(idNodoDestino)]}`);

    // 4. Calcular Ruta
    const rutaNodosIds = dijkstraUtils.calculateShortestPath(graph, idNodoOrigen, idNodoDestino);

    if (!rutaNodosIds) {
        throw new Error('No existe una conexión de tramos que llegue hasta ese destino (Gráfico desconectado).');
    }

    // 5. Enriquecer Ruta
    const rutaEnriquecida = [];
    for (const idNodo of rutaNodosIds) {
        const nodoInfo = await nodoModel.getById(idNodo);
        rutaEnriquecida.push(nodoInfo);
    }

    return {
        path: rutaNodosIds,
        detalles: rutaEnriquecida
    };
};

export default {
    calcularRuta,
    calcularRutaDesdeCoords
};
