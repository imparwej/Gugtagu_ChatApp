"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck, Reply, Trash2, FileText, Download, Play, Pause, User } from "lucide-react";
import { Message } from "../../types/chat";
import { useChatStore } from "../../store/chatStore";

export const TypingIndicator = () => {
    return (
        <div className="flex gap-1 p-3 bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl w-fit">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                    }}
                    className="w-1.5 h-1.5 bg-white rounded-full"
                />
            ))}
        </div>
    );
};

interface MessageBubbleProps {
    msg: Message;
}

export const MessageBubble = ({ msg }: MessageBubbleProps) => {
    const { id, text, type, timestamp, status, replyTo, contentUrl, fileName, duration, senderName, senderId } = msg;
    const isSent = senderId === "me";
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const { setReplyingTo, deleteMessage, chats, activeChatId } = useChatStore();

    const activeChat = chats.find(c => c.id === activeChatId);
    const isGroup = activeChat?.isGroup;
    const isAdmin = activeChat?.admins?.includes(senderId);

    const renderContent = () => {
        switch (type) {
            case "image":
                return (
                    <div className="relative group/img overflow-hidden rounded-xl">
                        <img src={contentUrl} alt="Sent image" className="max-w-full max-h-60 object-cover cursor-pointer hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <Download size={20} className="text-white" />
                        </div>
                    </div>
                );
            case "file":
                return (
                    <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <FileText size={20} className="text-white/80" />
                        </div>
                        <div className="flex flex-col min-w-0 pr-4">
                            <span className="text-xs font-medium truncate text-white/90">{fileName}</span>
                            <span className="text-[10px] text-zinc-500">Document</span>
                        </div>
                        <button className="p-1.5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-all">
                            <Download size={14} />
                        </button>
                    </div>
                );
            case "voice":
                return (
                    <div className="flex items-center gap-3 min-w-[160px]">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-10 h-10 flex-shrink-0 bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-white/80 hover:bg-white/20 transition-all"
                        >
                            {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-0.5" />}
                        </button>
                        <div className="flex-1 flex flex-col gap-1">
                            {/* Fake Waveform */}
                            <div className="flex items-end gap-[2px] h-3">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={isPlaying ? { height: [4, Math.random() * 12 + 4, 4] } : { height: 4 }}
                                        transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
                                        className={`w-[3px] rounded-full ${isPlaying && Math.random() > 0.5 ? "bg-white" : "bg-white/20"}`}
                                    />
                                ))}
                            </div>
                            <span className="text-[9px] text-zinc-500 font-mono">0:{duration?.toString().padStart(2, '0')}</span>
                        </div>
                    </div>
                );
            default:
                return <p className="leading-relaxed whitespace-pre-wrap">{text}</p>;
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
            {/* Sender Name (Groups Only) */}
            {isGroup && !isSent && (
                <div className="flex items-center gap-1.5 mb-1 ml-1">
                    <span className="text-[10px] font-bold text-zinc-400 tracking-tight uppercase">{senderName || "Unknown"}</span>
                    {isAdmin && <span className="text-[8px] bg-white/10 border border-white/10 px-1.5 py-0.5 rounded text-white font-bold tracking-tighter uppercase">Admin</span>}
                </div>
            )}

            {/* Action Buttons */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`absolute z-10 top-0 ${isSent ? "-left-20" : "-right-20"} flex items-center gap-1 bg-zinc-900/80 backdrop-blur-md border border-white/10 p-1 rounded-xl shadow-xl`}
                    >
                        <button
                            onClick={() => setReplyingTo(msg)}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                            title="Reply"
                        >
                            <Reply size={14} />
                        </button>
                        <button
                            onClick={() => deleteMessage(id)}
                            className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-zinc-400 hover:text-red-400"
                            title="Delete"
                        >
                            <Trash2 size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                className={`max-w-full rounded-[1.5rem] text-sm leading-relaxed overflow-hidden shadow-2xl transition-all duration-500 ${isSent
                        ? "bg-zinc-800 text-white border border-white/5"
                        : "bg-white/5 backdrop-blur-3xl border border-white/10 text-zinc-100"
                    } ${isHovered ? "ring-1 ring-white/10 scale-[1.01]" : ""}`}
            >
                {/* Reply Context */}
                {replyTo && (
                    <div
                        className={`p-2.5 mb-1 border-l-2 border-white/20 bg-white/5 cursor-pointer hover:bg-white/10 transition-all`}
                        onClick={() => {
                            const el = document.getElementById(replyTo.id);
                            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                    >
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Replying to {replyTo.senderId === "me" ? "Me" : "Them"}</p>
                        <p className="text-xs truncate text-zinc-400">{replyTo.text || `[${replyTo.type}]`}</p>
                    </div>
                )}

                <div className={`${type === 'text' ? 'p-3.5 px-4' : 'p-2'}`}>
                    {renderContent()}
                </div>
            </div>

            <div id={id} className={`flex items-center gap-1.5 mt-1.5 px-1.5 ${isSent ? "flex-row" : "flex-row-reverse"}`}>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight">{timestamp}</span>
                {isSent && (
                    <div className="flex items-center">
                        {status === "sent" ? (
                            <Check size={12} className="text-zinc-600" />
                        ) : (
                            <CheckCheck
                                size={12}
                                className={status === "read" ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "text-zinc-500"}
                            />
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
