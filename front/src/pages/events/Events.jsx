import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../layouts/Navbar';

const Events = () => {
    const [activeTab, setActiveTab] = useState('sat');

    const scheduleData = {
        fri: [
            {
                id: 1,
                time: "09:00 - 09:45",
                title: "Formula 3 Practice",
                category: "Practice",
                status: "completed",
                isLive: false // For demo purposes, static
            },
            {
                id: 2,
                time: "11:30 - 12:30",
                title: "F1 Free Practice 1",
                category: "Main Track - Sector 1 Green",
                status: "upcoming",
                isLive: false
            },
            {
                id: 3,
                time: "15:00 - 16:00",
                title: "F1 Free Practice 2",
                category: "Fan Zone Open",
                status: "upcoming",
                isLive: false
            }
        ],
        sat: [
            {
                id: 4,
                time: "09:00 - 09:45",
                title: "Formula 3 Sprint Race",
                category: "Race",
                status: "completed",
                isLive: false
            },
            {
                id: 5,
                time: "11:30 - 12:30",
                title: "F1 Free Practice 3",
                category: "Main Track - Sector 1 Green",
                status: "live",
                isLive: true
            },
            {
                id: 6,
                time: "13:10 - 14:00",
                title: "Porsche Supercup",
                category: "Qualifying Session",
                status: "upcoming",
                isLive: false
            },
            {
                id: 7,
                time: "15:00 - 16:00",
                title: "F1 Qualifying",
                category: "Pole Position Battle",
                status: "main",
                isMain: true,
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbIBeRSCVUWAgc7mEU2oqAINelgyV1U__AbK91Zl7qZiT7bXM9SvXy9spdaU3R2CqJ75IrTKp1BeGHCToN-mcumxqQm4MJW518tn1BKEapmxghsXvqrl_7kBlIzSWLtvokRYbSDXqsEx0NhpAnX5YUdx9Wd1ObEhmXvmOfecPqyZB6B89KHhHKg7mhRTd5lPyzpiMyOld7XFJFaayil3RZK8rxlDF2Y4_z3j9b9z5zda9_wTO6wLQ5uJ1F40u5ODMjFsYSNDjYIHM" 

            },
            {
                id: 8,
                time: "17:30 - 18:30",
                title: "Drivers Press Conference",
                category: "Media",
                status: "upcoming",
                isLive: false
            }
        ],
        sun: [
             {
                id: 9,
                time: "10:00 - 11:00",
                title: "Porsche Supercup Race",
                category: "Race",
                status: "upcoming",
                isLive: false
            },
            {
                id: 10,
                time: "12:00 - 13:00",
                title: "Drivers Parade",
                category: "Fan Zone",
                status: "upcoming",
                isLive: false
            },
            {
                id: 11,
                time: "15:00 - 17:00",
                title: "F1 Grand Prix",
                category: "The Main Race",
                status: "main",
                isMain: true,
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbIBeRSCVUWAgc7mEU2oqAINelgyV1U__AbK91Zl7qZiT7bXM9SvXy9spdaU3R2CqJ75IrTKp1BeGHCToN-mcumxqQm4MJW518tn1BKEapmxghsXvqrl_7kBlIzSWLtvokRYbSDXqsEx0NhpAnX5YUdx9Wd1ObEhmXvmOfecPqyZB6B89KHhHKg7mhRTd5lPyzpiMyOld7XFJFaayil3RZK8rxlDF2Y4_z3j9b9z5zda9_wTO6wLQ5uJ1F40u5ODMjFsYSNDjYIHM"
            }
        ]
    };

    const currentEvents = scheduleData[activeTab] || [];

    return (
        <div className="relative h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-white font-display overflow-hidden select-none flex flex-col transition-colors duration-300 overscroll-none">
             {/* Background Pattern - Keeping it subtle/clean to match others */}
             
            {/* Header - Aligned with Home/Community */}
            <div className="w-full pt-6 px-5 pb-2 z-20 flex justify-between items-center transition-colors shrink-0 touch-none">
                <div className="flex items-center gap-2">
                    <Link to="/">
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
                <Link
                    to="/profile"
                    className="w-10 h-10 rounded-full border-2 border-primary p-0.5 overflow-hidden shadow-sm"
                >
                    <img
                        src="https://i.pravatar.cc/150?img=12"
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                    />
                </Link>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto no-scrollbar pb-32 px-5 pt-4">
                <section className="flex flex-col gap-6 mb-8">
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white italic tracking-tighter uppercase leading-none">Race <span className="text-primary">Weekend</span></h1>
                    
                    {/* Date Tabs */}
                    <div className="flex gap-2 p-1 bg-white dark:bg-surface-darker rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm dark:shadow-none">
                        {['fri', 'sat', 'sun'].map((day) => (
                            <button 
                                key={day}
                                onClick={() => setActiveTab(day)}
                                className={`flex-1 py-3 px-2 rounded-xl text-center transition-all font-bold text-xs uppercase tracking-widest border ${activeTab === day ? 'bg-primary text-white shadow-lg shadow-primary/30 border-transparent' : 'bg-transparent text-slate-400 dark:text-gray-400 border-transparent hover:bg-slate-50 dark:hover:bg-white/5'}`}
                            >
                                {day === 'fri' && 'Fri'}
                                {day === 'sat' && 'Sat'}
                                {day === 'sun' && 'Sun'}
                                <span className="block text-lg font-black mt-0.5">
                                    {day === 'fri' && '21'}
                                    {day === 'sat' && '22'}
                                    {day === 'sun' && '23'}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="flex flex-col gap-6 relative pb-4">
                    {/* Vertical Line */}
                    <div className="absolute left-4 top-2 bottom-0 w-0.5 bg-slate-200 dark:bg-white/10"></div>

                    {currentEvents.map((event) => (
                        <div key={event.id} className="relative pl-12 group animate-in fade-in slide-in-from-bottom-4 duration-500">
                             {/* Timeline Dot/State */}
                            {event.isLive ? (
                                <div className="absolute left-2.5 top-2 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-gray-50 dark:ring-background-dark z-10">
                                    <span className="animate-ping absolute inset-0 rounded-full bg-primary opacity-75"></span>
                                </div>
                            ) : (
                                <div className={`absolute left-3 top-2 w-2.5 h-2.5 rounded-full ring-4 ring-gray-50 dark:ring-background-dark z-10 ${event.status === 'completed' ? 'bg-slate-400 dark:bg-gray-600' : 'bg-slate-200 dark:bg-white/20'}`}></div>
                            )}


                            {/* Card Content */}
                            {event.isMain ? (
                                <div className="relative bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-md dark:shadow-none transition-all hover:scale-[1.01] active:scale-[0.99]">
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
                                             <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-surface-darker border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer">
                                                <span className="material-symbols-outlined text-xl">notifications</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="h-16 relative mt-1">
                                        <img alt="F1 Track" className="w-full h-full object-cover opacity-50 dark:opacity-30 grayscale" src={event.image}/>
                                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-surface-dark to-transparent"></div>
                                    </div>
                                </div>
                            ) : event.isLive ? (
                                <div className="bg-white dark:bg-surface-dark border-2 border-primary/30 rounded-2xl p-4 shadow-xl shadow-primary/5 dark:shadow-none transition-all hover:scale-[1.01] active:scale-[0.99]">
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
                                <div className={`bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-sm dark:shadow-none transition-all hover:scale-[1.01] active:scale-[0.99] ${event.status === 'completed' ? 'opacity-60 bg-white/60 dark:bg-surface-dark/40 border-dashed' : ''}`}>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-widest">{event.time}</span>
                                        <h3 className="text-slate-800 dark:text-white font-extrabold italic uppercase">{event.title}</h3>
                                          {event.category && event.status !== 'completed' && <p className="text-[10px] text-slate-500 dark:text-gray-500 mt-0.5 font-medium">{event.category}</p>}
                                    </div>
                                     {event.status === 'completed' ? (
                                         <span className="material-symbols-outlined text-slate-400 dark:text-gray-600">check_circle</span>
                                     ) : (
                                        <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-surface-darker border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer">
                                            <span className="material-symbols-outlined text-xl">notifications</span>
                                        </button>
                                     )}
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            </div>
            
            <Navbar />
        </div>
    );
};

export default Events;
