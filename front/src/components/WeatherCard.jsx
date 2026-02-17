import { useState, useEffect } from 'react';
import './WeatherCard.css';

//doc temporal para ver si la api funcionaba
//dejare marcadas las partes donde se recogen los datos de la api y como. 
// air, track, rain, wind 
const WeatherCard = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //el fetch para obtener los datos de la api
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                //usad la variable para la url de la api porfis
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/weather`);
                if (!response.ok) {
                    throw new Error('No se pudo obtener la información del tiempo');
                }
                const data = await response.json();
                setWeatherData(data);
            } catch (err) {
                console.error("Error fetching weather:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    //ifs para gestionar el estado de carga, se pueden ignorar
    if (loading) return <div className="weather-card loading">Cargando...</div>;
    if (error) return <div className="weather-card error">Error: {error}</div>;
    if (!weatherData || !weatherData.hourly) return <div className="weather-card empty">No hay datos disponibles</div>;

    // Explicación: Este código busca en la lista de horas que nos da la API cual corresponde a la hora actual.
    // 1. Coge la hora actual.
    // 2. La redondea hacia abajo (minutos 0).
    // 3. Busca en el array esa hora exacta o la más cercana.

    // Buscar la hora más cercana a la actual
var now = new Date();
now.setMinutes(0, 0, 0);
var nowTime = now.getTime();

var times = weatherData.hourly.time;
var currentIndex = 0;
var minDiff = Math.abs(new Date(times[0]).getTime() - nowTime);

for (var i = 1; i < times.length; i++) {
    var diff = Math.abs(new Date(times[i]).getTime() - nowTime);
    if (diff < minDiff) {
        minDiff = diff;
        currentIndex = i;
    }
}
    //VARIABLES IMPORTANTES: usad esto para vuestro componente :D
    const currentTemp = weatherData.hourly.temperature_2m[currentIndex];
    const precipProb = weatherData.hourly.precipitation_probability[currentIndex];
    const soilTemp = weatherData.hourly.soil_temperature_0cm[currentIndex];
    const windSpeed = weatherData.hourly.wind_speed_10m ? weatherData.hourly.wind_speed_10m[currentIndex] : 0; // Fallback if wind not yet fetched

    // chorrada para que segun la temperatura se vea un emoji u otro se puede ignorar 
    let weatherIcon = '☀️';
    let weatherStatus = 'Soleado';

    if (precipProb > 20) {
        weatherIcon = '⛅';
        weatherStatus = 'Parcialmente nublado';
    }
    if (precipProb > 50) {
        weatherIcon = '☁️';
        weatherStatus = 'Nublado';
    }
    // if (precipProb > 70 || precip > 0.1) {
    if (precipProb > 70) {
        weatherIcon = '🌧️';
        weatherStatus = 'Lluvia';
    }
    // if (precipProb > 90 || precip > 2.0) {
    if (precipProb > 90) {
        weatherIcon = '⛈️';
        weatherStatus = 'Tormenta';
    }

    return (
        <div className="weather-card">
            <div className="weather-header">
                <h3>METRÓPOLI WEATHER</h3>
            </div>

            <div className="weather-grid">
                <div className="weather-item">
                    <span className="item-label">AIR</span>
                    <span className="item-value">{currentTemp}°C</span>
                </div>

                <div className="weather-item">
                    <span className="item-label">TRACK</span>
                    <span className="item-value">{soilTemp}°C</span>
                </div>

                <div className="weather-item">
                    <span className="item-label">RAIN</span>
                    <span className="item-value">{precipProb}%</span>
                </div>

                <div className="weather-item">
                    <span className="item-label">WIND</span>
                    <span className="item-value">{windSpeed}km/h</span>
                </div>
            </div>
            <div className="weather-status-bar">
                <span className="status-text">{weatherStatus} {weatherIcon}</span>
            </div>
        </div>
    );
};

export default WeatherCard;
