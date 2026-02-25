"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, BellDot } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

export const InAppNotification = () => {
    const { notifications, markNotificationAsRead, setActiveChat, setActiveSection } = useChatStore();
    const latestNotification = notifications.find(n => !n.read);

    useEffect(() => {
        if (latestNotification) {
            const timer = setTimeout(() => {
                markNotificationAsRead(latestNotification.id);
            }, 6000); // Slightly longer for readability
            return () => clearTimeout(timer);
        }
    }, [latestNotification]);

    if (!latestNotification) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 50, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 150 }}
                className="fixed top-8 right-8 z-[300] w-[22rem]"
            >
                <div
                    onClick={() => {
                        setActiveSection("chats");
                        if (latestNotification.chatId) setActiveChat(latestNotification.chatId);
                        markNotificationAsRead(latestNotification.id);
                    }}
                    className="relative bg-zinc-950/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex gap-4 items-center cursor-pointer hover:bg-zinc-900 transition-all group overflow-hidden"
                >
                    {/* Glass Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.05] pointer-events-none" />

                    <div className="relative w-12 h-12 rounded-[1.25rem] bg-zinc-900 border border-white/5 overflow-hidden shadow-2xl flex-shrink-0">
                        {latestNotification.avatar ? (
                            <img src={latestNotification.avatar} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-white/5">
                                <MessageSquare size={20} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="text-[13px] font-black tracking-tight truncate text-white/90">{latestNotification.title}</h4>
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]" />
                        </div>
                        <p className="text-xs text-zinc-500 font-medium line-clamp-1 leading-tight mb-1">
                            {latestNotification.body}
                        </p>
                        <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Just now • Guftagu</span>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            markNotificationAsRead(latestNotification.id);
                        }}
                        className="p-2 hover:bg-white/10 rounded-xl text-zinc-700 hover:text-white transition-all ml-1"
                    >
                        <X size={14} />
                    </button>

                    {/* Animated Progress Bar (Slimmer) */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.03] overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 6, ease: "linear" }}
                            className="h-full bg-white opacity-40 shadow-[0_0_8px_white]"
                        />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
