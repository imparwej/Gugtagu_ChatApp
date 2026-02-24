"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw, Zap, Image as ImageIcon, Send } from "lucide-react";

interface CameraUIProps {
    onCapture: (img: string) => void;
    onClose: () => void;
}

export const CameraUI = ({ onCapture, onClose }: CameraUIProps) => {
    const [capturedImg, setCapturedImg] = useState<string | null>(null);

    const handleCapture = () => {
        const mockImg = `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1554080353-a576cf803bda' : '1508921912186-1d1395efdb39'}?auto=format&fit=crop&q=80&w=800`;
        setCapturedImg(mockImg);
    };

    const handleSend = () => {
        if (capturedImg) {
            onCapture(capturedImg);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-between p-12"
        >
            {/* Header */}
            <div className="w-full flex justify-between items-center z-10">
                <button className="p-4 text-white/30 hover:text-white transition-colors"><Zap size={28} /></button>
                <div className="flex-1 text-center">
                    <span className="text-xs font-black uppercase tracking-[0.5em] text-white/20">Leica Optic Simulation</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-4 bg-white/5 border border-white/5 rounded-full text-white hover:bg-white/10 transition-all"
                >
                    <X size={28} />
                </button>
            </div>

            {/* Viewfinder */}
            <div className="flex-1 w-full max-w-xl relative flex items-center justify-center">
                <div className="w-full aspect-square rounded-[4rem] border border-white/10 overflow-hidden shadow-[0_0_150px_rgba(255,255,255,0.05)] relative bg-zinc-900 group">
                    {capturedImg ? (
                        <motion.img
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={capturedImg}
                            className="w-full h-full object-cover grayscale"
                            alt="Capture Preview"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                            <div className="w-1 h-1 bg-white/40 rounded-full animate-ping" />
                            <span className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.5em]">Calibrating Sensor</span>
                        </div>
                    )}
                    <div className="absolute inset-0 border-[30px] border-black/20 pointer-events-none" />
                </div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-xl mb-12 flex items-center justify-center gap-16 z-10">
                {capturedImg ? (
                    <>
                        <button
                            onClick={() => setCapturedImg(null)}
                            className="flex flex-col items-center gap-3 group"
                        >
                            <div className="p-5 bg-white/5 border border-white/5 rounded-2xl text-zinc-500 group-hover:text-white group-hover:bg-white/10 transition-all">
                                <RefreshCw size={28} />
                            </div>
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Retake</span>
                        </button>
                        <button
                            onClick={handleSend}
                            className="flex flex-col items-center gap-3 group"
                        >
                            <div className="p-8 bg-white rounded-full text-black shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-95 transition-all">
                                <Send size={36} fill="black" />
                            </div>
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Expose & Send</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button className="p-5 bg-white/5 border border-white/5 rounded-2xl text-zinc-600 hover:text-white transition-all"><ImageIcon size={28} /></button>
                        <button
                            onClick={handleCapture}
                            className="w-24 h-24 rounded-full border-[6px] border-white/20 p-2 hover:scale-105 transition-all active:scale-90 group"
                        >
                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-2xl group-active:scale-95 transition-transform" />
                        </button>
                        <button className="p-5 bg-white/5 border border-white/5 rounded-2xl text-zinc-600 hover:text-white transition-all"><RefreshCw size={28} /></button>
                    </>
                )}
            </div>
        </motion.div>
    );
};
