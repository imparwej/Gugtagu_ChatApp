"use client";

import React, { useState } from "react";
import { Search, Plus, Pin, Archive, MoreVertical } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { motion } from "framer-motion";

export const ChatListSidebar = () => {
    const {
        chats,
        activeChatId,
        setActiveChat,
        unreadCounts
    } = useChatStore();

    const [searchQuery, setSearchQuery] = useState("");

    const filteredChats = chats.filter(c =>
        !c.isArchived &&
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pinnedChats = filteredChats.filter(c => c.isPinned);
    const otherChats = filteredChats.filter(c => !c.isPinned);
    const archivedCount = chats.filter(c => c.isArchived).length;

    const renderChatCard = (chat: any) => (
        <motion.div
            key={chat.id}
            onClick={() => setActiveChat(chat.id)}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 group border border-transparent ${activeChatId === chat.id ? "bg-white/10 border-white/5 shadow-xl" : "hover:bg-white/5"
                }`}
        >
            <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 overflow-hidden grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500">
                    <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                </div>
                {chat.online && !chat.isGroup && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white border-[2.5px] border-[#0a0a0a] rounded-full"></div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                    <h3 className="font-bold text-sm truncate text-white/90 tracking-tight group-hover:text-white transition-colors">{chat.name}</h3>
                    <span className="text-[10px] text-zinc-500 font-medium whitespace-nowrap ml-2 italic">{chat.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-500 truncate font-light flex-1 pr-4">{chat.lastMessage}</p>
                    {chat.unreadCount > 0 && (
                        <span className="min-w-[18px] h-[18px] bg-white text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-lg px-1.5">
                            {chat.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a]">
            {/* Header */}
            <div className="p-6 pb-2 flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tighter">Chats</h2>
                <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-white/5 rounded-xl transition-all"><Plus size={20} className="text-zinc-400" /></button>
                    <button className="p-2 hover:bg-white/5 rounded-xl transition-all"><MoreVertical size={20} className="text-zinc-400" /></button>
                </div>
            </div>

            {/* Search */}
            <div className="p-4">
                <div className="relative group/search">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/search:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder="Search chats"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:border-white/10 focus:bg-white/10 transition-all placeholder:text-zinc-700"
                    />
                </div>
            </div>

            {/* Chat Lists */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar pb-8">
                {archivedCount > 0 && (
                    <div className="mx-2 my-2 px-4 py-3 flex items-center gap-4 bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer rounded-xl transition-all group">
                        <Archive size={16} className="text-zinc-500 group-hover:text-white" />
                        <span className="text-xs font-bold tracking-tight flex-1">Archived Chats</span>
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-zinc-400 font-bold">{archivedCount}</span>
                    </div>
                )}

                {pinnedChats.length > 0 && (
                    <div className="mt-2">
                        <div className="px-4 mb-2 flex items-center gap-2 text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em]">
                            <Pin size={10} className="rotate-45" /> Pinned
                        </div>
                        {pinnedChats.map(renderChatCard)}
                        <div className="h-4" />
                    </div>
                )}

                <div className="mt-2">
                    {pinnedChats.length > 0 && (
                        <div className="px-4 mb-2 text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em]">Recent Conversations</div>
                    )}
                    {otherChats.map(renderChatCard)}
                </div>
            </div>
        </div>
    );
};
