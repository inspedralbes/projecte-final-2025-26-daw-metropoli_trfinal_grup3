import { io } from 'socket.io-client';

// Creamos la antena receptora para el frontend.
// Se conecta automáticamente a la dirección de tu backend (o a localhost de base).
const URL_DEL_SERVIDOR = import.meta.env.VITE_API_URL || "http://localhost:3000";
console.log("WS URL Configurada:", URL_DEL_SERVIDOR);

const socket = io(URL_DEL_SERVIDOR, {
    // Estas opciones evitan que intente reconectarse infinitamente si el backend está apagado
    reconnectionDelayMax: 10000,
    transports: ['websocket'],
});

export default socket;
