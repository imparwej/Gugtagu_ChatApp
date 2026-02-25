"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check, CheckCheck, Reply, Trash2, FileText, Download,
    Play, Pause, MapPin, User, Video, ExternalLink, Share2, Mic, Star
} from "lucide-react";
import { Message } from "../../types/chat";
import { useChatStore } from "../../store/chatStore";

export const MessageBubble = ({ msg, searchQuery = "" }: { msg: Message; searchQuery?: string }) => {
    const { id, text, type, timestamp, status, replyTo, contentUrl, fileName, duration, senderName, senderId, location, contact, isStarred } = msg;
    const isSent = senderId === "me";
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const { setReplyingTo, deleteMessage, chats, activeChatId, toggleStarMessage } = useChatStore();

    const activeChat = chats.find(c => c.id === activeChatId);
    const isGroup = activeChat?.isGroup;
    const isAdmin = activeChat?.admins?.includes(senderId);

    const highlightText = (content: string, query: string) => {
        if (!query.trim()) return content;
        const parts = content.split(new RegExp(`(${query})`, "gi"));
        return (
            <>
                {parts.map((part, i) =>
                    part.toLowerCase() === query.toLowerCase() ? (
                        <mark key={i} className="search-match">{part}</mark>
                    ) : (
                        part
                    )
                )}
            </>
        );
    };

    const renderContent = () => {
        switch (type) {
            case "image":
                return (
                    <div className="relative group/img overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/5">
                        <img src={contentUrl} alt="Sent" className="max-w-full max-h-96 object-cover cursor-pointer hover:scale-105 transition-all duration-1000 grayscale hover:grayscale-0" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                            <Download size={24} className="text-white drop-shadow-2xl" />
                        </div>
                    </div>
                );
            case "video":
                return (
                    <div className="relative group/vid overflow-hidden rounded-[2rem] bg-zinc-900 aspect-video flex items-center justify-center border border-white/5">
                        <video src={contentUrl} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 transition-all duration-1000" />
                        <button className="absolute w-20 h-20 bg-white/5 backdrop-blur-2xl rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-white hover:text-black hover:scale-110 active:scale-95 transition-all duration-500 shadow-2xl">
                            <Play size={36} fill="currentColor" strokeWidth={1.5} />
                        </button>
                    </div>
                );
            case "file":
                return (
                    <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                        <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
                            <FileText size={24} className="text-zinc-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate text-white/90">{fileName || 'Document.pdf'}</p>
                            <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">PDF • 2.4 MB</p>
                        </div>
                        <button className="p-2 hover:bg-white/10 rounded-xl text-zinc-500 hover:text-white transition-all">
                            <Download size={18} />
                        </button>
                    </div>
                );
            case "voice":
                return (
                    <div className="flex items-center gap-6 min-w-[240px] p-2">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-14 h-14 flex-shrink-0 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 shadow-2xl"
                        >
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                        </button>
                        <div className="flex-1 space-y-3">
                            <div className="h-6 flex items-center gap-1.5">
                                {[...Array(28)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={isPlaying ? { height: [4, 16, 4] } : { height: 4 }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.04 }}
                                        className={`w-[2px] rounded-full ${i < 12 && isPlaying ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "bg-white/10"}`}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[10px] text-zinc-600 font-black tracking-widest font-mono">0:{duration?.toString().padStart(2, '0') || '0:00'}</span>
                                <Mic size={10} className="text-zinc-800" />
                            </div>
                        </div>
                    </div>
                );
            case "location":
                return (
                    <div className="w-full max-w-[280px] bg-zinc-900 rounded-xl overflow-hidden border border-white/10 group/loc cursor-pointer">
                        <div className="h-32 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/pin-s+white(12,12)/0,0,1,0/400x200@2x?access_token=mock')] bg-center bg-cover relative">
                            <div className="absolute inset-0 bg-white/5 group-hover/loc:bg-transparent transition-all" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <MapPin size={32} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                            </div>
                        </div>
                        <div className="p-3">
                            <p className="text-xs font-bold text-white/90 line-clamp-1">{location?.address || 'Current Location'}</p>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">Open in Maps</span>
                                <ExternalLink size={10} className="text-zinc-600" />
                            </div>
                        </div>
                    </div>
                );
            case "contact":
                return (
                    <div className="w-full max-w-[250px] bg-zinc-900 rounded-2xl p-4 border border-white/10 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-[1.25rem] bg-zinc-800 flex items-center justify-center text-zinc-500 border border-white/5">
                                <User size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white/90 truncate">{contact?.name || 'Contact Name'}</p>
                                <p className="text-[10px] text-zinc-500 font-mono">{contact?.phone || '+91 00000 00000'}</p>
                            </div>
                        </div>
                        <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all border border-transparent hover:border-white/5">
                            Message
                        </button>
                    </div>
                );
            default:
                return (
                    <p className="leading-relaxed whitespace-pre-wrap">
                        {highlightText(text || "", searchQuery)}
                    </p>
                );
        }
    };

    return (
        <motion.div
            initial={isSent ? { x: 20, opacity: 0 } : { x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex flex-col ${isSent ? "items-end ml-12" : "items-start mr-12"} mb-4 relative group`}
        >
            {isGroup && !isSent && (
                <div className="flex items-center gap-1.5 mb-1.5 ml-1 animate-in fade-in slide-in-from-left-2 duration-300">
                    <span className="text-[9px] font-black text-zinc-500 tracking-[0.1em] uppercase">{senderName || "Unknown"}</span>
                    {isAdmin && <span className="text-[7px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-white font-black tracking-widest uppercase">Admin</span>}
                </div>
            )}

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: isSent ? 20 : -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: isSent ? 20 : -20 }}
                        className={`absolute z-10 top-0 ${isSent ? "-left-20" : "-right-20"} flex items-center gap-1 bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-1.5 rounded-2xl shadow-2xl`}
                    >
                        <button onClick={() => setReplyingTo(msg)} className="p-2 hover:bg-white/10 rounded-xl transition-all text-zinc-500 hover:text-white" title="Reply"><Reply size={14} /></button>
                        <button onClick={() => toggleStarMessage(id)} className="p-2 hover:bg-white/10 rounded-xl transition-all text-zinc-500 hover:text-yellow-400" title="Star"><Star size={14} fill={isStarred ? "currentColor" : "none"} /></button>
                        <button onClick={() => deleteMessage(id)} className="p-2 hover:bg-white/10 rounded-xl transition-all text-zinc-500 hover:text-red-400" title="Delete"><Trash2 size={14} /></button>
                        <button className="p-2 hover:bg-white/10 rounded-xl transition-all text-zinc-500 hover:text-white" title="Share"><Share2 size={14} /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                className={`max-w-full rounded-[1.75rem] text-sm leading-relaxed overflow-hidden shadow-2xl transition-all duration-700 ${isSent
                    ? "bg-zinc-800 text-white border border-white/5 ring-0"
                    : "bg-white/5 backdrop-blur-3xl border border-white/10 text-zinc-100 ring-0"
                    } ${isHovered ? "border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.03)]" : ""} ${isStarred ? "border-yellow-500/30" : ""}`}
            >
                {replyTo && (
                    <div
                        className="p-3 mb-1 border-l-2 border-white/30 bg-white/5 cursor-pointer hover:bg-white/10 transition-all"
                        onClick={() => document.getElementById(replyTo.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    >
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Replying to {replyTo.senderId === "me" ? "Me" : "Them"}</p>
                        <p className="text-xs truncate text-zinc-500 font-light italic">"{replyTo.text || `[${replyTo.type}]`}"</p>
                    </div>
                )}

                <div className={`${type === 'text' ? 'p-4 px-5' : 'p-2'}`}>
                    {renderContent()}
                </div>
            </div>

            <div id={id} className={`flex items-center gap-2 mt-1.5 px-2 ${isSent ? "flex-row" : "flex-row-reverse"}`}>
                <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">{timestamp}</span>
                {isStarred && <Star size={8} className="text-yellow-500 flex-shrink-0" fill="currentColor" />}
                {isSent && (
                    <div className="flex items-center">
                        {status === "sent" ? (
                            <Check size={12} className="text-zinc-700" />
                        ) : (
                            <CheckCheck
                                size={12}
                                className={status === "read" ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,1)]" : "text-zinc-600"}
                            />
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
