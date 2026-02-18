const calculateShortestPath = (graph, startNode, endNode) => {
    const distances = {};
    const previous = {};
    // Usamos un array simple como cola de prioridad
    const pq = [];

    // Helper para encolar manteniendo orden (o simplemente push y luego buscar min)
    const enqueue = (node, priority) => {
        pq.push({ node, priority });
        pq.sort((a, b) => a.priority - b.priority);
    };

    const dequeue = () => {
        return pq.shift();
    };

    // Inicialización
    for (let vertex in graph) {
        if (vertex === String(startNode)) {
            distances[vertex] = 0;
            enqueue(vertex, 0);
        } else {
            distances[vertex] = Infinity;
            enqueue(vertex, Infinity);
        }
        previous[vertex] = null;
    }

    const path = []; 

    while (pq.length) {
        let smallestObj = dequeue();
        let smallest = smallestObj.node;

        if (smallest === String(endNode)) {
            // Hemos llegado al destino, reconstruir camino
            while (previous[smallest]) {
                path.push(smallest);
                smallest = previous[smallest];
            }
            break;
        }

        if (smallest || distances[smallest] !== Infinity) {
            for (let neighbor in graph[smallest]) {
                let nextNode = graph[smallest][neighbor];
                
                let candidate = distances[smallest] + nextNode.weight;
                let nextNeighbor = nextNode.node;

                if (candidate < distances[nextNeighbor]) {
                    distances[nextNeighbor] = candidate;
                    previous[nextNeighbor] = smallest;
                    enqueue(nextNeighbor, candidate);
                }
            }
        }
    }
    
    if (path.length === 0 && String(startNode) !== String(endNode)) {
        return null; // No se encontró camino
    }

    return path.concat(String(startNode)).reverse().map(Number);
};

export default {
    calculateShortestPath
};
