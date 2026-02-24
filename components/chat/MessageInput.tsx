"use client";

import React, { useState, useRef, useEffect } from "react";
import { Smile, Paperclip, Send, X, Braces, Mic, StopCircle, Image as ImageIcon, FileText } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_EMOJIS = ["😀", "😂", "😍", "🎉", "🔥", "👍", "❤️", "🤔", "🙌", "✨", "🚀", "💡"];

export const MessageInput = () => {
    const [text, setText] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const { sendMessage, replyingTo, setReplyingTo } = useChatStore();

    const handleSend = () => {
        if (text.trim()) {
            sendMessage(text.trim());
            setText("");
        }
    };

    const addEmoji = (emoji: string) => {
        setText(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const isImage = file.type.startsWith("image/");
            const url = URL.createObjectURL(file);

            sendMessage("", isImage ? "image" : "file", {
                contentUrl: url,
                fileName: file.name
            });
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRecording) {
            timer = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
        } else {
            setRecordingTime(0);
        }
        return () => clearInterval(timer);
    }, [isRecording]);

    const stopRecording = () => {
        setIsRecording(false);
        sendMessage("", "voice", { duration: recordingTime });
    };

    // Click outside emoji picker
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="sticky bottom-0 p-4 bg-[#000000] border-t border-white/5">
            <div className="max-w-6xl mx-auto flex flex-col gap-2">

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx"
                />

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

                {/* Emoji Picker */}
                <AnimatePresence>
                    {showEmojiPicker && (
                        <motion.div
                            ref={emojiPickerRef}
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute bottom-20 left-4 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 p-3 rounded-2xl shadow-2xl grid grid-cols-4 gap-2 z-50"
                        >
                            {MOCK_EMOJIS.map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={() => addEmoji(emoji)}
                                    className="text-2xl p-2 hover:bg-white/5 rounded-xl transition-all hover:scale-110 active:scale-90"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className={`p-2 transition-all duration-300 rounded-xl ${showEmojiPicker ? "text-white bg-white/10" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
                        >
                            <Smile size={20} />
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                        >
                            <Paperclip size={20} />
                        </button>
                    </div>

                    <div className="flex-1 relative">
                        <AnimatePresence mode="wait">
                            {isRecording ? (
                                <motion.div
                                    key="recording"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="w-full bg-zinc-900 border border-white/20 rounded-2xl py-3 px-4 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        <span className="text-sm font-medium text-white">Recording...</span>
                                        <span className="text-xs text-zinc-500 font-mono">0:{recordingTime.toString().padStart(2, '0')}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {/* Simplified Waveform Mock */}
                                        <div className="flex items-end gap-0.5 h-4">
                                            {[1, 2, 3, 2, 1, 2, 3, 2, 1].map((h, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ height: [h * 4, (h + 1) * 4, h * 4] }}
                                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                                    className="w-0.5 bg-white/40 rounded-full"
                                                />
                                            ))}
                                        </div>
                                        <button onClick={() => setIsRecording(false)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white">Cancel</button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.input
                                    key="input"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    placeholder={replyingTo ? "Type your reply..." : "Type a message..."}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/5 transition-all duration-300"
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-2">
                        <AnimatePresence mode="wait">
                            {isRecording ? (
                                <motion.button
                                    key="stop"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    onClick={stopRecording}
                                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg active:scale-95"
                                >
                                    <StopCircle size={20} />
                                </motion.button>
                            ) : (
                                <motion.button
                                    key="mic"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    onClick={() => setIsRecording(true)}
                                    className={`p-3 rounded-full transition-all shadow-lg active:scale-95 ${text.trim() ? "hidden" : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"}`}
                                >
                                    <Mic size={20} />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {text.trim() && (
                            <motion.button
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                onClick={handleSend}
                                className="p-3 bg-white text-black rounded-full hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 active:scale-95"
                            >
                                <Send size={18} fill="currentColor" />
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
