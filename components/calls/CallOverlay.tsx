"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mic, MicOff, Video, VideoOff, PhoneOff,
    Maximize2, Minimize2, Volume2, VolumeX,
    MessageSquare, UserPlus, MoreVertical
} from "lucide-react";
import { useChatStore } from "../../store/chatStore";

export const CallOverlay = () => {
    const { activeCallTarget, endCall, activeOverlay } = useChatStore();
    const [status, setStatus] = useState("Calling...");
    const [timer, setTimer] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaker, setIsSpeaker] = useState(true);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const isOpen = activeOverlay === "call" && !!activeCallTarget;

    useEffect(() => {
        if (!isOpen) {
            setStatus("Calling...");
            setTimer(0);
            return;
        }

        const statusTimeout = setTimeout(() => {
            setStatus("Ringing...");
            const connectTimeout = setTimeout(() => {
                setStatus("00:00");
                const interval = setInterval(() => {
                    setTimer(prev => prev + 1);
                }, 1000);
                return () => clearInterval(interval);
            }, 3000);
            return () => clearTimeout(connectTimeout);
        }, 2000);

        return () => clearTimeout(statusTimeout);
    }, [isOpen]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!activeCallTarget) return null;

    const isVideo = activeCallTarget.type === "video";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{
                        opacity: 1,
                        scale: isMinimized ? 0.4 : 1,
                        y: isMinimized ? 0 : 0,
                        x: isMinimized ? "30%" : "0%",
                        bottom: isMinimized ? "20px" : "0px",
                        right: isMinimized ? "20px" : "0px",
                        top: isMinimized ? "auto" : "0px",
                        left: isMinimized ? "auto" : "0px",
                        width: isMinimized ? "300px" : "100%",
                        height: isMinimized ? "180px" : "100%",
                        borderRadius: isMinimized ? "24px" : "0px",
                    }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`fixed z-[500] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between py-16 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5`}
                >
                    {/* Minimize Toggle */}
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="absolute top-8 left-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group"
                    >
                        {isMinimized ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
                    </button>

                    {/* Top Info */}
                    <div className={`flex flex-col items-center gap-6 ${isMinimized ? "scale-75 origin-top" : ""}`}>
                        <div className="relative">
                            <motion.div
                                animate={status === "Ringing..." ? { scale: [1, 1.05, 1] } : {}}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className={`rounded-[3rem] overflow-hidden border-2 border-white/10 shadow-2xl grayscale transition-all duration-1000 ${isVideo ? (isMinimized ? "w-20 h-20" : "w-32 h-32 opacity-0") : "w-40 h-40"}`}
                            >
                                <img src={activeCallTarget.avatar} alt="" className="w-full h-full object-cover" />
                            </motion.div>
                            {status === "Ringing..." && (
                                <div className="absolute -inset-4 border border-white/10 rounded-[3.5rem] animate-ping opacity-20" />
                            )}
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl font-black tracking-tighter mb-2">{activeCallTarget.name}</h2>
                            <p className="text-sm font-black uppercase tracking-[0.4em] text-zinc-500 animate-pulse">
                                {timer > 0 ? formatTime(timer) : status}
                            </p>
                        </div>
                    </div>

                    {/* Video Background / Preview */}
                    {isVideo && !isMinimized && (
                        <div className="absolute inset-0 z-[-1] flex items-center justify-center overflow-hidden">
                            {/* Main Video Area (Placeholder) */}
                            <div className="w-full h-full bg-[#050505] flex items-center justify-center">
                                <Video size={64} className="text-zinc-900 animate-pulse" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
                            </div>

                            {/* Self Preview */}
                            <motion.div
                                drag
                                dragConstraints={{ top: -200, left: -400, right: 400, bottom: 200 }}
                                className="absolute bottom-32 right-8 w-48 h-64 bg-zinc-900 rounded-[2.5rem] border-2 border-white/10 overflow-hidden shadow-2xl pointer-events-auto cursor-move group"
                            >
                                {isCameraOff ? (
                                    <div className="w-full h-full flex items-center justify-center bg-black">
                                        <VideoOff className="text-zinc-800" />
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                                        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#222_0%,_#000_100%)] opacity-50" />
                                        <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase font-bold tracking-widest text-zinc-600">Camera Active</div>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 p-2 bg-black/50 backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Call Controls */}
                    <div className={`flex items-center gap-8 ${isMinimized ? "scale-75 origin-bottom translate-y-8" : ""}`}>
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className={`p-5 rounded-full transition-all duration-300 ${isMuted ? "bg-white text-black" : "bg-white/5 hover:bg-white/10 text-white"}`}
                        >
                            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                        </button>

                        {isVideo ? (
                            <button
                                onClick={() => setIsCameraOff(!isCameraOff)}
                                className={`p-5 rounded-full transition-all duration-300 ${isCameraOff ? "bg-white text-black" : "bg-white/5 hover:bg-white/10 text-white"}`}
                            >
                                {isCameraOff ? <VideoOff size={24} /> : <Video size={24} />}
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsSpeaker(!isSpeaker)}
                                className={`p-5 rounded-full transition-all duration-300 ${!isSpeaker ? "bg-white text-black" : "bg-white/5 hover:bg-white/10 text-white"}`}
                            >
                                {isSpeaker ? <Volume2 size={24} /> : <VolumeX size={24} />}
                            </button>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={endCall}
                            className="p-6 bg-red-500 hover:bg-red-600 text-white rounded-[2rem] transition-all shadow-[0_0_40px_rgba(239,68,68,0.3)]"
                        >
                            <PhoneOff size={32} strokeWidth={2.5} />
                        </motion.button>
                    </div>

                    {/* Bottom Status (only for full view) */}
                    {!isMinimized && (
                        <div className="flex items-center gap-8 text-zinc-600">
                            <div className="flex items-center gap-2">
                                <MessageSquare size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Chat</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <UserPlus size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Add User</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MoreVertical size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">More</span>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
