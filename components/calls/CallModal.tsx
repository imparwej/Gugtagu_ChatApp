"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Video, Mic, Shield, User, Clock, Info } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

export const CallModal = ({ isOpen, onClose, call }: { isOpen: boolean, onClose: () => void, call: any }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)]"
                >
                    {/* Header */}
                    <div className="p-8 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-[3rem] bg-zinc-800 border border-white/10 overflow-hidden mb-6 shadow-2xl grayscale">
                            <img src={call.userAvatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight mb-2">{call.userName}</h2>
                        <div className="flex items-center gap-2 text-zinc-500 text-sm font-light">
                            {call.type === 'video' ? <Video size={14} /> : <Phone size={14} />}
                            <span className="capitalize">{call.status} Call</span>
                            <span>•</span>
                            <span>{call.timestamp}</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 border-y border-white/5 divide-x divide-white/5 bg-black/20">
                        <div className="p-6 flex flex-col items-center gap-2">
                            <Clock size={16} className="text-zinc-600" />
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Duration</span>
                            <span className="text-sm font-mono">{call.duration || '--:--'}</span>
                        </div>
                        <div className="p-6 flex flex-col items-center gap-2">
                            <Shield size={16} className="text-zinc-600" />
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Encrypted</span>
                            <span className="text-sm">End-to-End</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-10 flex justify-center gap-8">
                        <button className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                            <Mic size={24} />
                        </button>
                        <button
                            onClick={onClose}
                            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:bg-zinc-200 transition-all active:scale-95"
                        >
                            <X size={28} />
                        </button>
                    </div>

                    <div className="pb-8 text-center">
                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                            <Info size={10} /> Call Details Only
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
