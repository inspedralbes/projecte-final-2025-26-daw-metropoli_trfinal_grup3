import fs from 'fs';

const url = 'https://api.open-meteo.com/v1/forecast?latitude=41.5697&longitude=2.2578&hourly=temperature_2m,precipitation_probability,precipitation,soil_temperature_0cm,wind_speed_10m&timezone=Europe%2FMadrid';

async function actualizarTiempo() {
    console.log("Actualizando datos del tiempo...");
    try {
        const response = await fetch(url);

        if (!response.ok) throw new Error('Error en la API');

        const data = await response.json();

        fs.writeFileSync('tiempo.json', JSON.stringify(data, null, 2));

        console.log('Datos guardados correctamente en tiempo.json');
    } catch (error) {
        console.error('Error al guardar datos:', error);
    }
}

actualizarTiempo();
setInterval(actualizarTiempo, 30 * 60 * 1000);

export default {
    actualizarTiempo
};
