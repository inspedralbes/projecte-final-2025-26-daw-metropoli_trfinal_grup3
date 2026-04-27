import React, { useState } from 'react';
import QRScanner from '../components/QrScanner';
import { useNavigate } from 'react-router-dom';

const CircuitScannerPage = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleResult = (decodedText) => {
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
    };

    return (
        <div className="h-[100dvh] w-full bg-slate-950 flex flex-col items-center justify-center font-display text-white px-6">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2 uppercase tracking-tight italic">Escáner de Circuito</h1>
                <p className="text-slate-400 text-sm">Escanea el código QR situado en tu posición actual para empezar a guiarte.</p>
            </div>

            {error ? (
                <div className="bg-red-500/10 border border-red-500 text-red-400 p-6 rounded-[2rem] text-center max-w-sm">
                    <span className="material-symbols-outlined text-4xl mb-2">error</span>
                    <p className="font-medium">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="mt-6 bg-red-500 text-white px-6 py-2 rounded-xl font-bold w-full active:scale-95 transition-transform"
                    >
                        Reintentar
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-sm">
                    <QRScanner onResult={handleResult} onError={setError} />
                </div>
            )}

            <button
                onClick={() => navigate(-1)}
                className="mt-12 text-slate-400 flex items-center gap-2 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest"
            >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Volver
            </button>
        </div>
    );
};

export default CircuitScannerPage;
