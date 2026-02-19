import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo JSON donde se guarda el tiempo
// Asumimos que weatherService.js guarda 'tiempo.json' en la raíz del proyecto (donde se ejecuta index.js)
const DATA_FILE = path.join(__dirname, '../../tiempo.json');

export const getWeather = (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer los datos del tiempo:', err);
            // Si el archivo no existe, quizás el servicio no ha corrido aún
            if (err.code === 'ENOENT') {
                return res.status(503).json({
                    error: 'Los datos del tiempo aún no están disponibles. Inténtalo de nuevo en unos momentos.'
                });
            }
            return res.status(500).json({ error: 'Error interno al obtener los datos del tiempo.' });
        }

        if (!data || data.trim() === '') {
             return res.json([]); // Return empty array if file is empty
        }

        try {
            const weatherData = JSON.parse(data);
            res.json(weatherData);
        } catch (parseError) {
            console.error('Error al parsear el JSON:', parseError);
            res.status(500).json({ error: 'Error al procesar los datos del tiempo.' });
        }
    });
};

export default {
    getWeather
};
