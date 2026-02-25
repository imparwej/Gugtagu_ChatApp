"use client";

import React from "react";
import {
    User, Lock, Shield, MessageSquare, Bell, HardDrive,
    ChevronRight, LogOut
} from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { SettingsSubpage } from "../../types/chat";

export const SettingsSidebar = () => {
    const { activeSettingsSubpage, setSettingsSubpage, currentUser, setLoggedIn } = useChatStore();

    const menuItems: { id: SettingsSubpage; icon: any; label: string; desc: string }[] = [
        { id: "profile", icon: User, label: "Profile", desc: "Name, status, avatar" },
        { id: "account", icon: Lock, label: "Account", desc: "Security, change number" },
        { id: "privacy", icon: Shield, label: "Privacy", desc: "Last seen, block list" },
        { id: "chats", icon: MessageSquare, label: "Chats", desc: "Theme, wallpaper, history" },
        { id: "notifications", icon: Bell, label: "Notifications", desc: "Sounds, group alerts" },
        { id: "storage", icon: HardDrive, label: "Storage and Data", desc: "Auto-download, network" },
    ];

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a]">
            {/* Header */}
            <div className="p-6 pb-2">
                <h2 className="text-2xl font-black tracking-tighter">Settings</h2>
            </div>

            {/* Profile Brief */}
            <div
                onClick={() => setSettingsSubpage("profile")}
                className="p-4 mx-2 mb-4 mt-2 flex items-center gap-4 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 rounded-2xl transition-all cursor-pointer group"
            >
                <img src={currentUser.avatar} alt="" className="w-14 h-14 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-white truncate">{currentUser.name}</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{currentUser.about || "Hey there! I am using Guftagu."}</p>
                </div>
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setSettingsSubpage(item.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group ${activeSettingsSubpage === item.id ? "bg-white/10 shadow-xl" : "hover:bg-white/5"}`}
                    >
                        <div className={`p-2 rounded-lg ${activeSettingsSubpage === item.id ? "bg-white text-black" : "bg-white/5 text-zinc-500 group-hover:text-white"} transition-colors`}>
                            <item.icon size={18} />
                        </div>
                        <div className="flex-1 text-left">
                            <h4 className="text-sm font-bold text-white/90">{item.label}</h4>
                            <p className="text-[10px] text-zinc-600 font-medium tracking-wide mt-0.5">{item.desc}</p>
                        </div>
                        <ChevronRight size={14} className={`text-zinc-800 group-hover:text-white transition-opacity ${activeSettingsSubpage === item.id ? "opacity-100" : "opacity-0"}`} />
                    </button>
                ))}

                <button
                    onClick={() => setLoggedIn(false)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-500/10 transition-all group mt-8"
                >
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                        <LogOut size={18} />
                    </div>
                    <div className="flex-1 text-left">
                        <h4 className="text-sm font-bold text-red-500">Log Out</h4>
                        <p className="text-[10px] text-red-500/40 font-medium tracking-wide mt-0.5">Exit application session</p>
                    </div>
                </button>
            </div>
        </div>
    );
};
