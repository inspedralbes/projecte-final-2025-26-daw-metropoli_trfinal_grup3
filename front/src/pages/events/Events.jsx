import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../layouts/Navbar';
import { getEventos } from '../../../services/communicationManager';
import socket from '../../../services/socketManager'; // Importamos la radio del frontend

const Events = () => {
    const [activeTab, setActiveTab] = useState('sat');
    const [eventsData, setEventsData] = useState({ fri: [], sat: [], sun: [] });

    // Extraemos la función de pedir eventos para poder llamarla al inicio Y cuando la radio nos avise
    const cargarEventosDesdeBD = () => {
        getEventos().then((res) => {
            if (res.success && res.data) {
                const eventosAgrupados = { fri: [], sat: [], sun: [] };

                res.data.forEach((evento) => {
                    if (evento.estado === 'cancelado') return;

                    const fechaInicio = new Date(evento.fecha_inicio);
                    const diaDeLaSemana = fechaInicio.getDay(); // 0 es Domingo, 5 es Viernes, 6 es Sábado

                    let diaDestino = '';
                    if (diaDeLaSemana === 5) diaDestino = 'fri';
                    else if (diaDeLaSemana === 6) diaDestino = 'sat';
                    else if (diaDeLaSemana === 0) diaDestino = 'sun';

                    // Solo si el evento cae en fin de semana lo añadimos
                    if (diaDestino) {
                        const fechaFin = new Date(evento.fecha_fin);
                        const formatearHora = (fecha) => fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        eventosAgrupados[diaDestino].push({
                            id: evento.id_evento,
                            time: `${formatearHora(fechaInicio)} - ${formatearHora(fechaFin)}`,
                            title: evento.nombre,
                            category: evento.descripcion || "General",
                            // Simplificamos calculando cosas según tu data anterior:
                            status: 'upcoming',
                            isLive: false,
                            isMain: evento.foto ? true : false, // Si tiene foto, lo marcamos como evento principal
                            image: evento.foto ? `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${evento.foto}` : null
                        });
                    }
                });

                setEventsData(eventosAgrupados);
            }
        }).catch((err) => console.error("Error al obtener eventos:", err));
    };

    // 1. Cargar al abrir la pantalla por primera vez
    useEffect(() => {
        cargarEventosDesdeBD();

        // 2. Encender la radio: si escuchamos 'actualizacion_eventos', volvemos a descargar todo
        socket.on('actualizacion_eventos', (mensaje) => {
            console.log("📡 Ha llegado un cambio desde el servidor: ", mensaje);
            cargarEventosDesdeBD(); // Recargamos!
        });

        // 3. Cuando el usuario se va de la página, apagamos esta frecuencia para no duplicar escuchas
        return () => {
            socket.off('actualizacion_eventos');
        };
    }, []); // Todo esto se configura una sola vez al entrar

    const currentEvents = eventsData[activeTab] || [];

    const dayInfo = {
        fri: { label: 'Fri', date: '29', desc: 'Practice Sessions' },
        sat: { label: 'Sat', date: '30', desc: 'Qualifying Day' },
        sun: { label: 'Sun', date: '31', desc: 'Race Day' },
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-white font-display select-none transition-colors duration-300 md:pl-16">
            {/* Header */}
            <div className="w-full pt-6 px-5 pb-2 z-20 flex justify-between items-center transition-colors shrink-0 touch-none md:max-w-5xl md:mx-auto">
                <div className="md:hidden flex items-center gap-2">
                    <Link to="/home">
                        <img src="/logo/logo1.png" alt="Circuit de Catalunya" className="h-12 w-auto object-contain block dark:hidden" />
                        <img src="/logo/logo.png" alt="Circuit de Catalunya" className="h-12 w-auto object-contain hidden dark:block" />
                    </Link>
                </div>
                <h1 className="hidden md:block text-2xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white">
                    Race <span className="text-primary">Weekend</span>
                </h1>
                <Link to="/profile" className="w-10 h-10 rounded-full border-2 border-primary p-0.5 overflow-hidden shadow-sm">
                    <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="w-full h-full object-cover rounded-full" />
                </Link>
            </div>

            {/* Content */}
            <div className="overflow-y-auto no-scrollbar pb-24 md:pb-10 px-5 pt-4 md:max-w-5xl md:mx-auto">
                <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8 lg:items-start">

                    {/* Left: Day selector (desktop sidebar, mobile top) */}
                    <div className="mb-6 lg:mb-0">
                        {/* Mobile title */}
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white italic tracking-tighter uppercase leading-none mb-4 lg:hidden">
                            Race <span className="text-primary">Weekend</span>
                        </h1>

                        {/* Date Tabs — column on desktop, row on mobile */}
                        <div className="flex gap-2 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm dark:shadow-none lg:flex-col">
                            {['fri', 'sat', 'sun'].map((day) => (
                                <button
                                    key={day}
                                    onClick={() => setActiveTab(day)}
                                    className={`flex-1 lg:flex-none py-3 px-2 lg:px-4 rounded-xl text-center lg:text-left transition-all font-bold text-xs uppercase tracking-widest border lg:flex lg:items-center lg:gap-4 ${activeTab === day ? 'bg-primary text-white shadow-lg shadow-primary/30 border-transparent' : 'bg-transparent text-slate-400 dark:text-gray-400 border-transparent hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                >
                                    <div className="lg:flex lg:flex-col lg:items-center lg:w-10">
                                        <span className="block">{dayInfo[day].label}</span>
                                        <span className="text-lg font-black mt-0.5 block">{dayInfo[day].date}</span>
                                    </div>
                                    <span className={`hidden lg:block text-sm font-semibold ${activeTab === day ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {dayInfo[day].desc}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Desktop session summary */}
                        <div className="hidden lg:block mt-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Sessions today</div>
                            <div className="text-2xl font-black text-slate-800 dark:text-white">{currentEvents.length}</div>
                            <div className="mt-2 flex gap-2 flex-wrap">
                                {currentEvents.filter(e => e.isLive).length > 0 && (
                                    <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">
                                        {currentEvents.filter(e => e.isLive).length} Live
                                    </span>
                                )}
                                <span className="text-[9px] font-bold bg-slate-100 dark:bg-white/5 text-slate-500 px-2 py-0.5 rounded-full uppercase">
                                    {currentEvents.filter(e => e.status === 'upcoming').length} Upcoming
                                </span>
                                <span className="text-[9px] font-bold bg-slate-100 dark:bg-white/5 text-slate-500 px-2 py-0.5 rounded-full uppercase">
                                    {currentEvents.filter(e => e.status === 'completed').length} Done
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Event Timeline */}
                    <section className="flex flex-col gap-6 relative pb-4">
                        <div className="absolute left-4 top-2 bottom-0 w-0.5 bg-slate-200 dark:bg-white/10"></div>

                        {currentEvents.map((event) => (
                            <div key={event.id} className="relative pl-12 group animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {event.isLive ? (
                                    <div className="absolute left-2.5 top-2 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-gray-50 dark:ring-slate-950 z-10">
                                        <span className="animate-ping absolute inset-0 rounded-full bg-primary opacity-75"></span>
                                    </div>
                                ) : (
                                    <div className={`absolute left-3 top-2 w-2.5 h-2.5 rounded-full ring-4 ring-gray-50 dark:ring-slate-950 z-10 ${event.status === 'completed' ? 'bg-slate-400 dark:bg-gray-600' : 'bg-slate-200 dark:bg-white/20'}`}></div>
                                )}

                                {event.isMain ? (
                                    <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-md dark:shadow-none transition-all hover:scale-[1.01] active:scale-[0.99]">
                                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary"></div>
                                        <div className="p-4 relative z-10">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-widest">{event.time}</span>
                                                <div className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded text-[9px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest border border-slate-200 dark:border-white/5">Main Event</div>
                                            </div>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-800 dark:text-white italic uppercase leading-none mb-1">{event.title}</h3>
                                                    <p className="text-[11px] text-slate-500 dark:text-gray-400 font-medium">{event.category}</p>
                                                </div>
                                                <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer">
                                                    <span className="material-symbols-outlined text-xl">notifications</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="h-16 relative mt-1">
                                            <img alt="F1 Track" className="w-full h-full object-cover opacity-50 dark:opacity-30 grayscale" src={event.image} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
                                        </div>
                                    </div>
                                ) : event.isLive ? (
                                    <div className="bg-white dark:bg-slate-900 border-2 border-primary/30 rounded-2xl p-4 shadow-xl shadow-primary/5 dark:shadow-none transition-all hover:scale-[1.01] active:scale-[0.99]">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="bg-primary/10 dark:bg-primary/20 text-primary text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter flex items-center gap-1">
                                                <span className="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
                                                Live Now
                                            </div>
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{event.time}</span>
                                        </div>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-xl font-black text-slate-800 dark:text-white italic uppercase leading-none mb-1">{event.title}</h3>
                                                <p className="text-[11px] text-slate-500 dark:text-gray-400 font-medium">{event.category}</p>
                                            </div>
                                            <button className="text-primary hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined fill-1">notifications_active</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-sm dark:shadow-none transition-all hover:scale-[1.01] active:scale-[0.99] ${event.status === 'completed' ? 'opacity-60 border-dashed' : ''}`}>
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-widest">{event.time}</span>
                                            <h3 className="text-slate-800 dark:text-white font-extrabold italic uppercase">{event.title}</h3>
                                            {event.category && event.status !== 'completed' && <p className="text-[10px] text-slate-500 dark:text-gray-500 mt-0.5 font-medium">{event.category}</p>}
                                        </div>
                                        {event.status === 'completed' ? (
                                            <span className="material-symbols-outlined text-slate-400 dark:text-gray-600">check_circle</span>
                                        ) : (
                                            <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer">
                                                <span className="material-symbols-outlined text-xl">notifications</span>
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
