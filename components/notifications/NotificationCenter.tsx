"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, MessageSquare, Info, ShieldAlert } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

export const NotificationCenter = () => {
    const {
        notifications,
        isNotificationCenterOpen,
        toggleNotificationCenter,
        markNotificationAsRead,
        setActiveChat
    } = useChatStore();

    if (!isNotificationCenterOpen) return null;

    const handleNotificationClick = (notif: any) => {
        markNotificationAsRead(notif.id);
        if (notif.chatId) {
            setActiveChat(notif.chatId);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-end md:p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
                    onClick={toggleNotificationCenter}
                />

                {/* Sidebar Notification Panel */}
                <motion.div
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative h-full w-full md:w-96 bg-zinc-900/90 backdrop-blur-3xl border-l border-white/10 shadow-2xl flex flex-col overflow-hidden md:rounded-[2rem] md:h-[calc(100vh-2rem)]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell size={20} className="text-white/80" />
                            <h2 className="font-bold text-lg tracking-tight">Notifications</h2>
                        </div>
                        <button
                            onClick={toggleNotificationCenter}
                            className="p-2 hover:bg-white/5 rounded-xl transition-all text-zinc-500 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Notification List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-8">
                                <Bell size={48} className="mb-4" />
                                <p className="text-sm font-light">All caught up! No new notifications.</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <motion.div
                                    key={notif.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`p-4 rounded-3xl border border-white/5 cursor-pointer transition-all duration-300 relative overflow-hidden group ${notif.read ? "bg-white/[0.02]" : "bg-white/[0.08] shadow-xl"
                                        }`}
                                >
                                    {!notif.read && (
                                        <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                    )}

                                    <div className="flex gap-4">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 overflow-hidden shadow-inner">
                                                {notif.avatar ? (
                                                    <img src={notif.avatar} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white/20">
                                                        {notif.type === "system" ? <ShieldAlert size={20} /> : <Info size={20} />}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-sm font-semibold truncate text-white/90">{notif.title}</h4>
                                                <span className="text-[10px] text-zinc-500 whitespace-nowrap ml-2">{notif.timestamp}</span>
                                            </div>
                                            <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed">
                                                {notif.body}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/5 bg-black/20">
                        <button className="w-full py-3 text-xs font-semibold text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.2em]">
                            Settings & Preferences
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
