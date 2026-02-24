"use client";

import React from "react";
import { Phone } from "lucide-react";
import { motion } from "framer-motion";

export const CallsView = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-black text-center p-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md">
                <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 mx-auto shadow-2xl relative group">
                    <Phone size={44} className="text-white/20 group-hover:text-white/40 transition-colors" />
                </div>
                <h2 className="text-4xl font-black tracking-tighter mb-4 text-white">Calls</h2>
                <p className="text-zinc-500 text-sm font-light leading-relaxed">
                    Make secure high-fidelity voice and video calls. All calls are end-to-end encrypted.
                </p>
            </motion.div>
        </div>
    );
};
