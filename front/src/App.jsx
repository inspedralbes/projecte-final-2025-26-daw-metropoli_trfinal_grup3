import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Events from "./pages/events/Events";
import Map from "./pages/map/Map";
import Admin from "./pages/admin/Admin";
import Community from "./pages/community/Community";
import Settings from "./pages/settings/Settings";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import "./App.css";

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
