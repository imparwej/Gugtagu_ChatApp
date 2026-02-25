"use client";

import React from "react";
import { MessageCircle, CircleDashed, Phone, Settings } from "lucide-react";
import { useChatStore } from "../store/chatStore";
import { motion } from "framer-motion";
import { SectionType } from "../types/chat";
import { Logo } from "./Logo";

const SECTION_LABELS: Record<string, string> = {
    chats: "Chats",
    status: "Status",
    calls: "Calls",
    settings: "Settings",
    profile: "Profile",
};

export const NavigationSidebar = () => {
    const {
        activeSection, setActiveSection, unreadCounts, chats, calls, currentUser,
        activeSettingsSubpage, setSettingsSubpage
    } = useChatStore();

    const totalChatUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);
    const missedCalls = calls.filter(c => c.status === "missed").length;
    const unreadStories = 0; // placeholder

    const navItems: { id: SectionType; icon: any; badge?: number }[] = [
        { id: "chats", icon: MessageCircle, badge: totalChatUnread },
        { id: "status", icon: CircleDashed, badge: unreadStories },
        { id: "calls", icon: Phone, badge: missedCalls },
    ];

    return (
        <div className="w-[72px] h-full bg-black border-r border-white/[0.04] flex flex-col items-center py-6 gap-2 z-50 flex-shrink-0">
            {/* Logo mark */}
            <div className="mb-4">
                <Logo iconOnly size={40} />
            </div>

            {/* Top nav */}
            <div className="flex flex-col gap-1 items-center w-full px-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        title={SECTION_LABELS[item.id]}
                        className="relative group w-full flex items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:bg-white/5"
                    >
                        {/* Active indicator */}
                        {activeSection === item.id && (
                            <motion.div
                                layoutId="nav-indicator"
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-[2px_0_12px_rgba(255,255,255,0.5)]"
                            />
                        )}

                        <item.icon
                            size={22}
                            strokeWidth={activeSection === item.id ? 2.5 : 1.5}
                            className={`transition-all duration-300 ${activeSection === item.id
                                ? "text-white"
                                : "text-zinc-600 group-hover:text-zinc-300"
                                }`}
                        />

                        {/* Badge */}
                        {!!item.badge && (
                            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] bg-white text-black text-[8px] font-black rounded-full flex items-center justify-center px-1 border-2 border-black">
                                {item.badge > 99 ? "99+" : item.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Bottom */}
            <div className="mt-auto flex flex-col gap-1 items-center w-full px-2">
                <button
                    onClick={() => setActiveSection("settings")}
                    title="Settings"
                    className="relative group w-full flex items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:bg-white/5"
                >
                    {activeSection === "settings" && (
                        <motion.div
                            layoutId="nav-indicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-[2px_0_12px_rgba(255,255,255,0.5)]"
                        />
                    )}
                    <Settings
                        size={22}
                        strokeWidth={activeSection === "settings" ? 2.5 : 1.5}
                        className={`transition-all duration-300 ${activeSection === "settings"
                            ? "text-white"
                            : "text-zinc-600 group-hover:text-zinc-300"
                            }`}
                    />
                </button>

                {/* Avatar / Profile */}
                <button
                    onClick={() => { setActiveSection("settings"); setSettingsSubpage("profile"); }}
                    title="Profile"
                    className={`p-0.5 border rounded-2xl transition-all duration-300 group overflow-hidden mt-2 ${activeSection === "settings" && activeSettingsSubpage === "profile" ? "border-white" : "border-white/10 hover:border-white/25"}`}
                >
                    <img
                        src={currentUser.avatar}
                        alt="Me"
                        className={`w-9 h-9 rounded-[14px] object-cover transition-all duration-500 ${activeSection === "settings" && activeSettingsSubpage === "profile" ? "grayscale-0" : "grayscale group-hover:grayscale-0"}`}
                    />
                </button>
            </div>
        </div>
    );
};
