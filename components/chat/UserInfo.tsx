"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, BellOff, Timer, Trash2, MessageSquareOff, ChevronRight,
    Search, Image, User, Shield, Info, Star, Ban, Lock,
    MessageSquare, Phone, Video, FileText
} from "lucide-react";
import { useChatStore } from "../../store/chatStore";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

export const UserInfo = ({ isOpen, onClose, userId }: Props) => {
    const {
        chats, users, messages, toggleMute, toggleDisappearing,
        clearChat, deleteChat, blockUser, blockedUsers, unblockUser
    } = useChatStore();

    // Find the chat and the corresponding user
    const chat = chats.find(c => c.id === userId);
    const user = users.find(u => u.id === userId);

    // Fallback if chat/user not found (e.g. if it's a group, this component shouldn't be used, or usage is different)
    if (!chat || chat.isGroup) return null;

    // Use user data if available, fallback to chat data
    const displayName = user?.name || chat.name;
    const displayAvatar = user?.avatar || chat.avatar;
    const displayAbout = user?.about || chat.about || "Hey there! I am using Guftagu.";
    const displayPhone = user?.phone || "+91 98765 43210";
    const joinedDate = chat.joinedAt || "Jan 1, 2026";

    const isBlocked = blockedUsers.includes(chat.id);

    // Calculate Media, Links & Docs
    const mediaMessages = messages.filter(m =>
        m.chatId === userId && (m.type === "image" || m.type === "video" || m.type === "file")
    );

    // Calculate Starred Messages count
    const starredCount = messages.filter(m => m.chatId === userId && m.isStarred).length;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 35 }}
                        className="fixed right-0 top-0 h-full w-[380px] bg-[#0a0a0a] border-l border-white/10 z-[101] flex flex-col shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 h-16 border-b border-white/5 flex items-center gap-4 bg-black/50 backdrop-blur-md">
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all">
                                <X size={20} />
                            </button>
                            <h2 className="font-black tracking-tight text-white/90 uppercase text-xs tracking-[0.2em]">Contact Info</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
                            {/* Profile Section */}
                            <div className="flex flex-col items-center pt-10 pb-8 px-6 bg-gradient-to-b from-white/[0.02] to-transparent">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-2 border-white/10 shadow-2xl mb-6 grayscale hover:grayscale-0 transition-all duration-700"
                                >
                                    <img src={displayAvatar} alt="" className="w-full h-full object-cover" />
                                </motion.div>
                                <h3 className="text-2xl font-black tracking-tighter text-white mb-2 text-center">{displayName}</h3>
                                <p className="text-sm text-zinc-500 font-medium mb-6">
                                    {chat.online ? "Online" : "Last seen recently"}
                                </p>

                                <div className="flex gap-4">
                                    <button className="flex flex-col items-center gap-2 group">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-black transition-all">
                                            <MessageSquare size={18} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Message</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-2 group">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-black transition-all">
                                            <Video size={18} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Video</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-2 group">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-black transition-all">
                                            <Phone size={18} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Audio</span>
                                    </button>
                                </div>
                            </div>

                            <div className="h-2 bg-black w-full" />

                            {/* About & Phone */}
                            <div className="p-6 space-y-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">About</p>
                                    <p className="text-sm text-white/80 font-medium leading-relaxed italic">
                                        {displayAbout}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Phone</p>
                                    <p className="text-sm text-white/80 font-black tracking-tight">{displayPhone}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Joined</p>
                                    <p className="text-sm text-white/60 font-medium">{joinedDate}</p>
                                </div>
                            </div>

                            <div className="h-px bg-white/5 mx-6" />

                            {/* Media Section */}
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                                        <Image size={12} />
                                        <span>Media, Links & Docs</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                                        {mediaMessages.length} <ChevronRight size={14} className="text-zinc-700" />
                                    </div>
                                </div>
                                {mediaMessages.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-2">
                                        {mediaMessages.slice(0, 3).map((msg) => (
                                            <div key={msg.id} className="aspect-square bg-white/5 rounded-xl border border-white/5 overflow-hidden hover:opacity-80 transition-opacity cursor-pointer grayscale hover:grayscale-0">
                                                {msg.type === "image" ? (
                                                    <img src={msg.contentUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                        <FileText size={20} className="text-zinc-600" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest text-center py-4 bg-white/[0.02] rounded-xl border border-dashed border-white/5">
                                        No media shared yet
                                    </p>
                                )}
                            </div>

                            <div className="h-2 bg-black w-full" />

                            {/* Options */}
                            <div className="py-2">
                                <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-all text-white/80 group">
                                    <div className="flex items-center gap-4">
                                        <Star size={18} className="text-zinc-600 group-hover:text-white transition-colors" />
                                        <span className="text-sm font-bold">Starred Messages</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {starredCount > 0 && <span className="text-[10px] font-black bg-white/10 text-white/40 px-2 py-0.5 rounded-full">{starredCount}</span>}
                                        <ChevronRight size={14} className="text-zinc-700" />
                                    </div>
                                </button>
                                <button
                                    onClick={() => toggleMute(chat.id)}
                                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-all text-white/80"
                                >
                                    <div className="flex items-center gap-4">
                                        <BellOff size={18} className="text-zinc-600" />
                                        <span className="text-sm font-bold">Mute Notifications</span>
                                    </div>
                                    <div className={`w-8 h-4 rounded-full relative transition-colors ${chat.isMuted ? "bg-white" : "bg-white/10"}`}>
                                        <div className={`absolute top-1 w-2 h-2 rounded-full transition-all ${chat.isMuted ? "right-1 bg-black" : "left-1 bg-zinc-600"}`} />
                                    </div>
                                </button>
                                <button
                                    onClick={() => toggleDisappearing(chat.id)}
                                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-all text-white/80"
                                >
                                    <div className="flex items-center gap-4">
                                        <Timer size={18} className="text-zinc-600" />
                                        <span className="text-sm font-bold">Disappearing Messages</span>
                                    </div>
                                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">{chat.isDisappearing ? "On" : "Off"}</span>
                                </button>
                            </div>

                            <div className="h-2 bg-black w-full" />

                            {/* Danger Zone */}
                            <div className="py-2">
                                <button
                                    onClick={() => { if (confirm("Clear chat?")) clearChat(chat.id); }}
                                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-red-500/10 text-red-500/80 hover:text-red-500 transition-all"
                                >
                                    <Trash2 size={18} />
                                    <span className="text-sm font-bold">Clear Chat</span>
                                </button>
                                <button
                                    onClick={() => isBlocked ? unblockUser(chat.id) : blockUser(chat.id)}
                                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-red-500/10 text-red-500/80 hover:text-red-500 transition-all font-bold"
                                >
                                    <Ban size={18} />
                                    <span className="text-sm font-bold">{isBlocked ? "Unblock Contact" : "Block Contact"}</span>
                                </button>
                                <button
                                    onClick={() => { if (confirm("Delete chat?")) deleteChat(chat.id); onClose(); }}
                                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-red-500/10 text-red-500/80 hover:text-red-500 transition-all font-bold"
                                >
                                    <MessageSquareOff size={18} />
                                    <span className="text-sm font-bold">Delete Chat</span>
                                </button>
                            </div>

                            <div className="p-8 text-center bg-black/50">
                                <div className="flex items-center justify-center gap-2 text-[8px] font-black text-zinc-800 uppercase tracking-[0.4em]">
                                    <Lock size={8} /> End-to-End Encrypted
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
