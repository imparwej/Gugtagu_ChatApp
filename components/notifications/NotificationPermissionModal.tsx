"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ShieldCheck, Sparkles } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

export const NotificationPermissionModal = () => {
    const { notificationPermission, setNotificationPermission } = useChatStore();

    if (notificationPermission !== "default") return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
                {/* Immersive Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    onClick={() => setNotificationPermission("denied")}
                />

                {/* Glass Modal Card */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 40, rotateX: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 40, rotateX: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-[24rem] bg-zinc-950/50 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col items-center text-center overflow-hidden"
                >
                    {/* Decorative Light Leak */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative group mb-8">
                        <motion.div
                            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            className="w-20 h-20 rounded-[2rem] bg-white text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                        >
                            <Bell size={40} strokeWidth={1.5} fill="currentColor" />
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-zinc-900 border-4 border-black flex items-center justify-center text-white"
                        >
                            <Sparkles size={14} />
                        </motion.div>
                    </div>

                    <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">Stay Connected</h2>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-10 px-4">
                        Enable real-time notifications to receive messages instantly, even when Guftagu is in the background.
                    </p>

                    <div className="flex flex-col w-full gap-4">
                        <button
                            onClick={() => setNotificationPermission("granted")}
                            className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] hover:bg-zinc-200 transition-all active:scale-[0.96] shadow-[0_15px_30px_rgba(255,255,255,0.1)]"
                        >
                            Allow Notifications
                        </button>
                        <button
                            onClick={() => setNotificationPermission("denied")}
                            className="w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] text-zinc-600 hover:text-white hover:bg-white/5 transition-all active:scale-[0.96]"
                        >
                            Not Now
                        </button>
                    </div>

                    <div className="mt-10 flex items-center gap-2.5 text-[9px] text-zinc-700 uppercase tracking-[0.25em] font-black">
                        <ShieldCheck size={14} className="text-zinc-800" />
                        Private & Secure
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
