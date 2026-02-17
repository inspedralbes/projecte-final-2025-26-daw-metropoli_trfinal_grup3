import { Routes, Route } from 'react-router-dom';
import TestPage from './pages/TestPage';
import WeatherCard from './components/WeatherCard';
import './App.css';

function App() {
  return (
    <div className="map-page-wrapper">
      <Routes>
        <Route path="/" element={<TestPage />} />
        <Route path="/weather" element={<WeatherCard />} />
      </Routes>
    </div>
  );
}

export default App;
