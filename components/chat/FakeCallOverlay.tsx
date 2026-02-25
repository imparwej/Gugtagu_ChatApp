"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Video, Mic, MicOff, Volume2, VolumeX, X, ChevronDown } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
};

export const FakeCallOverlay = () => {
    const { activeCallTarget, endCall, addCall, setCallMinimized } = useChatStore();
    const [phase, setPhase] = useState<"calling" | "connected">("calling");
    const [seconds, setSeconds] = useState(0);
    const [muted, setMuted] = useState(false);
    const [speakerOff, setSpeakerOff] = useState(false);

    useEffect(() => {
        if (!activeCallTarget) return;
        setPhase("calling");
        setSeconds(0);
        const timer = setTimeout(() => setPhase("connected"), 3000);
        return () => clearTimeout(timer);
    }, [activeCallTarget]);

    useEffect(() => {
        if (phase !== "connected") return;
        const interval = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(interval);
    }, [phase]);

    const handleEnd = () => {
        if (activeCallTarget) {
            addCall({
                id: `c_${Date.now()}`,
                userId: "new",
                userName: activeCallTarget.name,
                userAvatar: activeCallTarget.avatar,
                type: activeCallTarget.type,
                status: "outgoing",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                duration: phase === "connected" ? formatTime(seconds) : undefined,
                dateLabel: "Today",
            });
        }
        endCall();
    };

    return (
        <AnimatePresence>
            {activeCallTarget && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[600] bg-black flex flex-col items-center justify-between py-20 overflow-hidden"
                >
                    <div className="absolute top-8 left-8 z-20">
                        <button
                            onClick={() => setCallMinimized(true)}
                            className="p-2 hover:bg-white/10 rounded-xl text-zinc-500 hover:text-white transition-all"
                        >
                            <ChevronDown size={24} />
                        </button>
                    </div>

                    {/* Ambient glow */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/[0.03] rounded-full blur-3xl" />
                    </div>

                    {/* Top info */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-2 z-10"
                    >
                        <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-bold uppercase tracking-[0.3em]">
                            {activeCallTarget.type === "video" ? <Video size={12} /> : <Phone size={12} />}
                            {activeCallTarget.type} Call
                        </div>
                        <p className="text-sm text-zinc-400 font-light">
                            {phase === "calling" ? "Calling…" : formatTime(seconds)}
                        </p>
                    </motion.div>

                    {/* Avatar + pulse rings */}
                    <div className="relative flex items-center justify-center z-10">
                        {/* Rings – only when calling */}
                        <AnimatePresence>
                            {phase === "calling" && [1, 1.6, 2.2].map((scale, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-36 h-36 rounded-full border border-white/10"
                                    animate={{ scale: [scale, scale + 0.3, scale], opacity: [0.6, 0, 0.6] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                                />
                            ))}
                        </AnimatePresence>

                        {/* Avatar */}
                        <motion.div
                            animate={phase === "calling" ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-36 h-36 rounded-[3rem] bg-zinc-900 border-2 border-white/10 overflow-hidden shadow-2xl"
                        >
                            <img src={activeCallTarget.avatar} alt="" className="w-full h-full object-cover grayscale" />
                        </motion.div>
                    </div>

                    {/* Name */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-1 z-10"
                    >
                        <h2 className="text-3xl font-black tracking-tight">{activeCallTarget.name}</h2>
                        <p className="text-zinc-500 text-sm font-light">
                            {phase === "calling" ? "Ringing…" : "Connected"}
                        </p>
                    </motion.div>

                    {/* Controls */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-8 z-10"
                    >
                        <button
                            onClick={() => setMuted(!muted)}
                            className={`flex flex-col items-center gap-2 group`}
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all border ${muted ? "bg-white text-black border-white" : "bg-white/5 border-white/10 hover:bg-white/10 text-white"}`}>
                                {muted ? <MicOff size={22} /> : <Mic size={22} />}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{muted ? "Unmute" : "Mute"}</span>
                        </button>

                        {/* End call */}
                        <button onClick={handleEnd} className="flex flex-col items-center gap-2">
                            <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all">
                                <Phone size={28} className="rotate-[135deg]" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">End</span>
                        </button>

                        <button
                            onClick={() => setSpeakerOff(!speakerOff)}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all border ${speakerOff ? "bg-white text-black border-white" : "bg-white/5 border-white/10 hover:bg-white/10 text-white"}`}>
                                {speakerOff ? <VolumeX size={22} /> : <Volume2 size={22} />}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Speaker</span>
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
