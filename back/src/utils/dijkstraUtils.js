/**
 * Algoritmo Dijkstra optimizado para búsqueda de los K destinos más cercanos.
 * 
 * Regla 1: O(N) para extraer el mínimo (evitar .sort()).
 * Regla 2: Set para búsqueda de destinos en O(1).
 * Regla 3: Early Exit cuando se alcanza el límite.
 * 
 * @param {Object} graph - Lista de adyacencia { id: [{node, weight}, ...] }
 * @param {number|string} startNode - ID del nodo inicial
 * @param {Array} targetNodesArray - Array de IDs de nodos objetivo
 * @param {number} limit - Número máximo de POIs a encontrar
 * @returns {Array} Array de objetos { node, distance } ordenados por cercanía
 */
const calculateNearestTargets = (graph, startNode, targetNodesArray, limit) => {
    const distances = {};
    const pq = [];
    const targetsSet = new Set(targetNodesArray.map(String));
    const results = [];

    // Inicialización
    for (let vertex in graph) {
        if (vertex === String(startNode)) {
            distances[vertex] = 0;
            pq.push({ node: vertex, priority: 0 });
        } else {
            distances[vertex] = Infinity;
            pq.push({ node: vertex, priority: Infinity });
        }
    }

    while (pq.length > 0) {
        // Regla 1: Extraer el nodo con menor prioridad manualmente (O(N))
        let minIndex = 0;
        for (let i = 1; i < pq.length; i++) {
            if (pq[i].priority < pq[minIndex].priority) {
                minIndex = i;
            }
        }

        const { node: u, priority: dist } = pq.splice(minIndex, 1)[0];

        // Si la distancia es infinita, no hay más nodos alcanzables
        if (dist === Infinity) break;

        // Regla 3: Early Exit - ¿Es un destino?
        if (targetsSet.has(u)) {
            results.push({ node: Number(u), distance: dist });
            targetsSet.delete(u); // Lo eliminamos para no encontrarlo dos veces si hubiera ciclos raros

            if (results.length >= limit) {
                break; // HEMOS TERMINADO
            }
        }

        // Relajación de aristas
        const neighbors = graph[u] || [];
        for (const neighborObj of neighbors) {
            const v = String(neighborObj.node);
            const weight = neighborObj.weight;
            const alt = dist + weight;

            if (alt < (distances[v] || Infinity)) {
                distances[v] = alt;
                // Actualizar prioridad en la cola
                const targetIdx = pq.findIndex(item => item.node === v);
                if (targetIdx !== -1) {
                    pq[targetIdx].priority = alt;
                } else {
                    // Si por alguna razón no estaba (nodos nuevos dinámicos), lo añadimos
                    pq.push({ node: v, priority: alt });
                }
            }
        }
    }

    return results;
};

export default {
    calculateNearestTargets
};
