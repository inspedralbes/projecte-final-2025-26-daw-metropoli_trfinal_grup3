import tramoModel from '../models/tramoModel.js';
import qrModel from '../models/qrModel.js';
import poiModel from '../models/poiModel.js';
import dijkstraUtils from '../utils/dijkstraUtils.js';

// Objeto global en memoria RAM para el acceso instantáneo
let qrCacheMundial = {};

/**
 * Función que pre-calcula los POIs más cercanos para cada QR registrado.
 */
const recalculateGlobalCache = async () => {
    console.log('🔄 Iniciando pre-cálculo de caché mundial de rutas...');
    
    // 1. Obtener todos los datos necesarios
    const tramos = await tramoModel.getAll();
    const qrs = await qrModel.getAll();
    const pois = await poiModel.getAll();

    // 2. Construir el grafo (Lista de adyacencia)
    const graph = {};
    tramos.forEach(t => {
        if (!graph[t.id_nodo_origen]) graph[t.id_nodo_origen] = [];
        if (!graph[t.id_nodo_destino]) graph[t.id_nodo_destino] = [];

        graph[t.id_nodo_origen].push({ node: String(t.id_nodo_destino), weight: parseFloat(t.distancia_metros) });
        if (t.es_bidireccional) {
            graph[t.id_nodo_destino].push({ node: String(t.id_nodo_origen), weight: parseFloat(t.distancia_metros) });
        }
    });

    // 3. Agrupar POIs por categoría para las búsquedas
    const poisPorCategoria = {};
    pois.forEach(p => {
        if (!poisPorCategoria[p.id_categoria]) poisPorCategoria[p.id_categoria] = [];
        poisPorCategoria[p.id_categoria].push(p);
    });

    const nuevoCache = {};

    // 4. Para cada QR, buscar los POIs más cercanos
    for (const qr of qrs) {
        const startNode = qr.id_nodo_inicio;
        const infoCercana = {
            id_nodo: startNode,
            slug: qr.slug,
            categorias: {}
        };

        // Buscamos, por ejemplo, los 3 POIs más cercanos de cada categoría disponible
        // (O los 3 más cercanos en general si prefieres)
        // Según el prompt: "los 2 baños más cercanos y los 2 puestos de comida más cercanos"
        for (const idCat in poisPorCategoria) {
            const targetNodes = poisPorCategoria[idCat].map(p => p.id_nodo_acceso);
            const nearest = dijkstraUtils.calculateNearestTargets(graph, startNode, targetNodes, 2);
            
            // Enriquecer con nombres de POIs
            infoCercana.categorias[idCat] = nearest.map(n => {
                const poi = pois.find(p => p.id_nodo_acceso === n.node && String(p.id_categoria) === idCat);
                return {
                    id_poi: poi?.id_poi,
                    nombre: poi?.nombre,
                    distancia: n.distance
                };
            });
        }

        nuevoCache[qr.slug] = infoCercana;
    }

    qrCacheMundial = nuevoCache;
    console.log('✅ Caché mundial recalculada con éxito. QRs indexados:', Object.keys(qrCacheMundial).length);
    return true;
};

/**
 * Obtener datos del caché por slug
 */
const getBySlug = (slug) => {
    return qrCacheMundial[slug] || null;
};

export default {
    recalculateGlobalCache,
    getBySlug
};
