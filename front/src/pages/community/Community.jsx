import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../layouts/Navbar';

const Community = () => {
    const [activeTab, setActiveTab] = useState('Recent');
    const tabs = ['Recent', 'Official', 'Fan Zone', 'Popular'];

    const posts = [
        {
            id: 1,
            user: "Carlos F1 Fan",
            verified: true,
            initials: null,
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpHfy92P93sOsF1AOFS82PxCdsfO562fPRgQMea4WG94L5IXgB1JG8oTEX_iy8oc8c4cPxAcPC80oEiIviZfNfNEoWYj7KuekAFY8bcjGD6pvAiCbmyH5MM9Nqnm5mIiAjdT4aC356h33EsRozBAyyhwLcyhJGxSspsKsaxzkGUeeu0GCcKyf1YZqRPcXhb7AtmNnXHUMVBeOrCDgeUgO9ufDXR53o86g-C292sKUxSSdHN_kLpyRAY1kmwr39zjrcPFT-EOuvBz4",
            time: "12m ago",
            content: "The atmosphere at Turn 1 is absolutely electric today! Can't wait for the qualifying session to start. Who's your pick for pole? 🏎️🇪🇸",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbIBeRSCVUWAgc7mEU2oqAINelgyV1U__AbK91Zl7qZiT7bXM9SvXy9spdaU3R2CqJ75IrTKp1BeGHCToN-mcumxqQm4MJW518tn1BKEapmxghsXvqrl_7kBlIzSWLtvokRYbSDXqsEx0NhpAnX5YUdx9Wd1ObEhmXvmOfecPqyZB6B89KHhHKg7mhRTd5lPyzpiMyOld7XFJFaayil3RZK8rxlDF2Y4_z3j9b9z5zda9_wTO6wLQ5uJ1F40u5ODMjFsYSNDjYIHM",
            likes: 128, comments: 14, isOfficial: false,
        },
        {
            id: 2,
            user: "Sergio Comms",
            verified: false,
            initials: "SC",
            avatar: null,
            time: "45m ago",
            content: "Heads up fans! The shuttle service from Gate 3 is running with a 10-minute delay due to high traffic. Plan accordingly! #SpanishGP",
            image: null,
            likes: 42, comments: 3, isOfficial: false,
        },
        {
            id: 3,
            user: "Circuit Official",
            verified: false,
            initials: null,
            avatar: null,
            time: "1h ago",
            content: "Join us at the Fan Zone in 15 minutes for a live interview with local legends! 🇪🇸✨",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1zV6RfldyNRodIhEf0CHzItpk5LgV0Le9fyXkpYaX6MuzhnF_Vd2lrXfwza5TKTR6QEHZY2d9xy8h6g8p824tUck3ZnRsodYOsk25x6MfZpcEeCJjlP69SQFVJTRBdjRfRf1IVFShAHpLPWzPQdm6j5GhoeYBrw7-d9RbbUwJRZgqoVhmT1I5Jwrq5DA8bb9L7mzt557v-KE7OMSvWOpS-N-HVFueMxBWC4pOHfh985l6nn3XeNwYqOJ6V2Z9NT9mo0rh4TFcogQ",
            likes: 1200, comments: 89, isOfficial: true,
        },
    ];

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-white font-display select-none transition-colors duration-300 md:pl-16">
            {/* Header */}
            <div className="w-full pt-6 px-5 pb-2 z-20 flex justify-between items-center transition-colors shrink-0 touch-none md:max-w-6xl md:mx-auto">
                <div className="md:hidden flex items-center gap-2">
                    <Link to="/home">
                        <img src="/logo/logo1.png" alt="Circuit de Catalunya" className="h-12 w-auto object-contain block dark:hidden" />
                        <img src="/logo/logo.png" alt="Circuit de Catalunya" className="h-12 w-auto object-contain hidden dark:block" />
                    </Link>
                </div>
                <h1 className="hidden md:block text-2xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white">
                    Community <span className="text-primary">Feed</span>
                </h1>
                <Link to="/profile" className="w-10 h-10 rounded-full border-2 border-primary p-0.5 overflow-hidden shadow-sm">
                    <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="w-full h-full object-cover rounded-full" />
                </Link>
            </div>

            {/* Content */}
            <div className="overflow-y-auto no-scrollbar pb-24 md:pb-10 px-5 pt-2 md:max-w-6xl md:mx-auto">
                <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8 lg:items-start">

                    {/* Main Feed */}
                    <div>
                        {/* Tabs */}
                        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-5 px-5 mb-4">
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
                            {posts.map((post) => (
                                <article key={post.id} className={`rounded-[24px] shadow-sm dark:shadow-none border overflow-hidden transition-all ${post.isOfficial ? 'bg-primary/5 dark:bg-primary/10 border-primary/20' : 'bg-white dark:bg-[#1e1e1e] border-slate-100 dark:border-white/5'}`}>
                                    <div className="p-5 flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-full shrink-0 ${post.isOfficial ? 'bg-primary flex items-center justify-center shadow-lg shadow-primary/30' : 'border-2 border-primary p-0.5 overflow-hidden'}`}>
                                            {post.isOfficial ? (
                                                <span className="material-symbols-outlined text-white text-[20px]">campaign</span>
                                            ) : post.avatar ? (
                                                <img alt="User" className="w-full h-full object-cover rounded-full" src={post.avatar} />
                                            ) : (
                                                <div className="w-full h-full bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                                                    <span className="text-[10px] font-black text-slate-500 dark:text-white/60">{post.initials}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`text-sm font-bold text-slate-800 dark:text-white ${post.isOfficial ? 'italic uppercase tracking-tighter font-black' : ''}`}>{post.user}</span>
                                                    {post.verified && <span className="text-primary material-symbols-outlined text-[14px] fill-1">verified</span>}
                                                    {post.isOfficial && <span className="bg-primary text-white text-[8px] px-1.5 py-0.5 rounded font-black">MOD</span>}
                                                </div>
                                                <span className="text-[10px] text-slate-400 dark:text-white/40 font-bold">{post.time}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-white/70 leading-relaxed mb-3 font-medium">{post.content}</p>
                                        </div>
                                    </div>
                                    {post.image && (
                                        <div className="px-5 pb-2">
                                            <img alt="Post" className="w-full h-56 object-cover rounded-[16px] shadow-md" src={post.image} />
                                        </div>
                                    )}
                                    <div className={`p-4 flex items-center gap-6 ${!post.isOfficial ? 'border-t border-slate-100 dark:border-white/5' : ''}`}>
                                        <button className={`flex items-center gap-1.5 group cursor-pointer ${post.likes > 100 ? 'text-primary' : 'text-slate-400 dark:text-white/40 hover:text-primary transition-colors'}`}>
                                            <span className="material-symbols-outlined text-[20px] group-active:scale-125 transition-transform fill-1">favorite</span>
                                            <span className="text-xs font-bold">{post.likes > 999 ? `${(post.likes/1000).toFixed(1)}k` : post.likes}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white cursor-pointer transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                                            <span className="text-xs font-bold">{post.comments}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white ml-auto cursor-pointer transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">share</span>
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar — desktop only */}
                    <div className="hidden lg:flex flex-col gap-5 sticky top-6">
                        {/* Group QR Invite */}
                        <div className="bg-white dark:bg-[#1e1e1e] rounded-[24px] border border-slate-100 dark:border-white/5 p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-4 h-1 bg-primary rounded-full"></div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/60">Your Group</h3>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-2xl">qr_code_2</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-white text-sm">Invite Friends</p>
                                    <p className="text-xs text-slate-400">Share your group QR code</p>
                                </div>
                            </div>
                            <button className="w-full bg-primary text-white font-bold py-2.5 rounded-xl text-sm shadow-lg shadow-primary/30 hover:bg-[#ff1e3c] transition-colors">
                                Show QR Code
                            </button>
                        </div>

                        {/* Trending Topics */}
                        <div className="bg-white dark:bg-[#1e1e1e] rounded-[24px] border border-slate-100 dark:border-white/5 p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-4 h-1 bg-primary rounded-full"></div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/60">Trending</h3>
                            </div>
                            <div className="space-y-3">
                                {['#SpanishGP', '#F1 2026', '#Qualifying', '#CatalunyaCircuit', '#FanZone'].map((tag, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-primary">{tag}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{(Math.random() * 10 + 1).toFixed(1)}k posts</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Active fans */}
                        <div className="bg-white dark:bg-[#1e1e1e] rounded-[24px] border border-slate-100 dark:border-white/5 p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-4 h-1 bg-primary rounded-full"></div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/60">Online Now</h3>
                            </div>
                            <div className="flex -space-x-2 mb-3">
                                {[12, 15, 20, 25, 30].map((img) => (
                                    <img key={img} src={`https://i.pravatar.cc/40?img=${img}`} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900" alt="User" />
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-primary flex items-center justify-center">
                                    <span className="text-[8px] font-black text-white">+48</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                <span className="font-bold text-slate-700 dark:text-white">53 fans</span> at the circuit right now
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAB — new post */}
            <button className="fixed bottom-24 right-5 md:bottom-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/40 z-[80] active:scale-90 transition-transform cursor-pointer hover:bg-[#ff1e3c]">
                <span className="material-symbols-outlined text-3xl font-bold">add</span>
            </button>

            {/* QR tab — mobile only */}
            <div className="md:hidden fixed left-0 top-1/2 -translate-y-1/2 w-12 h-24 bg-white/10 backdrop-blur-md rounded-r-2xl border-y border-r border-white/20 z-50 flex items-center justify-center shadow-lg cursor-pointer hover:bg-white/20 transition-all active:scale-95 group">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                    <span className="material-symbols-outlined text-white text-xl">qr_code_2</span>
                </div>
            </div>

            <Navbar />
        </div>
    );
};

export default Community;
