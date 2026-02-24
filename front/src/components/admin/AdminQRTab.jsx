import { useState, useEffect } from "react";
import { getQrCodes, generateQrCode, getNodos } from "../../../services/communicationManager";

const AdminQRTab = () => {
    const [qrList, setQrList] = useState([]);
    const [nodosList, setNodosList] = useState([]);
    const [qrNodeSelected, setQrNodeSelected] = useState("");
    const [qrZoneName, setQrZoneName] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const fetchQRData = async () => {
        try {
            const [nodosRes, qrsRes] = await Promise.all([
                getNodos(),
                getQrCodes()
            ]);

            if (nodosRes.success && nodosRes.data) {
                setNodosList(nodosRes.data);
            }

            if (qrsRes.success && qrsRes.data) {
                setQrList(qrsRes.data);
            }
        } catch (err) {
            console.error("Error fetching QR data:", err);
        }
    };

    useEffect(() => {
        fetchQRData();
    }, []);

    const handleGenerateQR = async () => {
        if (!qrNodeSelected) return;

        setIsGenerating(true);
        try {
            const zoneParam = qrZoneName.trim() === "" ? undefined : qrZoneName.trim();
            const res = await generateQrCode(qrNodeSelected, zoneParam);

            if (res.success) {
                await fetchQRData();
                setQrNodeSelected("");
                setQrZoneName("");
            }
        } catch (err) {
            console.error("Failed to generate QR Code:", err);
            alert("Error al generar el QR. Comprueba que el backend esté conectado.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="animate-fade-in lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start space-y-8 lg:space-y-0">

            {/* Left Column: QR List */}
            <div className="order-2 lg:order-1">
                <div className="mt-6 lg:mt-0">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1 lg:mb-3">
                        QRs Generados
                    </h3>

                    {qrList.length > 0 ? (
                        <div className="space-y-3">
                            {qrList.map((qr) => (
                                <div
                                    key={qr.id_qr}
                                    className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start sm:items-center gap-4 group"
                                >
                                    <a
                                        href={import.meta.env.VITE_API_URL + qr.ruta_archivo_qr}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="shrink-0 relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 block transition-transform hover:scale-105"
                                    >
                                        <img
                                            src={import.meta.env.VITE_API_URL + qr.ruta_archivo_qr}
                                            alt={`QR ${qr.slug}`}
                                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover bg-white"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white text-sm">open_in_new</span>
                                        </div>
                                    </a>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate uppercase">
                                                {qr.slug}
                                            </h4>
                                            {qr.activo ? (
                                                <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                                    Activo
                                                </span>
                                            ) : (
                                                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                                    Inactivo
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                                            Nodo ID: {qr.id_nodo_inicio}
                                            {qr.nodo_descripcion && ` - ${qr.nodo_descripcion}`}
                                        </p>

                                        <p className="text-[11px] text-slate-400 mt-1">
                                            Fecha: {new Date(qr.fecha_creacion).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>

                                    <div className="shrink-0 flex gap-2">
                                        <a
                                            href={import.meta.env.VITE_API_URL + qr.ruta_archivo_qr}
                                            download={`QR-${qr.slug}.png`}
                                            className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                                            title="Descargar Imagen QR"
                                        >
                                            <span className="material-symbols-outlined text-lg">download</span>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center flex flex-col items-center justify-center shadow-inner">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-30 animate-pulse">qr_code_scanner</span>
                            <p className="font-medium text-sm">No se han generado Códigos QR.</p>
                            <p className="text-xs mt-1 text-slate-400">Genera uno en el panel de la derecha.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Generation Form */}
            <div className="order-1 lg:order-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">qr_code</span>
                    Generador de QR Topográfico
                </h3>

                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6">

                    {/* Selector de Nodo */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">
                            Nodo de Inicio (Punto Físico)
                        </label>
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <span className="material-symbols-outlined text-slate-400">
                                pin_drop
                            </span>
                            {nodosList.length > 0 ? (
                                <select
                                    value={qrNodeSelected}
                                    onChange={(e) => setQrNodeSelected(e.target.value)}
                                    className="bg-transparent border-none outline-none w-full text-slate-700 dark:text-slate-200 text-sm font-medium appearance-none"
                                >
                                    <option value="" disabled>Selecciona un nodo del circuito...</option>
                                    {nodosList.map(nodo => (
                                        <option key={nodo.id_nodo} value={nodo.id_nodo}>
                                            Nodo {nodo.id_nodo} {nodo.descripcion ? `(${nodo.descripcion})` : ''} - [{parseFloat(nodo.latitud).toFixed(4)}, {parseFloat(nodo.longitud).toFixed(4)}]
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <select disabled className="bg-transparent border-none outline-none w-full text-slate-400 text-sm font-medium appearance-none">
                                    <option>No hay nodos de navegación disponibles</option>
                                </select>
                            )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5 ml-1">
                            Asegúrate de que el nodo seleccionado coincida con el punto real donde imprimirás este cartel QR para la navegación en AR.
                        </p>
                    </div>

                    {/* Slug/Zone Name */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">
                            Nombre de Zona (Opcional)
                        </label>
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <span className="material-symbols-outlined text-slate-400">
                                title
                            </span>
                            <input
                                type="text"
                                value={qrZoneName}
                                onChange={(e) => setQrZoneName(e.target.value)}
                                className="bg-transparent border-none outline-none w-full text-slate-700 dark:text-slate-200 text-sm font-medium placeholder-slate-400"
                                placeholder="e.g. tribuna-sur"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5 ml-1">
                            Por defecto se guardará como <strong>zona-sin-definir.png</strong>. Se usará este texto como nombre de archivo en servidor.
                        </p>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleGenerateQR}
                            disabled={!qrNodeSelected || isGenerating}
                            className="w-full bg-slate-800 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl shadow-lg shadow-slate-900/10 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            {/* Efecto de cargando interno bg */}
                            <div className={`absolute inset-0 bg-primary transition-transform duration-1000 origin-left ${isGenerating ? 'scale-x-100' : 'scale-x-0'}`}></div>

                            <span className="material-symbols-outlined relative z-10">
                                {isGenerating ? 'hourglass_top' : 'qr_code_2'}
                            </span>
                            <span className="relative z-10">
                                {isGenerating ? 'Generando e Insertando...' : 'Generar Nuevo Código QR'}
                            </span>
                        </button>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default AdminQRTab;
