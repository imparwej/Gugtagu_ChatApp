"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Camera, Image as ImageIcon, Headphones, MapPin, User, X } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

interface AttachmentMenuProps {
    onSelect: (type: string) => void;
}

export const AttachmentMenu = ({ onSelect }: AttachmentMenuProps) => {
    const { setOverlay } = useChatStore();

    const items = [
        { id: "document", icon: FileText, label: "Document", color: "hover:bg-blue-500/20 hover:border-blue-500/20" },
        { id: "camera", icon: Camera, label: "Camera", color: "hover:bg-zinc-500/20 hover:border-zinc-500/20" },
        { id: "gallery", icon: ImageIcon, label: "Gallery", color: "hover:bg-purple-500/20 hover:border-purple-500/20" },
        { id: "audio", icon: Headphones, label: "Audio", color: "hover:bg-green-500/20 hover:border-green-500/20" },
        { id: "location", icon: MapPin, label: "Location", color: "hover:bg-red-500/20 hover:border-red-500/20" },
        { id: "contact", icon: User, label: "Contact", color: "hover:bg-yellow-500/20 hover:border-yellow-500/20" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full left-0 mb-2 bg-[#111]/95 backdrop-blur-2xl border border-white/10 p-5 rounded-[2rem] shadow-2xl z-50 w-[240px]"
        >
            {/* Close */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Share</span>
                <button onClick={() => setOverlay("none")} className="p-1 hover:bg-white/10 rounded-lg text-zinc-600 hover:text-white transition-all">
                    <X size={12} />
                </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className={`flex flex-col items-center gap-2 p-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl group transition-all duration-300 ${item.color} hover:scale-105 active:scale-95`}
                    >
                        <item.icon size={22} strokeWidth={1.5} className="text-zinc-400 group-hover:text-white transition-colors" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-white transition-colors">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </motion.div>
    );
};
