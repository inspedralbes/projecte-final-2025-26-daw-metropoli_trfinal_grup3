import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

// ID únic per l'element HTML que servirà de contenidor del vídeo de la càmera
const QR_SCANNER_REGION_ID = "qr-scanner-region";

const QrScanner = ({ onResult, onError }) => {
  // Guardem la referència de l'escàner per poder aturar-lo des de la funció de neteja
  const scannerRef = useRef(null);

  useEffect(() => {
    // 1. Creem l'instància de l'escàner lligada al div amb id="qr-scanner-region"
    const scanner = new Html5Qrcode(QR_SCANNER_REGION_ID);
    scannerRef.current = scanner;

    // 2. Iniciem la càmera i l'escaneig
    scanner
      .start(
        { facingMode: "environment" }, // càmera posterior en mòbil, frontal en PC
        {
          fps: 10, // intenta detectar QR 10 vegades per segon
          qrbox: { width: 220, height: 220 }, // mida del requadre de detecció
        },
        // Callback d'èxit: s'executa quan es detecta un QR correctament
        (decodedText) => {
          scanner.stop().catch(() => {}); // aturem la càmera
          onResult(decodedText); // passem el text al component pare
        },
        // Callback de frame sense detecció: l'ignorarem per no generar soroll
        () => {},
      )
      .catch((err) => {
        // Error al iniciar la càmera (p.ex. l'usuari no ha donat permís)
        if (onError)
          onError(err?.message || "No s'ha pogut accedir a la càmera");
      });

    // 3. Funció de neteja: s'executa quan es tanca el modal i el component es desmunta
    return () => {
      scanner.stop().catch(() => {});
    };
  }, []); // [] → el useEffect s'executa només una vegada, quan el component es munta

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        id={QR_SCANNER_REGION_ID}
        className="w-full rounded-2xl overflow-hidden bg-black"
        style={{ minHeight: 260 }}
      />
      <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
        Apunta al QR del perfil del teu amic
      </p>
    </div>
  );
};

export default QrScanner;
