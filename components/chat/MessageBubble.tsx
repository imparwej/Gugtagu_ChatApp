"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck, Reply, Trash2 } from "lucide-react";
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
    const { id, text, type, timestamp, status, replyTo } = msg;
    const isSent = type === "sent";
    const [isHovered, setIsHovered] = useState(false);
    const { setReplyingTo, deleteMessage } = useChatStore();

    return (
        <motion.div
            initial={isSent ? { x: 20, opacity: 0 } : { x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex flex-col ${isSent ? "items-end" : "items-start"} mb-4 relative group`}
        >
            {/* Action Buttons (Reply/Delete) */}
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
                className={`max-w-[80%] md:max-w-[70%] rounded-2xl text-sm leading-relaxed overflow-hidden shadow-lg transition-all duration-300 ${isSent
                        ? "bg-zinc-800 text-white border border-white/5"
                        : "bg-white/5 backdrop-blur-xl border border-white/10 text-zinc-100"
                    } ${isHovered ? "ring-1 ring-white/10" : ""}`}
            >
                {/* Reply Context */}
                {replyTo && (
                    <div className={`p-2 mb-1 border-l-2 border-white/20 bg-white/5 text-[11px] opacity-70`}>
                        <p className="font-bold mb-0.5">{replyTo.senderId === "me" ? "Me" : "Them"}</p>
                        <p className="truncate">{replyTo.text}</p>
                    </div>
                )}

                <div className="p-3.5">
                    <p>{text}</p>
                </div>
            </div>

            <div className={`flex items-center gap-1.5 mt-1 px-1 ${isSent ? "flex-row" : "flex-row-reverse"}`}>
                <span className="text-[10px] text-zinc-500 font-medium tracking-tight">{timestamp}</span>
                {isSent && (
                    <span className="text-zinc-500">
                        {status === "sent" ? (
                            <Check size={12} />
                        ) : (
                            <CheckCheck
                                size={12}
                                className={status === "read" ? "text-zinc-300" : "text-zinc-500"}
                            />
                        )}
                    </span>
                )}
            </div>
        </motion.div>
    );
};
