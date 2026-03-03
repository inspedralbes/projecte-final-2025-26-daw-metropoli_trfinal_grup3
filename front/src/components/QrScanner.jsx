import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

const QRScanner = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const [error, setError] = useState(null);
    const scannerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Component Mount Setup
        let html5QrCode;

        const startScanner = async () => {
            try {
                setHasPermission(true);
                html5QrCode = new Html5Qrcode("qr-reader");

                // Start scanning
                await html5QrCode.start(
                    { facingMode: "environment" }, // Prefer back camera
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0
                    },
                    (decodedText, decodedResult) => {
                        // SUCCESSFUL SCAN LOGIC
                        // Expecting something like: {"nodo_actual": 1}
                        html5QrCode.stop().then(() => {
                            console.log("QR Detenido tras lectura exitosa");
                            try {
                                const qrData = JSON.parse(decodedText);
                                if (qrData.nodo_actual) {
                                    alert(`Has escaneado el Nodo ${qrData.nodo_actual}. Llevándote a navegación...`);
                                    // REDIRECT A AR NAVIGATION CON ESTADO
                                    // navigate('/ar-navigation', { state: { nodoOrigen: qrData.nodo_actual } });
                                } else {
                                    throw new Error("Formato inválido");
                                }
                            } catch (e) {
                                setError("El código QR no es un nodo válido del circuito.");
                            }
                        }).catch(err => console.error("Error parando escáner", err));

                    },
                    (errorMessage) => {
                        // Ignoring generic continuous scanning errors (e.g. "no QR found in frame")
                    }
                );
            } catch (err) {
                setHasPermission(false);
                setError("Error al acceder a la cámara. Revisa los permisos.");
                console.error("Camera start error:", err);
            }
        };

        startScanner();

        // Component Unmount Cleanup
        return () => {
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch(console.error);
            }
        };
    }, []); // Run once on mount

    return (
        <div className="h-[100dvh] w-full bg-slate-950 flex flex-col items-center justify-center font-display text-white px-6">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Escáner de Circuito</h1>
                <p className="text-slate-400 text-sm">Escanea el código QR situado en tu posición actual para empezar a guiarte.</p>
            </div>

            {error ? (
                <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl text-center">
                    <span className="material-symbols-outlined text-3xl mb-2">error</span>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold w-full"
                    >
                        Reintentar
                    </button>
                </div>
            ) : (
                <div className="relative w-full max-w-sm aspect-square bg-slate-900 rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border-2 border-slate-800">
                    {/* The div where html5-qrcode injects the video stream */}
                    <div id="qr-reader" className="w-[105%] h-[105%] -ml-[2.5%] -mt-[2.5%]"></div>

                    {/* Overlay UI */}
                    <div className="absolute inset-0 pointer-events-none border-4 border-primary/50 m-6 rounded-2xl flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent border-l-transparent rounded-full animate-spin opacity-50"></div>
                    </div>
                </div>
            )}

            <button
                onClick={() => navigate(-1)}
                className="mt-12 text-slate-400 flex items-center gap-2 hover:text-white transition-colors"
            >
                <span className="material-symbols-outlined">arrow_back</span>
                Volver
            </button>

        </div>
    );
};

export default QRScanner;
