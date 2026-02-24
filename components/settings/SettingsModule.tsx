"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Shield, Lock, Bell, Database, HelpCircle, QrCode, Camera, Edit2 } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

export const SettingsModule = () => {
    const { currentUser, updateProfile } = useChatStore();
    const [activeTab, setActiveTab] = useState<string | null>(null);

    const menuItems = [
        { id: 'account', label: 'Account', icon: User, desc: 'Security, change number' },
        { id: 'privacy', label: 'Privacy', icon: Lock, desc: 'Block contacts, disappearing messages' },
        { id: 'avatar', label: 'Avatar', icon: User, desc: 'Create, edit, profile photo' },
        { id: 'chats', label: 'Chats', icon: Shield, desc: 'Theme, wallpapers, chat history' },
        { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Message, group & call tones' },
        { id: 'storage', label: 'Storage and Data', icon: Database, desc: 'Network usage, auto-download' },
        { id: 'help', label: 'Help', icon: HelpCircle, desc: 'Help center, contact us, privacy policy' },
    ];

    if (activeTab === 'profile') {
        return (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-6">
                <button onClick={() => setActiveTab(null)} className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                    <ArrowLeft size={20} /> <span className="text-sm font-medium">Back</span>
                </button>
                <div className="flex flex-col items-center">
                    <div className="relative group mb-8">
                        <div className="w-40 h-40 rounded-[3rem] bg-zinc-900 border border-white/10 overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-700">
                            <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <button className="absolute bottom-0 right-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shadow-2xl hover:scale-105 active:scale-95 transition-all">
                            <Camera size={20} />
                        </button>
                    </div>

                    <div className="w-full space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-4">Name</label>
                            <div className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-all">
                                <span className="font-medium text-white/90">{currentUser.name}</span>
                                <Edit2 size={16} className="text-zinc-600 group-hover:text-white transition-colors cursor-pointer" />
                            </div>
                            <p className="text-[10px] text-zinc-600 ml-4 font-light">This is not your username or pin. This name will be visible to your Guftagu contacts.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-4">About</label>
                            <div className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-all">
                                <span className="font-light text-white/70">{currentUser.about}</span>
                                <Edit2 size={16} className="text-zinc-600 group-hover:text-white transition-colors cursor-pointer" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-4">Phone</label>
                            <div className="p-4 ml-4">
                                <span className="text-white/90 font-mono italic">{currentUser.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="p-8 pb-4">
                <h1 className="text-4xl font-black tracking-tighter mb-8">Settings</h1>

                {/* Profile Summary Card */}
                <div
                    onClick={() => setActiveTab('profile')}
                    className="p-6 bg-white/5 border border-white/5 rounded-[2.5rem] flex items-center gap-5 cursor-pointer hover:bg-white/10 hover:border-white/10 transition-all duration-500 group"
                >
                    <div className="w-20 h-20 rounded-3xl bg-zinc-800 border border-white/10 overflow-hidden shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700">
                        <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold tracking-tight text-white/90">{currentUser.name}</h3>
                        <p className="text-sm text-zinc-500 font-light truncate">{currentUser.about}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl text-zinc-500 group-hover:text-white group-hover:bg-white/10 transition-all">
                        <QrCode size={24} />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 custom-scrollbar">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-5 p-5 hover:bg-white/5 rounded-[1.75rem] transition-all cursor-pointer group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:border-white/20 group-hover:bg-zinc-800 transition-all">
                            <item.icon size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white/90 tracking-tight group-hover:translate-x-1 transition-transform">{item.label}</h4>
                            <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest mt-0.5">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-8 pt-4">
                <p className="text-center text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em]">Guftagu 2.0.0</p>
            </div>
        </div>
    );
};
