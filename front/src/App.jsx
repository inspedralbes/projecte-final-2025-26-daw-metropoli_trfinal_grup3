import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Events from "./pages/events/Events";
import Map from "./pages/map/Map";
import Admin from "./pages/admin/Admin";
import Community from "./pages/community/Community";
import Settings from "./pages/settings/Settings";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import QRScanner from "./components/QRScanner";
import "./App.css";

function App() {
  return (
    <div className="map-page-wrapper">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/" element={<Map />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/community" element={<Community />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/escaneo" element={<QRScanner />} />
      </Routes>
    </div>
  );
}

export default App;
