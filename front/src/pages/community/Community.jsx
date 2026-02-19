import React, { useState } from 'react';
import Navbar from '../../layouts/Navbar';

const Community = () => {
    const [activeTab, setActiveTab] = useState('Recent');
    const tabs = ['Recent', 'Official', 'Fan Zone', 'Marketplace'];

    return (
        <div className="relative h-screen w-full bg-gray-50 dark:bg-[#12080a] text-slate-800 dark:text-white font-display overflow-hidden select-none flex flex-col transition-colors duration-300">
             {/* Background Pattern - Keeping it subtle if needed, or removing to match Home exactly. Home doesn't have it, but Community might need it. Let's keep it subtle or remove. Home has clean bg. I'll make it very subtle or remove to match Home's clean look. Let's keep the carbon fiber but extremely subtle if requested, but for "visual alignment" with Home, Home uses clean colors. I will stick to Home's clean background for consistency. */}
             
            {/* Header - Aligned with Home */}
            <div className="w-full pt-12 px-5 pb-2 z-20 flex justify-between items-center transition-colors shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center p-1.5">
                         <img src="/logo/logo.png" alt="App Icon" className="w-full h-full object-contain dark:hidden" />
                         <img src="/logo/logo-white.png" alt="App Icon" className="w-full h-full object-contain hidden dark:block" />
                    </div>
                    <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/20 mx-1 transition-colors"></div>
                    <span className="text-secondary dark:text-white font-bold tracking-[0.2em] text-xs transition-colors uppercase">
                        Comunidad
                    </span>
                </div>
                <div className="flex items-center gap-3">
                     <button className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">search</span>
                    </button>
                    <button className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto no-scrollbar pb-32 px-5 space-y-5">
                
                {/* Tabs */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-5 px-5">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-[10px] font-bold px-5 py-2.5 rounded-full uppercase tracking-wider shrink-0 cursor-pointer transition-all duration-300 ${
                                activeTab === tab
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                    : 'bg-white dark:bg-[#1e1e1e] text-slate-400 dark:text-white/40 border border-slate-100 dark:border-white/5 shadow-sm dark:shadow-none hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    <article className="bg-white dark:bg-[#1e1e1e] rounded-[24px] shadow-sm dark:shadow-none border border-slate-100 dark:border-white/5 overflow-hidden transition-all">
                        <div className="p-5 flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full border-2 border-primary p-0.5 shrink-0">
                                <img alt="User" className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpHfy92P93sOsF1AOFS82PxCdsfO562fPRgQMea4WG94L5IXgB1JG8oTEX_iy8oc8c4cPxAcPC80oEiIviZfNfNEoWYj7KuekAFY8bcjGD6pvAiCbmyH5MM9Nqnm5mIiAjdT4aC356h33EsRozBAyyhwLcyhJGxSspsKsaxzkGUeeu0GCcKyf1YZqRPcXhb7AtmNnXHUMVBeOrCDgeUgO9ufDXR53o86g-C292sKUxSSdHN_kLpyRAY1kmwr39zjrcPFT-EOuvBz4"/>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-bold text-slate-800 dark:text-white">Carlos F1 Fan</span>
                                        <span className="text-primary material-symbols-outlined text-[14px] fill-1">verified</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 dark:text-white/40 font-bold">12m ago</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-white/70 leading-relaxed mb-3 font-medium">The atmosphere at Turn 1 is absolutely electric today! Can't wait for the qualifying session to start. Who's your pick for pole? 🏎️🇪🇸</p>
                            </div>
                        </div>
                        <div className="px-5 pb-2">
                            <img alt="Track view" className="w-full h-56 object-cover rounded-[16px] shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbIBeRSCVUWAgc7mEU2oqAINelgyV1U__AbK91Zl7qZiT7bXM9SvXy9spdaU3R2CqJ75IrTKp1BeGHCToN-mcumxqQm4MJW518tn1BKEapmxghsXvqrl_7kBlIzSWLtvokRYbSDXqsEx0NhpAnX5YUdx9Wd1ObEhmXvmOfecPqyZB6B89KHhHKg7mhRTd5lPyzpiMyOld7XFJFaayil3RZK8rxlDF2Y4_z3j9b9z5zda9_wTO6wLQ5uJ1F40u5ODMjFsYSNDjYIHM"/>
                        </div>
                        <div className="p-4 flex items-center gap-6">
                            <button className="flex items-center gap-1.5 text-primary group cursor-pointer">
                                <span className="material-symbols-outlined text-[20px] group-active:scale-125 transition-transform fill-1">favorite</span>
                                <span className="text-xs font-bold">128</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white cursor-pointer transition-colors">
                                <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                                <span className="text-xs font-bold">14</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white ml-auto cursor-pointer transition-colors">
                                <span className="material-symbols-outlined text-[20px]">share</span>
                            </button>
                        </div>
                    </article>

                    <article className="bg-white dark:bg-[#1e1e1e] rounded-[24px] shadow-sm dark:shadow-none border border-slate-100 dark:border-white/5 overflow-hidden transition-all">
                        <div className="p-5 flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full border border-slate-100 dark:border-white/10 p-0.5 shrink-0">
                                <div className="w-full h-full bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                                    <span className="text-[10px] font-black text-slate-500 dark:text-white/60">SC</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-bold text-slate-800 dark:text-white">Sergio Comms</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 dark:text-white/40 font-bold">45m ago</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-white/70 leading-relaxed font-medium">Heads up fans! The shuttle service from Gate 3 is running with a 10-minute delay due to high traffic. Plan accordingly! #SpanishGP</p>
                            </div>
                        </div>
                        <div className="p-4 flex items-center gap-6 border-t border-slate-100 dark:border-white/5">
                            <button className="flex items-center gap-1.5 text-slate-400 dark:text-white/40 hover:text-primary transition-colors cursor-pointer group">
                                <span className="material-symbols-outlined text-[20px] group-active:scale-125 transition-transform">favorite</span>
                                <span className="text-xs font-bold">42</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white cursor-pointer transition-colors">
                                <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                                <span className="text-xs font-bold">3</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white ml-auto cursor-pointer transition-colors">
                                <span className="material-symbols-outlined text-[20px]">share</span>
                            </button>
                        </div>
                    </article>

                    <article className="bg-primary/5 dark:bg-primary/10 rounded-[24px] shadow-sm dark:shadow-none border border-primary/20 overflow-hidden transition-all">
                        <div className="p-5 flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
                                <span className="material-symbols-outlined text-white text-[20px]">campaign</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-black text-slate-800 dark:text-white italic uppercase tracking-tighter">Circuit Official</span>
                                        <span className="bg-primary text-white text-[8px] px-1.5 py-0.5 rounded font-black">MOD</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 dark:text-white/40 font-bold">1h ago</span>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-white font-medium leading-relaxed mb-3">Join us at the Fan Zone in 15 minutes for a live interview with local legends! 🇪🇸✨</p>
                            </div>
                        </div>
                        <div className="px-5 pb-2">
                            <img alt="Event" className="w-full h-48 object-cover rounded-[16px] shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1zV6RfldyNRodIhEf0CHzItpk5LgV0Le9fyXkpYaX6MuzhnF_Vd2lrXfwza5TKTR6QEHZY2d9xy8h6g8p824tUck3ZnRsodYOsk25x6MfZpcEeCJjlP69SQFVJTRBdjRfRf1IVFShAHpLPWzPQdm6j5GhoeYBrw7-d9RbbUwJRZgqoVhmT1I5Jwrq5DA8bb9L7mzt557v-KE7OMSvWOpS-N-HVFueMxBWC4pOHfh985l6nn3XeNwYqOJ6V2Z9NT9mo0rh4TFcogQ"/>
                        </div>
                        <div className="p-4 flex items-center gap-6">
                            <button className="flex items-center gap-1.5 text-primary cursor-pointer group">
                                <span className="material-symbols-outlined text-[20px] fill-1 group-active:scale-125 transition-transform">favorite</span>
                                <span className="text-xs font-bold">1.2k</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-slate-400 dark:text-white/40 cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                                <span className="text-xs font-bold">89</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-slate-400 dark:text-white/40 ml-auto cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">share</span>
                            </button>
                        </div>
                    </article>
                </div>
            </div>

            <button className="fixed bottom-24 right-5 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/40 z-[80] active:scale-90 transition-transform cursor-pointer hover:bg-[#ff1e3c]">
                <span className="material-symbols-outlined text-3xl font-bold">add</span>
            </button>

            <Navbar />
        </div>
    );
};

export default Community;
