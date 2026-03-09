import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../layouts/Navbar";
import { getEventos } from "../../services/communicationManager";
import socket from "../../services/socketManager";
import { useTranslation } from "react-i18next";

// Nombres cortos de los días de la semana (0 = Domingo, 1 = Lunes, ...)
const NOMBRES_DIA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const NOMBRES_MES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const Events = () => {
  const { t } = useTranslation();
  // La clave del tab activo es una string con formato "YYYY-MM-DD"
  const [activeTab, setActiveTab] = useState("");

  // Lista de días únicos que tienen eventos, en orden cronológico
  // Cada elemento: { clave: "2026-05-29", label: "Vie", dia: 29, mes: "May" }
  const [diasConEventos, setDiasConEventos] = useState([]);

  // Mapa de clave → array de eventos para ese día
  const [eventosPorDia, setEventosPorDia] = useState({});

  // Datos del usuario logueado (para la foto del header)
  const usuario = (() => {
    const storedUser = localStorage.getItem("usuario");
    return storedUser ? JSON.parse(storedUser) : null;
  })();

  // ─── Función que procesa los eventos de la BD ────────────────────────────────
  // La definimos fuera del useEffect para poder reutilizarla cuando llegue el socket
  const cargarEventosDesdeBD = () => {
    getEventos()
      .then((res) => {
        if (!res.success || !res.data) return;

        const ahora = new Date();

        // 1. Calculamos el status de cada evento en base a la hora actual
        //    y los agrupamos por día (clave "YYYY-MM-DD")
        const nuevoEventosPorDia = {};
        const diasEncontrados = {};

        for (let i = 0; i < res.data.length; i++) {
          const evento = res.data[i];

          // Ignoramos los cancelados
          if (evento.estado === "cancelado") continue;

          const fechaInicio = new Date(evento.fecha_inicio);
          const fechaFin = new Date(evento.fecha_fin);

          // ─ Calculamos el status del evento ─────────────────────────────
          // Comparamos con la hora actual del dispositivo del usuario
          let statusEvento = "upcoming";
          let isLive = false;

          if (ahora >= fechaInicio && ahora <= fechaFin) {
            // El evento está ocurriendo ahora mismo
            statusEvento = "live";
            isLive = true;
          } else if (ahora > fechaFin) {
            // El evento ya terminó
            statusEvento = "completed";
          }

          // ─ Formateamos la hora de inicio y fin ─────────────────────────
          const horaInicio = fechaInicio.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const horaFin = fechaFin.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          // ─ Generamos la clave del día "YYYY-MM-DD" ──────────────────────
          const anyo = fechaInicio.getFullYear();
          const mes = fechaInicio.getMonth(); // 0-indexado
          const dia = fechaInicio.getDate();

          // Concatenamos para que el orden lexicográfico coincida con el cronológico
          const mesStr = mes + 1 < 10 ? "0" + (mes + 1) : "" + (mes + 1);
          const diaStr = dia < 10 ? "0" + dia : "" + dia;
          const claveDelDia = anyo + "-" + mesStr + "-" + diaStr;

          // ─ Guardamos la info del día si no la teníamos ya ───────────────
          if (!diasEncontrados[claveDelDia]) {
            diasEncontrados[claveDelDia] = {
              clave: claveDelDia,
              label: NOMBRES_DIA[fechaInicio.getDay()],
              dia: dia,
              mes: NOMBRES_MES[mes],
            };
          }

          // ─ Añadimos el evento al grupo de su día ────────────────────────
          if (!nuevoEventosPorDia[claveDelDia]) {
            nuevoEventosPorDia[claveDelDia] = [];
          }

          nuevoEventosPorDia[claveDelDia].push({
            id: evento.id_evento,
            time: horaInicio + " - " + horaFin,
            title: evento.nombre,
            category: evento.descripcion || "",
            status: statusEvento,
            isLive: isLive,
            isMain: evento.foto ? true : false,
            image: evento.foto
              ? (import.meta.env.VITE_API_URL || "http://localhost:3000") +
                evento.foto
              : null,
          });
        }

        // 2. Convertimos el objeto de días a un array y lo ordenamos cronológicamente
        //    La clave "YYYY-MM-DD" ordena bien de forma lexicográfica sin librerías
        const arrayDias = [];
        for (const clave in diasEncontrados) {
          arrayDias.push(diasEncontrados[clave]);
        }

        // Ordenamos el array por clave
        for (let i = 0; i < arrayDias.length - 1; i++) {
          for (let j = 0; j < arrayDias.length - 1 - i; j++) {
            if (arrayDias[j].clave > arrayDias[j + 1].clave) {
              const temp = arrayDias[j];
              arrayDias[j] = arrayDias[j + 1];
              arrayDias[j + 1] = temp;
            }
          }
        }

        setDiasConEventos(arrayDias);
        setEventosPorDia(nuevoEventosPorDia);

        // 3. Activamos la primera pestaña que tenga eventos
        //    Si todavía no hay tab activa (primera carga), ponemos la primera
        if (arrayDias.length > 0) {
          setActiveTab((prev) => {
            // Si el tab activo sigue siendo válido, lo mantenemos
            if (prev && nuevoEventosPorDia[prev]) return prev;
            return arrayDias[0].clave;
          });
        }
      })
      .catch((err) => console.error("Error al obtener eventos:", err));
  };

  // 1. Cargamos los eventos al entrar en la pantalla
  useEffect(() => {
    cargarEventosDesdeBD();

    // 2. Escuchamos el socket: si el admin crea/edita/borra un evento, recargamos
    socket.on("actualizacion_eventos", (mensaje) => {
      console.log("📡 Cambio en eventos recibido por socket:", mensaje);
      cargarEventosDesdeBD();
    });

    // 3. Limpiamos el listener al salir de la pantalla para no duplicar escuchas
    return () => {
      socket.off("actualizacion_eventos");
    };
  }, []);

  // Eventos del día actualmente seleccionado
  const eventosDelDia = eventosPorDia[activeTab] || [];

  // Contadores para el panel lateral de desktop
  let totalLive = 0;
  let totalUpcoming = 0;
  let totalCompleted = 0;
  for (let i = 0; i < eventosDelDia.length; i++) {
    if (eventosDelDia[i].isLive) totalLive++;
    if (eventosDelDia[i].status === "upcoming") totalUpcoming++;
    if (eventosDelDia[i].status === "completed") totalCompleted++;
  }

  // URL de la foto del usuario (con fallback al avatar genérico, igual que en Home)
  const getAvatarUrl = (fotoUrl) => {
    if (!fotoUrl)
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    if (fotoUrl.startsWith("http")) return fotoUrl;
    return `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${fotoUrl}`;
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-white font-display select-none transition-colors duration-300 md:pl-16">
      {/* Header */}
      <div className="w-full pt-6 px-5 pb-2 z-20 flex justify-between items-center transition-colors shrink-0 touch-none md:max-w-5xl md:mx-auto">
        <div className="md:hidden flex items-center gap-2">
          <Link to="/home">
            <img
              src="/logo/logo1.png"
              alt="Circuit de Catalunya"
              className="h-12 w-auto object-contain block dark:hidden"
            />
            <img
              src="/logo/logo.png"
              alt="Circuit de Catalunya"
              className="h-12 w-auto object-contain hidden dark:block"
            />
          </Link>
        </div>
        <h1 className="hidden md:block text-2xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white">
          {t("events.raceWeekend")}
        </h1>

        {/* Foto de perfil del usuario logueado */}
        <Link
          to="/profile"
          className="w-10 h-10 rounded-full border-2 border-primary p-0.5 overflow-hidden shadow-sm flex-shrink-0"
        >
          <img
            src={getAvatarUrl(usuario?.foto)}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="overflow-y-auto no-scrollbar pb-24 md:pb-10 px-5 pt-4 md:max-w-5xl md:mx-auto">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8 lg:items-start">
          {/* Left: selector de días */}
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl font-black text-slate-800 dark:text-white italic tracking-tighter uppercase leading-none mb-4 lg:hidden">
              {t("events.raceWeekend")}
            </h1>

            {/* Tabs de días — fila en móvil, columna en desktop */}
            <div className="flex gap-2 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm dark:shadow-none lg:flex-col overflow-x-auto no-scrollbar">
              {diasConEventos.length === 0 && (
                <div className="flex-1 py-4 text-center text-slate-400 text-xs font-medium">
                  {t("events.noEvents")}
                </div>
              )}

              {diasConEventos.map((diaInfo) => (
                <button
                  key={diaInfo.clave}
                  onClick={() => setActiveTab(diaInfo.clave)}
                  className={`flex-shrink-0 py-3 px-3 lg:px-4 rounded-xl text-center lg:text-left transition-all font-bold text-xs uppercase tracking-widest border lg:flex lg:items-center lg:gap-4 ${activeTab === diaInfo.clave ? "bg-primary text-white shadow-lg shadow-primary/30 border-transparent" : "bg-transparent text-slate-400 dark:text-gray-400 border-transparent hover:bg-slate-50 dark:hover:bg-white/5"}`}
                >
                  <div className="lg:flex lg:flex-col lg:items-center lg:w-10">
                    <span className="block">{diaInfo.label}</span>
                    <span className="text-lg font-black mt-0.5 block">
                      {diaInfo.dia}
                    </span>
                  </div>
                  <span
                    className={`hidden lg:block text-sm font-semibold ${activeTab === diaInfo.clave ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}
                  >
                    {diaInfo.mes}
                  </span>
                </button>
              ))}
            </div>

            {/* Resumen del día — solo visible en desktop */}
            <div className="hidden lg:block mt-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                {t("events.sessionsToday")}
              </div>
              <div className="text-2xl font-black text-slate-800 dark:text-white">
                {eventosDelDia.length}
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {totalLive > 0 && (
                  <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">
                    {totalLive} {t("events.live")}
                  </span>
                )}
                <span className="text-[9px] font-bold bg-slate-100 dark:bg-white/5 text-slate-500 px-2 py-0.5 rounded-full uppercase">
                  {totalUpcoming} {t("events.upcoming")}
                </span>
                <span className="text-[9px] font-bold bg-slate-100 dark:bg-white/5 text-slate-500 px-2 py-0.5 rounded-full uppercase">
                  {totalCompleted} {t("events.done")}
                </span>
              </div>
            </div>
          </div>

          {/* Right: timeline de eventos del día seleccionado */}
          <section className="flex flex-col gap-6 relative pb-4">
            <div className="absolute left-4 top-2 bottom-0 w-0.5 bg-slate-200 dark:bg-white/10"></div>

            {eventosDelDia.length === 0 && (
              <div className="pl-12 text-slate-400 dark:text-slate-500 text-sm font-medium py-8 text-center">
                {t("events.noEventsForDay")}
              </div>
            )}

            {eventosDelDia.map((event) => (
              <div
                key={event.id}
                className="relative pl-12 group animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {/* Indicador de la línea de tiempo */}
                {event.isLive ? (
                  <div className="absolute left-2.5 top-2 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-gray-50 dark:ring-slate-950 z-10">
                    <span className="animate-ping absolute inset-0 rounded-full bg-primary opacity-75"></span>
                  </div>
                ) : (
                  <div
                    className={`absolute left-3 top-2 w-2.5 h-2.5 rounded-full ring-4 ring-gray-50 dark:ring-slate-950 z-10 ${event.status === "completed" ? "bg-slate-400 dark:bg-gray-600" : "bg-slate-200 dark:bg-white/20"}`}
                  ></div>
                )}

                {/* Card del evento: 3 variantes → main / live / normal */}
                {event.isMain ? (
                  <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-md dark:shadow-none transition-all hover:scale-[1.01] active:scale-[0.99]">
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary"></div>
                    <div className="p-4 relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-widest">
                          {event.time}
                        </span>
                        <div className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded text-[9px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest border border-slate-200 dark:border-white/5">
                          {t("events.mainEvent")}
                        </div>
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-black text-slate-800 dark:text-white italic uppercase leading-none mb-1">
                            {event.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-gray-400 font-medium">
                            {event.category}
                          </p>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer">
                          <span className="material-symbols-outlined text-xl">
                            notifications
                          </span>
                        </button>
                      </div>
                    </div>
                    {event.image && (
                      <div className="h-16 relative mt-1">
                        <img
                          alt={event.title}
                          className="w-full h-full object-cover opacity-50 dark:opacity-30 grayscale"
                          src={event.image}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
                      </div>
                    )}
                  </div>
                ) : event.isLive ? (
                  <div className="bg-white dark:bg-slate-900 border-2 border-primary/30 rounded-2xl p-4 shadow-xl shadow-primary/5 dark:shadow-none transition-all hover:scale-[1.01] active:scale-[0.99]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="bg-primary/10 dark:bg-primary/20 text-primary text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
                        {t("events.liveNow")}
                      </div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                        {event.time}
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white italic uppercase leading-none mb-1">
                          {event.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400 font-medium">
                          {event.category}
                        </p>
                      </div>
                      <button className="text-primary hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined fill-1">
                          notifications_active
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-sm dark:shadow-none transition-all hover:scale-[1.01] active:scale-[0.99] ${event.status === "completed" ? "opacity-60 border-dashed" : ""}`}
                  >
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-widest">
                        {event.time}
                      </span>
                      <h3 className="text-slate-800 dark:text-white font-extrabold italic uppercase">
                        {event.title}
                      </h3>
                      {event.category && event.status !== "completed" && (
                        <p className="text-[10px] text-slate-500 dark:text-gray-500 mt-0.5 font-medium">
                          {event.category}
                        </p>
                      )}
                    </div>
                    {event.status === "completed" ? (
                      <span className="material-symbols-outlined text-slate-400 dark:text-gray-600">
                        check_circle
                      </span>
                    ) : (
                      <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-xl">
                          notifications
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </section>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Events;
