"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Bell, X } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

export const InAppNotification = () => {
    const { notifications, markNotificationAsRead, setActiveChat } = useChatStore();
    const latestNotification = notifications.find(n => !n.read);

    useEffect(() => {
        if (latestNotification) {
            const timer = setTimeout(() => {
                markNotificationAsRead(latestNotification.id);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [latestNotification]);

    if (!latestNotification) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 100, y: 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="fixed top-6 right-6 z-[300] w-full max-w-sm"
            >
                <div
                    onClick={() => {
                        if (latestNotification.chatId) setActiveChat(latestNotification.chatId);
                        markNotificationAsRead(latestNotification.id);
                    }}
                    className="bg-zinc-900/90 backdrop-blur-2xl border border-white/10 p-4 rounded-[2rem] shadow-2xl flex gap-4 items-center cursor-pointer hover:bg-zinc-800 transition-all group"
                >
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 overflow-hidden shadow-inner flex-shrink-0">
                        {latestNotification.avatar ? (
                            <img src={latestNotification.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                                <MessageSquare size={24} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                            <h4 className="text-sm font-bold truncate text-white/90">{latestNotification.title}</h4>
                            <span className="text-[10px] text-zinc-500 whitespace-nowrap ml-2">Just now</span>
                        </div>
                        <p className="text-xs text-zinc-400 font-light line-clamp-1">
                            {latestNotification.body}
                        </p>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            markNotificationAsRead(latestNotification.id);
                        }}
                        className="p-1.5 hover:bg-white/10 rounded-full text-zinc-500 hover:text-white transition-all"
                    >
                        <X size={16} />
                    </button>

                    {/* Animated Progress Pulse */}
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="h-full bg-white/40"
                        />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
