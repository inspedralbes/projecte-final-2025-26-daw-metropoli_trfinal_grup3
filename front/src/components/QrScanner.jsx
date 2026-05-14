import React, { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onResult, onError }) => {
    useEffect(() => {
        let html5QrCode;

        const startScanner = async () => {
            try {
                if (!window.isSecureContext && window.location.hostname !== "localhost") {
                    throw new Error("SECURE_CONTEXT_REQUIRED");
                }

                html5QrCode = new Html5Qrcode("qr-reader");
                
                const config = {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                };

                const successCallback = (decodedText) => {
                    html5QrCode.stop().then(() => {
                        if (onResult) onResult(decodedText);
                    }).catch(err => console.error("Error stopping scanner", err));
                };

                try {
                    // Intentamos primero con la cámara trasera (environment)
                    await html5QrCode.start({ facingMode: "environment" }, config, successCallback, () => {});
                } catch (firstErr) {
                    console.warn("Failed to start with environment camera, falling back to any available camera:", firstErr);
                    // Si falla (ej: en escritorio), intentamos con cualquier cámara disponible
                    await html5QrCode.start({ facingMode: "user" }, config, successCallback, () => {});
                }
            } catch (err) {
                console.error("Camera start error:", err);
                let userFriendlyError = "Error al acceder a la cámara.";
                
                if (err === "SECURE_CONTEXT_REQUIRED") {
                    userFriendlyError = "La cámara requiere una conexión segura (HTTPS) o usar localhost.";
                } else if (err.name === "NotAllowedError" || err.toString().includes("NotAllowedError")) {
                    userFriendlyError = "Permiso denegado. Por favor, permite el acceso a la cámara en los ajustes de tu navegador.";
                } else if (err.name === "NotFoundError" || err.toString().includes("NotFoundError")) {
                    userFriendlyError = "No se ha encontrado ninguna cámara en este dispositivo.";
                } else {
                    userFriendlyError = "Error al iniciar la cámara. Revisa los permisos y asegúrate de que ninguna otra app la esté usando.";
                }

                if (onError) onError(userFriendlyError);
            }
        };

        startScanner();

        return () => {
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch(console.error);
            }
        };
    }, [onResult, onError]);

    return (
        <div className="relative w-full aspect-square bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800 dark:border-slate-700">
            {/* The div where html5-qrcode injects the video stream */}
            <div id="qr-reader" className="w-[105%] h-[105%] -ml-[2.5%] -mt-[2.5%]"></div>

            {/* Overlay UI */}
            <div className="absolute inset-0 pointer-events-none border-4 border-primary/30 m-8 rounded-2xl flex items-center justify-center">
                <div className="w-full h-0.5 bg-primary/50 absolute animate-scan-line"></div>
                <div className="w-12 h-12 border-4 border-primary border-t-transparent border-l-transparent rounded-full animate-spin opacity-50"></div>
            </div>
            
            <style>{`
                @keyframes scan-line {
                    0% { top: 10%; }
                    50% { top: 90%; }
                    100% { top: 10%; }
                }
                .animate-scan-line {
                    animation: scan-line 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default QRScanner;
