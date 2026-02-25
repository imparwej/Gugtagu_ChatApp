"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export const CallsView = () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-black p-8 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-sm">
            <div className="w-20 h-20 rounded-[2rem] bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-6 mx-auto shadow-2xl">
                <Phone size={32} className="text-white/20" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-2">Call History</h2>
            <p className="text-zinc-600 text-sm font-light leading-relaxed">
                Select a call from the sidebar to view details, or tap the phone icon to call back.
            </p>
        </motion.div>
    </div>
);
