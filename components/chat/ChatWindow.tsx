"use client";

import React, { useEffect, useRef } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { useChatStore } from "../../store/chatStore";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Shield, Lock } from "lucide-react";

const TypingIndicator = () => (
    <div className="flex gap-1 p-3 bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-2xl w-fit">
        {[0, 1, 2].map((i) => (
            <motion.div
                key={i}
                animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                className="w-1 h-1 bg-white rounded-full"
            />
        ))}
    </div>
);

export const ChatWindow = () => {
    const { messages, activeChatId, typingUsers } = useChatStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    const activeMessages = messages.filter((m) => m.chatId === activeChatId);
    const isTyping = activeChatId && typingUsers.includes(activeChatId);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [activeMessages.length, isTyping, activeChatId]);

    if (!activeChatId) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-black text-center p-8">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 mx-auto shadow-2xl relative group">
                        <Globe size={40} className="text-white/20" />
                        <Shield size={16} className="absolute -bottom-1 -right-1 text-white/10" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight mb-3 text-white">Guftagu Web</h2>
                    <p className="text-zinc-500 text-sm font-light leading-relaxed mb-8">
                        Select a conversation to start messaging. All chats are secured with end-to-end encryption.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em]">
                        <Lock size={10} /> Secure Connection
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-black relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-repeat" />

            <ChatHeader />

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar relative"
            >
                <div className="max-w-3xl mx-auto flex flex-col">
                    {activeMessages.map((msg) => (
                        <MessageBubble key={msg.id} msg={msg} />
                    ))}
                    {isTyping && (
                        <div className="mt-4 text-left">
                            <TypingIndicator />
                        </div>
                    )}
                </div>
            </div>

            <MessageInput />
        </div>
    );
};
