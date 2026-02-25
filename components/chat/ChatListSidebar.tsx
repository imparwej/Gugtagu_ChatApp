"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Plus, Pin, Archive, Star, Filter, MoreVertical } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { motion, AnimatePresence } from "framer-motion";
import { ChatContextMenu } from "@/components/chat/ChatContextMenu";
import { Logo } from "../Logo";
import { NewChatModal } from "./NewChatModal";

type FilterTab = "all" | "unread" | "groups";

export const ChatListSidebar = () => {
    const { chats, activeChatId, setActiveChat, unreadCounts, messages } = useChatStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
    const [contextMenu, setContextMenu] = useState<{ chatId: string; x: number; y: number } | null>(null);
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

    const filtered = chats.filter(c => {
        if (c.isArchived) return false;
        if (!c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (activeFilter === "unread") return (unreadCounts[c.id] || 0) > 0;
        if (activeFilter === "groups") return !!c.isGroup;
        return true;
    });

    const pinned = filtered.filter(c => c.isPinned);
    const other = filtered.filter(c => !c.isPinned);
    const archivedCount = chats.filter(c => c.isArchived).length;
    const starredCount = messages.filter(m => m.isStarred).length;

    const handleContextMenu = (e: React.MouseEvent, chatId: string) => {
        e.preventDefault();
        setContextMenu({ chatId, x: e.clientX, y: e.clientY });
    };

    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    const renderCard = (chat: typeof chats[0]) => {
        const unread = unreadCounts[chat.id] || 0;
        const isActive = activeChatId === chat.id;

        return (
            <motion.div
                key={chat.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                onClick={() => setActiveChat(chat.id)}
                onContextMenu={(e) => handleContextMenu(e, chat.id)}
                whileTap={{ scale: 0.985 }}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 group border ${isActive
                    ? "bg-white/8 border-white/8 shadow-lg"
                    : "border-transparent hover:bg-white/[0.04] hover:border-white/[0.04]"
                    }`}
            >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-[14px] bg-zinc-900 border border-white/5 overflow-hidden transition-all duration-500 ${isActive ? "grayscale-0" : "grayscale-[0.4] group-hover:grayscale-0"}`}>
                        <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                    </div>
                    {chat.online && !chat.isGroup && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white border-2 border-[#0a0a0a] rounded-full shadow-sm" />
                    )}
                    {chat.isMuted && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-zinc-800 border border-white/10 rounded-full flex items-center justify-center">
                            <span className="text-[7px]">🔕</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className={`font-semibold text-sm truncate tracking-tight transition-colors ${isActive ? "text-white" : "text-white/80 group-hover:text-white"}`}>
                            {chat.name}
                        </h3>
                        <span className={`text-[10px] whitespace-nowrap ml-2 font-medium ${unread > 0 ? "text-white/60" : "text-zinc-600"}`}>
                            {chat.timestamp}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-zinc-500 truncate pr-2 font-light">{chat.lastMessage}</p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                            {chat.isPinned && !unread && <Pin size={10} className="text-zinc-700 rotate-45" />}
                            {unread > 0 && (
                                <span className={`min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black px-1 ${chat.isMuted ? "bg-white/10 text-zinc-400" : "bg-white text-black"}`}>
                                    {unread > 99 ? "99+" : unread}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] relative">
            <NewChatModal isOpen={isNewChatModalOpen} onClose={() => setIsNewChatModalOpen(false)} />

            {/* Context Menu */}
            <AnimatePresence>
                {contextMenu && (
                    <ChatContextMenu
                        chatId={contextMenu.chatId}
                        x={contextMenu.x}
                        y={contextMenu.y}
                        onClose={() => setContextMenu(null)}
                    />
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="px-5 pt-6 pb-3 flex flex-col gap-4">
                <Logo size={32} />
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-black tracking-tight">Chats</h2>
                    <button
                        onClick={() => setIsNewChatModalOpen(true)}
                        className="p-2 hover:bg-white/5 rounded-xl transition-all text-zinc-500 hover:text-white"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="px-4 pb-2">
                <div className="relative group/search">
                    <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/search:text-white/60 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.04] rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/10 focus:bg-white/[0.06] transition-all"
                    />
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1.5 px-4 pb-3">
                {(["all", "unread", "groups"] as FilterTab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveFilter(tab)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeFilter === tab
                            ? "bg-white text-black"
                            : "bg-white/5 text-zinc-500 hover:bg-white/8 hover:text-zinc-300"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Quick links - Archived/Starred */}
            <div className="px-4 pb-2 flex gap-2">
                {archivedCount > 0 && (
                    <button className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.06] rounded-xl transition-all group">
                        <Archive size={12} className="text-zinc-600 group-hover:text-white" />
                        <span className="text-[10px] font-bold text-zinc-500 group-hover:text-white transition-colors">Archived</span>
                        <span className="ml-auto text-[9px] bg-white/8 px-1.5 py-0.5 rounded font-bold text-zinc-500">{archivedCount}</span>
                    </button>
                )}
                <button className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.06] rounded-xl transition-all group">
                    <Star size={12} className="text-zinc-600 group-hover:text-white" />
                    <span className="text-[10px] font-bold text-zinc-500 group-hover:text-white transition-colors">Starred</span>
                    {starredCount > 0 && <span className="ml-auto text-[9px] bg-white/8 px-1.5 py-0.5 rounded font-bold text-zinc-500 font-mono">{starredCount}</span>}
                </button>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar pb-4">
                <AnimatePresence>
                    {pinned.length > 0 && (
                        <div key="pinned-section" className="mb-1">
                            <div className="px-3 py-2 flex items-center gap-1.5 text-[9px] font-black text-zinc-700 uppercase tracking-[0.18em]">
                                <Pin size={9} className="rotate-45" /> Pinned
                            </div>
                            {pinned.map(renderCard)}
                            {other.length > 0 && <div className="h-px bg-white/[0.03] mx-3 my-2" />}
                        </div>
                    )}
                    {pinned.length > 0 && other.length > 0 && (
                        <div key="all-chats-header" className="px-3 py-1 text-[9px] font-black text-zinc-700 uppercase tracking-[0.18em]">All Chats</div>
                    )}
                    {other.map(renderCard)}
                    {filtered.length === 0 && (
                        <motion.div
                            key="no-chats-empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-16 text-center"
                        >
                            <Search size={28} className="text-zinc-800 mb-3" />
                            <p className="text-xs text-zinc-600 font-medium">No chats found</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
