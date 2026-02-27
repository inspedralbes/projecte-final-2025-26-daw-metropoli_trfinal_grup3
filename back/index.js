import "dotenv/config"; // Cargar variables de entorno
import express from "express";
import cors from "cors";
import { createServer } from "http"; // Necesario para envolver el servidor de Express en uno HTTP normal
import routes from "./src/routes/index.js";
import "./src/services/weatherService.js";
import { initSocket } from "./src/config/socket.js"; // Nuestra antena de radio nueva
import connectMongo from "./src/config/mongo.js"; // Conexión a MongoDB

// Iniciamos la conexión a MongoDB (para la Comunidad / Foro)
connectMongo();

const app = express();
// Envuelve la aplicación normal (Express) en un servidor web real, para que pueda emitir cosas además de sólo responder
const servidorHTTP = createServer(app);

// Encendemos la antena y le damos control sobre nuestro servidorHTTP
initSocket(servidorHTTP);
const port = 3000;

app.use(cors()); // Habilitar CORS para peticiones del frontend
app.use(express.json());
app.use(express.static("public")); // Servir archivos estáticos (imágenes)

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("MetroPoli Backend API is running");
});

// En vez de que `app` encienda, usamos `servidorHTTP` (la versión que tiene la antena pegada)
servidorHTTP.listen(port, () => {
  console.log(`🌍 Server listening on port ${port} (Con WebSockets Activados)`);
});
