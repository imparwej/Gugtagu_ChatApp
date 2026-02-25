"use client";

import React, { useEffect, useRef } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { useChatStore } from "../../store/chatStore";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Shield, Lock } from "lucide-react";

const TypingIndicator = () => (
    <div className="flex gap-1 px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl w-fit">
        {[0, 1, 2].map((i) => (
            <motion.div
                key={i}
                animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                className="w-1.5 h-1.5 bg-white/50 rounded-full"
            />
        ))}
    </div>
);

export const ChatWindow = () => {
    const { messages, activeChatId, typingUsers, inChatSearch, chatSearchQuery, chats } = useChatStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    const activeMessages = messages.filter((m) => m.chatId === activeChatId);
    const isTyping = activeChatId && typingUsers.includes(activeChatId);

    // Filter + highlight when in-chat search is active
    const displayMessages = inChatSearch && chatSearchQuery
        ? activeMessages.filter(m => m.text?.toLowerCase().includes(chatSearchQuery.toLowerCase()))
        : activeMessages;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [displayMessages.length, isTyping, activeChatId]);

    if (!activeChatId) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-black text-center p-8">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-sm">
                    <div className="w-20 h-20 rounded-[2rem] bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-6 mx-auto shadow-2xl">
                        <Globe size={32} className="text-white/20" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight mb-2 text-white">Guftagu Web</h2>
                    <p className="text-zinc-600 text-sm font-light leading-relaxed mb-6">
                        Select a conversation from the sidebar to start messaging.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em]">
                        <Lock size={9} /> End-to-End Encrypted
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-black relative">
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
            />

            <ChatHeader />

            {/* Search match count */}
            <AnimatePresence>
                {inChatSearch && chatSearchQuery && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 py-2 bg-white/[0.03] border-b border-white/[0.04] text-[10px] text-zinc-500 font-bold uppercase tracking-widest"
                    >
                        {displayMessages.length} result{displayMessages.length !== 1 ? "s" : ""} for "{chatSearchQuery}"
                    </motion.div>
                )}
            </AnimatePresence>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scrollbar relative">
                <div className="max-w-3xl mx-auto flex flex-col gap-1">
                    <AnimatePresence>
                        {displayMessages.map((msg) => (
                            <MessageBubble key={msg.id} msg={msg} searchQuery={chatSearchQuery} />
                        ))}
                    </AnimatePresence>
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            className="mt-2"
                        >
                            <TypingIndicator />
                        </motion.div>
                    )}
                </div>
            </div>

            <MessageInput />
        </div>
    );
};
