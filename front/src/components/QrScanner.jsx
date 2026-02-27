import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

// ID únic per l'element HTML que servirà de contenidor del vídeo de la càmera
const QR_SCANNER_REGION_ID = "qr-scanner-region";

const QrScanner = ({ onResult, onError }) => {
  // Guardem la referència de l'escàner per poder aturar-lo des de la funció de neteja
  const scannerRef = useRef(null);

  useEffect(() => {
    // 1. Creem l'instància de l'escàner lligada al div amb id="qr-scanner-region"
    // Use verbose: false to reduce console noise
    const scanner = new Html5Qrcode(QR_SCANNER_REGION_ID, { verbose: false });
    scannerRef.current = scanner;

    const startScanner = async () => {
        try {
            await scanner.start(
                { facingMode: "environment" }, // càmera posterior en mòbil
                {
                  fps: 10,
                  qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                  // Aturem l'escaneig ràpidament
                  scanner.stop().catch(() => {});
                  onResult(decodedText);
                },
                () => {} // Ignorar frames sense detecció
            );
        } catch (err) {
            console.error("QR Scanner error:", err);
            if (onError) onError(err?.message || "Error al acceder a la cámara");
        }
    };

    startScanner();

    // 3. Funció de neteja
    return () => {
      if (scanner.isScanning) {
        scanner.stop().catch(e => console.error("Error stopping scanner:", e));
      }
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[300px] mx-auto overflow-hidden rounded-3xl bg-black border-4 border-slate-200 dark:border-slate-800 shadow-2xl">
      <div
        id={QR_SCANNER_REGION_ID}
        className="w-full h-full object-cover"
      />
      
      {/* Overlay de Enfoque */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[180px] h-[180px] border-2 border-primary/50 rounded-2xl relative">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
        </div>
        
        {/* Antena / Línea de escaneo animada */}
        <div className="absolute w-[200px] h-1 bg-primary/40 shadow-[0_0_15px_rgba(255,46,78,0.8)] animate-scan-move"></div>
      </div>
    </div>
  );
};

export default QrScanner;
