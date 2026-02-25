"use client";

import React, { useState, useRef } from "react";
import {
    Phone, Video, Search, MoreVertical, Lock, X, User, Image, LinkIcon,
    FileText, BellOff, Timer, Trash2, MessageSquareOff, ChevronRight
} from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { GroupInfo } from "./GroupInfo";
import { EncryptionModal } from "./EncryptionModal";
import { motion, AnimatePresence } from "framer-motion";

export const ChatHeader = () => {
    const {
        chats, activeChatId, setInChatSearch, inChatSearch, setChatSearchQuery, chatSearchQuery,
        toggleMute, toggleDisappearing, clearChat, deleteChat, startCall
    } = useChatStore();

    const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEncryptionOpen, setIsEncryptionOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const activeChat = chats.find((c) => c.id === activeChatId);
    if (!activeChat) return null;

    const menuItems = [
        { icon: User, label: "View Contact", action: () => { setIsGroupInfoOpen(true); setIsMenuOpen(false); } },
        { icon: Image, label: "Media, Links & Docs", action: () => setIsMenuOpen(false) },
        { icon: Search, label: "Search", action: () => { setInChatSearch(true); setIsMenuOpen(false); } },
        { icon: BellOff, label: activeChat.isMuted ? "Unmute Notifications" : "Mute Notifications", action: () => { activeChatId && toggleMute(activeChatId); setIsMenuOpen(false); } },
        { icon: Timer, label: activeChat.isDisappearing ? "Turn Off Disappearing" : "Disappearing Messages", action: () => { activeChatId && toggleDisappearing(activeChatId); setIsMenuOpen(false); } },
        { divider: true },
        { icon: Trash2, label: "Clear Chat", danger: true, action: () => { activeChatId && clearChat(activeChatId); setIsMenuOpen(false); } },
        { icon: MessageSquareOff, label: "Delete Chat", danger: true, action: () => { activeChatId && deleteChat(activeChatId); setIsMenuOpen(false); } },
    ];

    return (
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-black/90 border-b border-white/[0.05] backdrop-blur-3xl relative z-30">
            {/* GroupInfo side panel */}
            <GroupInfo isOpen={isGroupInfoOpen} onClose={() => setIsGroupInfoOpen(false)} />
            <EncryptionModal isOpen={isEncryptionOpen} onClose={() => setIsEncryptionOpen(false)} contactName={activeChat.name} />

            {/* Left: Avatar + Info */}
            <div
                className="flex items-center gap-3 cursor-pointer group min-w-0"
                onClick={() => activeChat.isGroup ? setIsGroupInfoOpen(true) : setIsEncryptionOpen(false)}
            >
                <div className="relative flex-shrink-0">
                    <motion.div
                        whileHover={{ scale: 1.04 }}
                        className="w-10 h-10 rounded-[12px] bg-zinc-800 border border-white/10 overflow-hidden shadow-md"
                    >
                        <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </motion.div>
                    {activeChat.online && !activeChat.isGroup && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white border-2 border-black rounded-full" />
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <h2 className="text-sm font-bold text-white/90 group-hover:text-white transition-colors truncate leading-tight tracking-tight">
                        {activeChat.name}
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider truncate">
                        {activeChat.isGroup
                            ? `${activeChat.members?.length} members`
                            : activeChat.online
                                ? "Online"
                                : "Last seen recently"}
                    </p>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
                {/* In-chat search bar */}
                <AnimatePresence>
                    {inChatSearch && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 200, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 mr-2 overflow-hidden"
                        >
                            <Search size={12} className="text-zinc-500 flex-shrink-0" />
                            <input
                                autoFocus
                                value={chatSearchQuery}
                                onChange={e => setChatSearchQuery(e.target.value)}
                                placeholder="Search in chat…"
                                className="bg-transparent text-xs text-white placeholder:text-zinc-600 focus:outline-none flex-1 min-w-0"
                            />
                            <button onClick={() => { setInChatSearch(false); setChatSearchQuery(""); }} className="text-zinc-600 hover:text-white transition-colors flex-shrink-0">
                                <X size={12} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* E2E lock */}
                <button
                    onClick={() => setIsEncryptionOpen(true)}
                    className="p-2 text-zinc-700 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    title="End-to-End Encrypted"
                >
                    <Lock size={16} />
                </button>

                <button
                    onClick={() => startCall({ name: activeChat.name, avatar: activeChat.avatar, type: "video" })}
                    className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    title="Video Call"
                >
                    <Video size={18} />
                </button>
                <button
                    onClick={() => startCall({ name: activeChat.name, avatar: activeChat.avatar, type: "voice" })}
                    className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    title="Voice Call"
                >
                    <Phone size={18} />
                </button>

                {!inChatSearch && (
                    <button
                        onClick={() => { setInChatSearch(true); }}
                        className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        title="Search"
                    >
                        <Search size={18} />
                    </button>
                )}

                {/* 3-dot menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`p-2 rounded-xl transition-all ${isMenuOpen ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
                        title="More Options"
                    >
                        <MoreVertical size={18} />
                    </button>

                    <AnimatePresence>
                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.92, y: -8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.92, y: -8 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-1 w-56 bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50"
                                >
                                    {menuItems.map((item, i) => {
                                        if ("divider" in item) {
                                            return <div key={i} className="h-px bg-white/[0.05] my-1" />;
                                        }
                                        return (
                                            <button
                                                key={i}
                                                onClick={item.action}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all hover:bg-white/5 ${item.danger ? "text-red-400 hover:text-red-300" : "text-zinc-300 hover:text-white"}`}
                                            >
                                                <item.icon size={14} />
                                                <span className="font-medium">{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
