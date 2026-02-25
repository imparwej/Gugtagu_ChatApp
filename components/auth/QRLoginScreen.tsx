"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Smartphone, Scan, CheckCircle2, ChevronRight, Lock, Wifi } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

const QRCode = () => (
    <div className="relative w-56 h-56">
        {/* Outer frame */}
        <div className="absolute inset-0 rounded-3xl border-2 border-white/10 bg-white/3" />

        {/* Corner accents */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/60 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/60 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/60 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/60 rounded-br-lg" />

        {/* QR grid mockup */}
        <div className="absolute inset-8 grid grid-cols-7 gap-1">
            {Array.from({ length: 49 }).map((_, i) => {
                const corners = [0, 1, 2, 7, 8, 9, 14, 15, 16, 4, 5, 6, 11, 12, 13, 18, 19, 20, 28, 29, 30, 35, 36, 37, 42, 43, 44, 32, 33, 34, 39, 40, 41, 46, 47, 48];
                const dark = corners.includes(i) || (i * 1337) % 7 > 3;
                return (
                    <div
                        key={i}
                        className={`rounded-[2px] ${dark ? "bg-white/80" : "bg-transparent"}`}
                    />
                );
            })}
        </div>

        {/* Center logo */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                <span className="text-white font-black text-xs tracking-tighter">G</span>
            </div>
        </div>

        {/* Animated scan line */}
        <motion.div
            animate={{ y: [0, 176, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-8 right-8 top-8 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none"
        />
    </div>
);

export const QRLoginScreen = () => {
    const { setLoggedIn } = useChatStore();
    const [scanning, setScanning] = useState(false);
    const [done, setDone] = useState(false);

    const handleSimulateScan = () => {
        setScanning(true);
        setTimeout(() => {
            setDone(true);
            setTimeout(() => setLoggedIn(true), 1200);
        }, 2000);
    };

    const steps = [
        "Open Guftagu on your phone",
        "Tap Menu → Linked Devices",
        "Tap \"Link a Device\"",
        "Point your phone at this screen",
    ];

    return (
        <div className="h-screen w-full bg-black flex items-center justify-center overflow-hidden relative">
            {/* Background ambient */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/[0.015] rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-20 max-w-5xl px-8">
                {/* Left: Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "circOut" }}
                    className="flex flex-col gap-8 max-w-sm"
                >
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            <span className="text-black font-black text-xl tracking-tighter">G</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter text-white">Guftagu</h1>
                            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-bold">Web Client</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-4xl font-black tracking-tight text-white leading-tight mb-4">
                            Use Guftagu on your computer
                        </h2>
                        <p className="text-zinc-500 text-sm font-light leading-relaxed">
                            Scan the QR code with your phone to connect securely. All messages stay between you.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-4">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="flex items-center gap-4 group"
                            >
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-[11px] font-black text-white/40">{i + 1}</span>
                                </div>
                                <p className="text-sm text-zinc-400 font-medium group-hover:text-white transition-colors">{step}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer trust indicators */}
                    <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-zinc-700">
                            <Lock size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-700">
                            <Shield size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Secure</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right: QR Panel */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: "circOut" }}
                    className="flex flex-col items-center gap-8"
                >
                    <div className="relative bg-white/[0.02] border border-white/8 rounded-[3rem] p-10 flex flex-col items-center gap-8 shadow-[0_0_80px_rgba(255,255,255,0.03)]">
                        {/* QR / Scanning / Done states */}
                        <AnimatePresence mode="wait">
                            {done ? (
                                <motion.div
                                    key="done"
                                    initial={{ scale: 0.7, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-56 h-56 flex flex-col items-center justify-center gap-4"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <CheckCircle2 size={72} className="text-white" strokeWidth={1.5} />
                                    </motion.div>
                                    <p className="text-sm font-bold text-white/80 tracking-wide">Connecting…</p>
                                </motion.div>
                            ) : scanning ? (
                                <motion.div
                                    key="scanning"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-56 h-56 flex flex-col items-center justify-center gap-6"
                                >
                                    <div className="relative w-20 h-20">
                                        {[1, 2, 3].map((n) => (
                                            <div
                                                key={n}
                                                className={`absolute inset-0 rounded-full border border-white/20 call-ring call-ring-${n}`}
                                                style={{ transform: `scale(${n})` }}
                                            />
                                        ))}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Smartphone size={32} className="text-white" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-white">Scanning…</p>
                                        <p className="text-[10px] text-zinc-500 mt-1">Hold your phone steady</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="qr" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <QRCode />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Simulate scan button */}
                        {!done && (
                            <motion.button
                                onClick={handleSimulateScan}
                                disabled={scanning}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-3 px-6 py-3 bg-white text-black rounded-2xl font-bold text-sm hover:bg-zinc-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:opacity-60 disabled:pointer-events-none"
                            >
                                <Scan size={18} />
                                {scanning ? "Scanning…" : "Simulate Scan"}
                                {!scanning && <ChevronRight size={16} />}
                            </motion.button>
                        )}

                        {/* Connection status */}
                        <div className="flex items-center gap-2 text-zinc-700">
                            <Wifi size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Waiting for connection</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
