"use client";

import React from "react";
import { CircleDashed } from "lucide-react";
import { motion } from "framer-motion";

export const StatusView = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-black text-center p-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md">
                <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 mx-auto shadow-2xl relative group">
                    <CircleDashed size={44} className="text-white/20 group-hover:text-white/40 transition-colors" />
                </div>
                <h2 className="text-4xl font-black tracking-tighter mb-4 text-white">Status Updates</h2>
                <p className="text-zinc-500 text-sm font-light leading-relaxed">
                    Select a contact to view their status update. Status updates disappear after 24 hours.
                </p>
            </motion.div>
        </div>
    );
};
