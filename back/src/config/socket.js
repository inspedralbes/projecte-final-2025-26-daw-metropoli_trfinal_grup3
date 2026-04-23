// Guardamos en una variable global la antena (io) para poder usarla en otros archivos
let antenaSocket;

export const initSocket = (servidorPrincipal) => {
    // Importamos la librería aquí dentro para inicializarla con el servidor HTTP de tu aplicación
    import('socket.io').then(({ Server }) => {
        antenaSocket = new Server(servidorPrincipal, {
            cors: {
                // Permitimos que el frontend (Vite) se pueda conectar a nosotros sin que el navegador le bloquee por seguridad
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        // Este bloque se ejecuta cada vez que un usuario nuevo entra en la página web
        antenaSocket.on("connection", (cliente) => {
            console.log(`🔌 Un dispositivo se ha conectado a la radio: ${cliente.id}`);

            // Unirse a una sala específica (para chat privado o secciones)
            cliente.on("join_room", (room) => {
                cliente.join(room);
                console.log(`🏠 Usuario ${cliente.id} se unió a la sala: ${room}`);
            });

            // Chat privado persistente
            cliente.on("private_message", async (data) => {
                const { room, senderId, senderName, receiverId, text } = data;
                
                // 1. Guardar en MongoDB (importamos dinámicamente o usamos el service)
                try {
                    const { default: comunidadService } = await import('../services/comunidadService.js');
                    const mensajeGuardado = await comunidadService.saveMensaje({
                        room, senderId, senderName, receiverId, text
                    });

                    // 2. Emitir a la sala (incluye al remitente si está en ella)
                    antenaSocket.to(room).emit("private_message", mensajeGuardado);
                } catch (error) {
                    console.error("❌ Error al guardar mensaje socket:", error);
                }
            });

            // Y si cierra la pestaña, lo registramos para que no consuma memoria a lo tonto
            cliente.on("disconnect", () => {
                console.log(`❌ Dispositivo desconectado: ${cliente.id}`);
            });
        });

        console.log("📻 Radio WebSocket inicializada y emitiendo");
    });
};

export const emitirMensaje = (canal, mensaje) => {
    if (antenaSocket) {
        // io.emit envía un mensaje a TODOS los clientes conectados al mismo tiempo
        antenaSocket.emit(canal, mensaje);
    } else {
        console.warn("⚠️ Intentando emitir mensaje, pero la antenaSocket no se ha inicializado");
    }
};
