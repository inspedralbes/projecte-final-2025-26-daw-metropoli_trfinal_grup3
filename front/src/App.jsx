import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Events from "./pages/events/Events";
import Map from "./pages/map/Map";
import Admin from "./pages/admin/Admin";
import Community from "./pages/community/Community";
import Settings from "./pages/settings/Settings";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import "./App.css";

function App() {
  return (
    <div className="map-page-wrapper">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/" element={<Map />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/community" element={<Community />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
      </Routes>
    </div>
  );
}

export default App;
