"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Trash2, CheckCheck, Inbox, Settings } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

export const NotificationCenter = () => {
    const {
        notifications,
        isNotificationCenterOpen,
        toggleNotificationCenter,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        setActiveChat,
        setActiveSection,
        setSettingsSubpage
    } = useChatStore();

    if (!isNotificationCenterOpen) return null;

    const handleNotificationClick = (notif: any) => {
        markNotificationAsRead(notif.id);
        setActiveSection("chats");
        if (notif.chatId) {
            setActiveChat(notif.chatId);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[250] flex items-center justify-end md:p-6 pb-24 md:pb-6">
                {/* Backdrop with high-end blur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    onClick={toggleNotificationCenter}
                />

                {/* Sidebar Notification Panel */}
                <motion.div
                    initial={{ x: "100%", opacity: 0, scale: 0.95 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: "100%", opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", damping: 28, stiffness: 220 }}
                    className="relative h-full w-full md:w-[26rem] bg-zinc-950/80 backdrop-blur-3xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden md:rounded-[2.5rem]"
                >
                    {/* Header */}
                    <div className="p-8 pb-6 border-b border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <h2 className="font-black text-xl tracking-tighter">Activity</h2>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-0.5">Notification Center</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleNotificationCenter}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-zinc-500 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {notifications.length > 0 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={markAllNotificationsAsRead}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all border border-white/5"
                                >
                                    <CheckCheck size={12} /> Mark all read
                                </button>
                                <button
                                    onClick={clearNotifications}
                                    className="px-4 py-2.5 bg-red-500/5 hover:bg-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-all border border-red-500/10"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-12 space-y-4">
                                <div className="w-20 h-20 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-zinc-800">
                                    <Inbox size={40} strokeWidth={1} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-zinc-500">Perfectly Quiet</p>
                                    <p className="text-xs text-zinc-700 mt-2 font-light leading-relaxed">
                                        Your activity log is clear. New messages and alerts will appear here.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {notifications.map((notif, i) => (
                                    <motion.div
                                        key={notif.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`p-5 rounded-[2rem] border transition-all duration-500 cursor-pointer relative group overflow-hidden ${notif.read
                                                ? "bg-white/[0.01] border-white/[0.03] grayscale-[0.8] opacity-60"
                                                : "bg-white/[0.05] border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                                            } hover:border-white/20 hover:bg-white/[0.08] hover:grayscale-0 hover:opacity-100`}
                                    >
                                        {!notif.read && (
                                            <div className="absolute top-5 right-5 w-2 h-2 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
                                        )}

                                        <div className="flex gap-5">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
                                                    {notif.avatar ? (
                                                        <img src={notif.avatar} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-white/5">
                                                            <Bell size={24} strokeWidth={1} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1.5">
                                                    <h4 className="text-sm font-black tracking-tight truncate text-white/90">{notif.title}</h4>
                                                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest ml-2">{notif.timestamp}</span>
                                                </div>
                                                <p className="text-[11px] text-zinc-500 font-medium line-clamp-2 leading-relaxed group-hover:text-zinc-300 transition-colors">
                                                    {notif.body}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-8 border-t border-white/5 bg-black/40">
                        <button
                            onClick={() => {
                                setActiveSection("settings");
                                setSettingsSubpage("notifications");
                                toggleNotificationCenter();
                            }}
                            className="w-full py-4 flex items-center justify-center gap-3 bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] rounded-[1.5rem] text-[10px] font-black tracking-[0.2em] text-zinc-500 hover:text-white transition-all uppercase"
                        >
                            <Settings size={14} /> Notification Settings
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
