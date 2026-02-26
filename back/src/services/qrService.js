import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import nodoModel from '../models/nodoModel.js';
import qrModel from '../models/qrModel.js';
import tramoModel from '../models/tramoModel.js';
import poiModel from '../models/poiModel.js';
import dijkstraUtils from '../utils/dijkstraUtils.js';

/**
 * Obtiene todos los QR codes registrados en la base de datos.
 */
const getAllQrCodes = async () => {
    return await qrModel.getAll();
};

/**
 * Genera un QR code para un nodo de navegación concreto,
 * lo guarda en el filesystem y lo registra en la base de datos.
 */
const generateQrCode = async (id_nodo, zona) => {
    const node = await nodoModel.getById(id_nodo);
    if (!node) {
        const error = new Error(`Node with ID ${id_nodo} not found.`);
        error.status = 404;
        throw error;
    }

    const slugIndicador = zona || `nodo-${id_nodo}`;
    const fileName  = `${slugIndicador}.png`;
    const publicDir = path.join(process.cwd(), 'public', 'qrs');

    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    const filePath  = path.join(publicDir, fileName);
    const dbUrlPath = `/public/qrs/${fileName}`;

    // Payload: el slug es lo que leerá el escáner en el móvil
    const qrData = JSON.stringify({ slug: slugIndicador });

    await QRCode.toFile(filePath, qrData, {
        errorCorrectionLevel: 'H',
        type: 'png',
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' }
    });

    await qrModel.upsertBySlug({
        slug: slugIndicador,
        id_nodo_inicio: parseInt(id_nodo, 10),
        ruta_archivo_qr: dbUrlPath
    });

    return { id_nodo: parseInt(id_nodo, 10), qr_url: dbUrlPath, slug: slugIndicador };
};

/**
 * Regenera los PNGs de TODOS los QRs registrados en la base de datos.
 */
const generateAllQrCodes = async () => {
    const qrs = await qrModel.getAll();

    const publicDir = path.join(process.cwd(), 'public', 'qrs');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    const resultados = [];

    for (const qr of qrs) {
        const fileName = `${qr.slug}.png`;
        const filePath = path.join(publicDir, fileName);
        const qrData   = JSON.stringify({ slug: qr.slug });

        await QRCode.toFile(filePath, qrData, {
            errorCorrectionLevel: 'H',
            type: 'png',
            margin: 2,
            color: { dark: '#0f172a', light: '#ffffff' }
        });

        console.log(`📲 QR generado: ${fileName} (nodo ${qr.id_nodo_inicio})`);
        resultados.push({ slug: qr.slug, archivo: fileName });
    }

    console.log(`✅ ${resultados.length} QRs generados/actualizados.`);
    return resultados;
};

/**
 * Genera el PNG del QR para un nodo específico Y calcula los 3 POIs más cercanos.
 * Se llama al seleccionar un punto/nodo concreto en el panel de admin.
 *
 * @param {number|string} id_nodo - ID del nodo de navegación
 * @param {string} zona           - Slug/nombre de zona para el archivo QR
 * @returns {{ qr, pois_cercanos }}
 */
const generateQrWithNearestPois = async (id_nodo, zona) => {
    // Paso 1: Generar el QR PNG y persistirlo (upsert)
    const qrInfo = await generateQrCode(id_nodo, zona);

    // Paso 2: Construir el grafo de navegación
    const tramos = await tramoModel.getAll();
    const graph  = {};
    tramos.forEach(t => {
        if (!graph[t.id_nodo_origen])  graph[t.id_nodo_origen]  = [];
        if (!graph[t.id_nodo_destino]) graph[t.id_nodo_destino] = [];
        graph[t.id_nodo_origen].push({ node: String(t.id_nodo_destino), weight: parseFloat(t.distancia_metros) });
        if (t.es_bidireccional) {
            graph[t.id_nodo_destino].push({ node: String(t.id_nodo_origen), weight: parseFloat(t.distancia_metros) });
        }
    });

    // Paso 3: POIs activos como destinos del algoritmo
    const pois        = await poiModel.getAll();
    const poisActivos = pois.filter(p => p.activo !== 0 && p.activo !== false);
    const targetNodes = poisActivos.map(p => String(p.id_nodo_acceso));

    // Paso 4: Dijkstra → 3 POIs más cercanos al nodo del QR
    const nearest = dijkstraUtils.calculateNearestTargets(graph, String(id_nodo), targetNodes, 3);

    // Paso 5: Enriquecer con nombre + categoría del POI
    const pois_cercanos = nearest.map(resultado => {
        const poi = poisActivos.find(p => String(p.id_nodo_acceso) === String(resultado.node));
        return {
            id_poi:    poi?.id_poi,
            nombre:    poi?.nombre,
            categoria: poi?.id_categoria,
            distancia_metros: resultado.distance
        };
    });

    return { qr: qrInfo, pois_cercanos };
};

export default {
    getAllQrCodes,
    generateQrCode,
    generateAllQrCodes,
    generateQrWithNearestPois
};
