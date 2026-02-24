"use client";

import React, { useState } from "react";
import { Phone, Video, Search, MoreVertical } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { GroupInfo } from "./GroupInfo";
import { motion, AnimatePresence } from "framer-motion";

export const ChatHeader = () => {
    const { chats, activeChatId } = useChatStore();
    const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);

    const activeChat = chats.find((c) => c.id === activeChatId);

    if (!activeChat) return null;

    return (
        <div className="sticky top-0 z-30 flex items-center justify-between px-8 py-5 bg-black/80 border-b border-white/5 backdrop-blur-3xl shadow-2xl">
            <GroupInfo isOpen={isGroupInfoOpen} onClose={() => setIsGroupInfoOpen(false)} />

            <div
                className="flex items-center gap-4 cursor-pointer group"
                onClick={() => activeChat.isGroup && setIsGroupInfoOpen(true)}
            >
                <div className="relative">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 overflow-hidden shadow-lg grayscale group-hover:grayscale-0 transition-all duration-500"
                    >
                        <img
                            src={activeChat.avatar}
                            alt={activeChat.name}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                    {activeChat.online && !activeChat.isGroup && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white border-2 border-black rounded-full shadow-lg"></div>
                    )}
                </div>
                <div className="flex flex-col">
                    <h2 className="text-base font-bold text-white/90 leading-tight group-hover:text-white transition-colors">
                        {activeChat.name}
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                        {activeChat.isGroup ? `${activeChat.members?.length} members` : (activeChat.online ? "Online" : "Last seen recently")}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <button className="p-3 text-zinc-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all" title="Video Call">
                    <Video size={20} />
                </button>
                <button className="p-3 text-zinc-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all" title="Voice Call">
                    <Phone size={20} />
                </button>
                <div className="w-[1px] h-6 bg-white/5 mx-2" />
                <button className="p-3 text-zinc-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all" title="Search">
                    <Search size={20} />
                </button>
                <button className="p-3 text-zinc-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all" title="More Options">
                    <MoreVertical size={20} />
                </button>
            </div>
        </div>
    );
};
