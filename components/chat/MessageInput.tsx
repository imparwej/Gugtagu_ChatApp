"use client";

import React, { useState } from "react";
import { Smile, Paperclip, Send, X, Braces } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { motion, AnimatePresence } from "framer-motion";

export const MessageInput = () => {
    const [text, setText] = useState("");
    const { sendMessage, replyingTo, setReplyingTo } = useChatStore();

    const handleSend = () => {
        if (text.trim()) {
            sendMessage(text.trim());
            setText("");
        }
    };

    return (
        <div className="sticky bottom-0 p-4 bg-[#000000] border-t border-white/5">
            <div className="max-w-6xl mx-auto flex flex-col gap-2">

                {/* Reply Preview */}
                <AnimatePresence>
                    {replyingTo && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex items-center justify-between shadow-2xl"
                        >
                            <div className="flex flex-col min-w-0 pr-4">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 flex items-center gap-1">
                                    Replying to <Braces size={10} />
                                </span>
                                <p className="text-xs text-zinc-500 truncate italic">
                                    "{replyingTo.text}"
                                </p>
                            </div>
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="p-1.5 hover:bg-white/10 rounded-xl transition-all text-zinc-500 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <button className="p-2 text-zinc-500 hover:text-white transition-all duration-300">
                            <Smile size={20} />
                        </button>
                        <button className="p-2 text-zinc-500 hover:text-white transition-all duration-300">
                            <Paperclip size={20} />
                        </button>
                    </div>

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSend()}
                            placeholder={replyingTo ? "Type your reply..." : "Type a message..."}
                            className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/5 transition-all duration-300"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSend}
                        className="p-3 bg-white text-black rounded-full hover:bg-zinc-200 transition-all shadow-lg shadow-white/5"
                    >
                        <Send size={18} fill="currentColor" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
