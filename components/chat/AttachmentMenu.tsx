"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Camera, Image as ImageIcon, Headset, MapPin, User } from "lucide-react";

interface AttachmentMenuProps {
    onSelect: (type: string) => void;
}

export const AttachmentMenu = ({ onSelect }: AttachmentMenuProps) => {
    const items = [
        { id: 'document', icon: FileText, label: 'Document' },
        { id: 'camera', icon: Camera, label: 'Camera' },
        { id: 'gallery', icon: ImageIcon, label: 'Gallery' },
        { id: 'audio', icon: Headset, label: 'Audio' },
        { id: 'location', icon: MapPin, label: 'Location' },
        { id: 'contact', icon: User, label: 'Contact' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-28 left-0 bg-[#111111]/90 backdrop-blur-3xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl z-50 grid grid-cols-3 gap-8"
        >
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    className="flex flex-col items-center gap-3 group"
                >
                    <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-xl group-hover:scale-110 active:scale-95">
                        <item.icon size={28} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                        {item.label}
                    </span>
                </button>
            ))}
        </motion.div>
    );
};
