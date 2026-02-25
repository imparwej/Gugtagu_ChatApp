"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Video, Maximize2, X } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

export const MinimizedCall = () => {
    const { activeCallTarget, isCallMinimized, setCallMinimized, endCall } = useChatStore();

    if (!activeCallTarget || !isCallMinimized) return null;

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-0 left-0 right-0 z-50 px-4 py-2"
        >
            <div className="bg-white text-black h-12 rounded-2xl flex items-center justify-between px-4 shadow-2xl border border-white/20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden grayscale">
                        <img src={activeCallTarget.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-[11px] font-black leading-none">{activeCallTarget.name}</p>
                        <p className="text-[9px] font-bold opacity-60 flex items-center gap-1 mt-0.5">
                            {activeCallTarget.type === "video" ? <Video size={10} /> : <Phone size={10} />}
                            Ongoing Call
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCallMinimized(false)}
                        className="p-2 hover:bg-black/10 rounded-xl transition-all"
                        title="Expand"
                    >
                        <Maximize2 size={16} />
                    </button>
                    <button
                        onClick={endCall}
                        className="p-2 hover:bg-red-500/10 text-red-600 rounded-xl transition-all"
                        title="End Call"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
