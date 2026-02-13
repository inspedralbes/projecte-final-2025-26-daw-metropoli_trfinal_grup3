import { Routes, Route } from 'react-router-dom';
import TestPage from './pages/TestPage';
import './App.css';

function App() {
  return (
    <div className="map-page-wrapper">
      <Routes>
        <Route path="/" element={<TestPage />} />
      </Routes>
    </div>
  );
}

export default App;
