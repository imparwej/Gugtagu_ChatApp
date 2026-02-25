"use client";

import React from "react";
import { motion } from "framer-motion";
import { Pin, Archive, Bell, Trash2, Star, CheckCircle } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

interface Props {
    chatId: string;
    x: number;
    y: number;
    onClose: () => void;
}

export const ChatContextMenu = ({ chatId, x, y, onClose }: Props) => {
    const { togglePin, toggleArchive, toggleMute, clearChat, deleteChat, chats } = useChatStore();

    const chat = chats.find(c => c.id === chatId);
    if (!chat) return null;

    // Clamp to viewport
    const menuWidth = 200;
    const menuHeight = 280;
    const clampedX = Math.min(x, window.innerWidth - menuWidth - 8);
    const clampedY = Math.min(y, window.innerHeight - menuHeight - 8);

    const items = [
        {
            icon: Pin,
            label: chat.isPinned ? "Unpin Chat" : "Pin Chat",
            action: () => { togglePin(chatId); onClose(); }
        },
        {
            icon: Archive,
            label: chat.isArchived ? "Unarchive" : "Archive",
            action: () => { toggleArchive(chatId); onClose(); }
        },
        {
            icon: Bell,
            label: chat.isMuted ? "Unmute" : "Mute Notifications",
            action: () => { toggleMute(chatId); onClose(); }
        },
        {
            icon: Star,
            label: "Starred Messages",
            action: () => onClose()
        },
        {
            icon: CheckCircle,
            label: "Mark as Read",
            action: () => onClose()
        },
        {
            icon: Trash2,
            label: "Delete Chat",
            danger: true,
            action: () => { deleteChat(chatId); onClose(); }
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ duration: 0.15 }}
            style={{ position: "fixed", left: clampedX, top: clampedY, zIndex: 9999 }}
            className="w-[200px] bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            onClick={e => e.stopPropagation()}
        >
            {items.map((item, i) => (
                <button
                    key={i}
                    onClick={item.action}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all hover:bg-white/5 ${item.danger ? "text-red-400 hover:text-red-300" : "text-zinc-300 hover:text-white"
                        } ${i < items.length - 1 ? "border-b border-white/[0.04]" : ""}`}
                >
                    <item.icon size={14} />
                    <span className="font-medium">{item.label}</span>
                </button>
            ))}
        </motion.div>
    );
};
