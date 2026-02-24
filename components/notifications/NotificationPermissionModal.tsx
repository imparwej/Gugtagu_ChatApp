"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ShieldCheck } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

export const NotificationPermissionModal = () => {
    const { notificationPermission, setNotificationPermission } = useChatStore();

    if (notificationPermission !== "default") return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop Blur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setNotificationPermission("denied")}
                />

                {/* Modal Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-sm bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                        <Bell size={32} className="text-white/80" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Enable Notifications</h2>
                    <p className="text-sm text-zinc-400 font-light leading-relaxed mb-8">
                        Stay updated with real-time messages and system alerts. You can change this later in settings.
                    </p>

                    <div className="flex flex-col w-full gap-3">
                        <button
                            onClick={() => setNotificationPermission("granted")}
                            className="w-full bg-white text-black py-4 rounded-2xl font-semibold hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-lg shadow-white/5"
                        >
                            Allow Notifications
                        </button>
                        <button
                            onClick={() => setNotificationPermission("denied")}
                            className="w-full py-4 rounded-2xl font-medium text-zinc-500 hover:text-white hover:bg-white/5 transition-all active:scale-[0.98]"
                        >
                            Not Now
                        </button>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                        <ShieldCheck size={12} />
                        End-to-end Encrypted
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
