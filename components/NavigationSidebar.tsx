"use client";

import React from "react";
import { MessageCircle, CircleDashed, Phone, Settings } from "lucide-react";
import { useChatStore } from "../store/chatStore";
import { motion } from "framer-motion";
import { SectionType } from "../types/chat";

export const NavigationSidebar = () => {
    const { activeSection, setActiveSection, notificationCount, currentUser } = useChatStore();

    const navItems: { id: SectionType; icon: any; label: string }[] = [
        { id: "chats", icon: MessageCircle, label: "Chats" },
        { id: "status", icon: CircleDashed, label: "Status" },
        { id: "calls", icon: Phone, label: "Calls" },
    ];

    return (
        <div className="w-[72px] h-full bg-black border-r border-white/5 flex flex-col items-center py-8 gap-8 z-50">
            {/* Top Section */}
            <div className="flex flex-col gap-8 items-center">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className="relative group p-3 hover:bg-white/5 rounded-2xl transition-all duration-500"
                        title={item.label}
                    >
                        <item.icon
                            size={24}
                            strokeWidth={activeSection === item.id ? 2.5 : 1.5}
                            className={`transition-all duration-500 ${activeSection === item.id ? "text-white" : "text-zinc-600 group-hover:text-zinc-300"}`}
                            fill={activeSection === item.id && item.id === 'chats' ? "white" : "none"}
                        />

                        {activeSection === item.id && (
                            <motion.div
                                layoutId="nav-active"
                                className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full shadow-[4px_0_12px_rgba(255,255,255,0.4)]"
                            />
                        )}

                        {item.id === 'chats' && notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-[9px] font-black rounded-full flex items-center justify-center border-2 border-black">
                                {notificationCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Bottom Section */}
            <div className="mt-auto flex flex-col gap-8 items-center">
                <button
                    onClick={() => setActiveSection("settings")}
                    className="relative group p-3 hover:bg-white/5 rounded-2xl transition-all duration-500"
                    title="Settings"
                >
                    <Settings
                        size={24}
                        strokeWidth={activeSection === "settings" ? 2.5 : 1.5}
                        className={`transition-all duration-500 ${activeSection === "settings" ? "text-white" : "text-zinc-600 group-hover:text-zinc-300"}`}
                    />
                    {activeSection === "settings" && (
                        <motion.div
                            layoutId="nav-active"
                            className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full shadow-[4px_0_12px_rgba(255,255,255,0.4)]"
                        />
                    )}
                </button>

                <div
                    onClick={() => setActiveSection("settings")}
                    className="relative group p-1 border border-white/5 hover:border-white/20 rounded-2xl transition-all duration-500 cursor-pointer overflow-hidden p-0.5"
                >
                    <img
                        src={currentUser.avatar}
                        alt="Profile"
                        className="w-10 h-10 rounded-[14px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                </div>
            </div>
        </div>
    );
};
