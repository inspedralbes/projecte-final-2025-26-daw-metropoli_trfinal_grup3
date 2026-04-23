import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Map from "./pages/map/Map";
import Admin from "./pages/admin/Admin";
import Community from "./pages/community/Community";
import Settings from "./pages/settings/Settings";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import { FriendsProvider } from "./context/FriendsContext";
import QRScanner from "./components/QrScanner";
import "./App.css";

function App() {
  useEffect(() => {
    // Initialize Dark Mode
    const savedTheme = localStorage.getItem("theme");
    // Default to true (dark) if not set, or read from localStorage
    const isDark = savedTheme === "dark" || savedTheme === null;
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Initialize Theme Color
    const themeColor = localStorage.getItem("themeColor") || "default";
    const root = document.documentElement;
    if (themeColor === "red") {
      root.style.setProperty("--theme-color", "#ef4444");
      root.style.setProperty("--theme-text", "#ffffff");
    } else if (themeColor === "green") {
      root.style.setProperty("--theme-color", "#10b981");
      root.style.setProperty("--theme-text", "#ffffff");
    } else if (themeColor === "pink") {
      root.style.setProperty("--theme-color", "#ff007f");
      root.style.setProperty("--theme-text", "#ffffff");
    } else {
      root.style.removeProperty("--theme-color");
      root.style.removeProperty("--theme-text");
    }
  }, []);

  return (
    <FriendsProvider>
      <div className="map-page-wrapper">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Map />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/community" element={<Community />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/escaneo" element={<QRScanner />} />
        </Routes>
      </div>
    </FriendsProvider>
  );
}

export default App;
