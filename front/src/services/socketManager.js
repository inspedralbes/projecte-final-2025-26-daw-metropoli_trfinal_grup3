import { io } from "socket.io-client";

// In production the frontend is served by Nginx which proxies /socket.io/ → backend:3000.
// So we must connect to the SAME origin (empty string), NOT to http://localhost:3000.
// In local dev (localhost) we keep the explicit backend URL so it works without Nginx.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const isLocalhost = API_URL.includes("localhost") || API_URL.includes("127.0.0.1");
const URL_DEL_SERVIDOR = isLocalhost ? API_URL : "";

const socket = io(URL_DEL_SERVIDOR, {
  // polling first (works over HTTP/HTTPS), then upgrades to WebSocket automatically
  transports: ["polling", "websocket"],
  reconnectionDelayMax: 10000,
  path: "/socket.io/",
});

export default socket;
