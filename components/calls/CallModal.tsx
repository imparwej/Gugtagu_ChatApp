"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Video, Clock, Shield, PhoneIncoming, PhoneMissed, PhoneOutgoing } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { Call } from "../../types/chat";

interface Props { isOpen: boolean; onClose: () => void; call: Call | null; }

export const CallModal = ({ isOpen, onClose, call }: Props) => {
    const { startCall } = useChatStore();
    if (!call) return null;

    const StatusIcon = call.status === "missed" ? PhoneMissed : call.status === "incoming" ? PhoneIncoming : PhoneOutgoing;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/75 backdrop-blur-xl" onClick={onClose} />

                    <motion.div
                        initial={{ scale: 0.92, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.92, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 280, damping: 26 }}
                        className="relative w-full max-w-xs bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                    >
                        <button onClick={onClose} className="absolute top-5 right-5 p-2 hover:bg-white/10 rounded-full text-zinc-500 hover:text-white transition-all z-10">
                            <X size={16} />
                        </button>

                        {/* Avatar */}
                        <div className="flex flex-col items-center pt-10 pb-6 px-8 text-center">
                            <div className="w-20 h-20 rounded-[2rem] overflow-hidden border border-white/10 mb-4 grayscale">
                                <img src={call.userAvatar} alt="" className="w-full h-full object-cover" />
                            </div>
                            <h2 className="text-xl font-black tracking-tight mb-1">{call.userName}</h2>
                            <div className={`flex items-center gap-1.5 text-xs font-bold ${call.status === "missed" ? "text-red-400" : "text-zinc-500"}`}>
                                <StatusIcon size={12} />
                                <span className="capitalize">{call.status} {call.type} call</span>
                            </div>
                            <p className="text-[10px] text-zinc-700 mt-1">{call.timestamp}</p>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-2 border-y border-white/[0.06] divide-x divide-white/[0.06] bg-white/[0.02]">
                            <div className="flex flex-col items-center gap-1.5 p-5">
                                <Clock size={14} className="text-zinc-600" />
                                <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">Duration</span>
                                <span className="text-sm font-mono text-white/80">{call.duration || "--:--"}</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 p-5">
                                <Shield size={14} className="text-zinc-600" />
                                <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">Encrypted</span>
                                <span className="text-xs text-white/80">End-to-End</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 p-6">
                            <button
                                onClick={() => { startCall({ name: call.userName, avatar: call.userAvatar, type: "voice" }); onClose(); }}
                                className="flex-1 flex flex-col items-center gap-2 py-4 bg-white/5 border border-white/[0.06] hover:bg-white/10 rounded-2xl transition-all group"
                            >
                                <Phone size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-white transition-colors">Voice</span>
                            </button>
                            <button
                                onClick={() => { startCall({ name: call.userName, avatar: call.userAvatar, type: "video" }); onClose(); }}
                                className="flex-1 flex flex-col items-center gap-2 py-4 bg-white/5 border border-white/[0.06] hover:bg-white/10 rounded-2xl transition-all group"
                            >
                                <Video size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-white transition-colors">Video</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
