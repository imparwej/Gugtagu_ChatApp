"use client";

import React from "react";
import { Phone, Video, MoreVertical } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

export const ChatHeader = () => {
    const { chats, activeChatId } = useChatStore();
    const activeChat = chats.find((c) => c.id === activeChatId);

    if (!activeChat) return null;

    return (
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-[#000000] border-b border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden">
                        <img
                            src={activeChat.avatar}
                            alt={activeChat.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {activeChat.online && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-white border-2 border-black rounded-full"></div>
                    )}
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-white leading-tight">
                        {activeChat.name}
                    </h2>
                    <p className="text-[11px] text-zinc-500">
                        {activeChat.online ? "Online" : "Offline"}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
                    <Phone size={18} />
                </button>
                <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
                    <Video size={18} />
                </button>
                <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
                    <MoreVertical size={18} />
                </button>
            </div>
        </div>
    );
};
