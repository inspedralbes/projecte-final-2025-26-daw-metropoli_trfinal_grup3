import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRScanner from '../components/QrScanner';
import { useNavigate } from 'react-router-dom';

const CircuitScannerPage = () => {
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleResult = (decodedText) => {
        try {
            const qrData = JSON.parse(decodedText);
            if (qrData.nodo_actual) {
                alert(t("scanner.alerts.scanned_node", "Has escaneado el Nodo {{node}}. Llevándote a navegación...", { node: qrData.nodo_actual }));
                // REDIRECT A AR NAVIGATION CON ESTADO
                // navigate('/ar-navigation', { state: { nodoOrigen: qrData.nodo_actual } });
            } else {
                throw new Error("Formato inválido");
            }
        } catch (e) {
            setError(t("scanner.errors.invalid_format", "El código QR no es un nodo válido del circuito."));
        }
    };

    return (
        <div className="h-[100dvh] w-full bg-slate-950 flex flex-col items-center justify-center font-display text-white px-6">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2 uppercase tracking-tight italic">{t("scanner.title", "Escáner de Circuito")}</h1>
                <p className="text-slate-400 text-sm">{t("scanner.instructions", "Escanea el código QR situado en tu posición actual para empezar a guiarte.")}</p>
            </div>

            {error ? (
                <div className="bg-red-500/10 border border-red-500 text-red-400 p-6 rounded-[2rem] text-center max-w-sm">
                    <span className="material-symbols-outlined text-4xl mb-2">error</span>
                    <p className="font-medium">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="mt-6 bg-red-500 text-white px-6 py-2 rounded-xl font-bold w-full active:scale-95 transition-transform"
                    >
                        {t("common.retry", "Reintentar")}
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
                {t("common.back", "Volver")}
            </button>
        </div>
    );
};

export default CircuitScannerPage;
