"use client";

import React from "react";
import { motion } from "framer-motion";
import { CircleDashed, Plus } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

export const StatusView = () => {
    const { stories, currentUser } = useChatStore();
    const unviewed = stories.filter(s => !s.viewed);

    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-black p-8 text-center">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-sm"
            >
                <div className="w-20 h-20 rounded-[2rem] bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-6 mx-auto shadow-2xl">
                    <CircleDashed size={32} className="text-white/20" />
                </div>
                <h2 className="text-2xl font-black tracking-tight mb-2 text-white">Status Updates</h2>
                <p className="text-zinc-600 text-sm font-light leading-relaxed mb-6">
                    Select a status from the sidebar to view it. Share moments that disappear after 24 hours.
                </p>
                {unviewed.length > 0 && (
                    <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
                        {unviewed.length} unread update{unviewed.length !== 1 ? "s" : ""}
                    </p>
                )}
            </motion.div>
        </div>
    );
};
