"use client";

import React, { useState, useRef, useEffect } from "react";
import { Smile, Paperclip, Send, X, Mic, StopCircle, Camera } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { motion, AnimatePresence } from "framer-motion";
import { AttachmentMenu } from "./AttachmentMenu";
import { CameraUI } from "./CameraUI";
import { EmojiPicker } from "./EmojiPicker";

export const MessageInput = () => {
    const [text, setText] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { sendMessage, replyingTo, setReplyingTo, activeOverlay, setOverlay, chatSettings } = useChatStore();

    const handleSend = () => {
        if (text.trim()) {
            sendMessage(text.trim());
            setText("");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const isImage = file.type.startsWith("image/");
            const url = URL.createObjectURL(file);
            sendMessage("", isImage ? "image" : "file", { contentUrl: url, fileName: file.name });
            setOverlay("none");
        }
        e.target.value = "";
    };

    const handleEmojiSelect = (emoji: string) => {
        setText(prev => prev + emoji);
        inputRef.current?.focus();
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (chatSettings.enterToSend && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        }
    };

    return (
        <div className="flex-shrink-0 border-t border-white/[0.05] bg-black relative z-20">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,application/*" />

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex flex-col gap-3">

                {/* Camera Overlay */}
                <AnimatePresence>
                    {activeOverlay === "camera" && (
                        <CameraUI
                            onCapture={(img) => { sendMessage("", "image", { contentUrl: img }); setOverlay("none"); }}
                            onClose={() => setOverlay("none")}
                        />
                    )}
                </AnimatePresence>

                {/* Reply Preview */}
                <AnimatePresence>
                    {replyingTo && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="flex items-center justify-between bg-white/[0.04] border border-white/[0.06] px-4 py-3 rounded-2xl"
                        >
                            <div className="flex items-start gap-3 min-w-0">
                                <div className="w-0.5 h-8 bg-white/40 rounded-full flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-wide mb-0.5">
                                        Replying to {replyingTo.senderId === "me" ? "yourself" : replyingTo.senderName || "Contact"}
                                    </p>
                                    <p className="text-xs text-zinc-500 truncate italic font-light">
                                        {replyingTo.text || `[${replyingTo.type}]`}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setReplyingTo(null)} className="p-1.5 hover:bg-white/10 rounded-lg ml-3 text-zinc-600 hover:text-white transition-all flex-shrink-0">
                                <X size={14} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-3">
                    {/* Left action buttons + attachment/emoji overlays */}
                    <div className="relative flex items-center gap-1 flex-shrink-0">
                        {/* Emoji Picker */}
                        <AnimatePresence>
                            {activeOverlay === "emoji" && (
                                <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setOverlay("none")} />
                            )}
                        </AnimatePresence>

                        {/* Attachment Menu */}
                        <AnimatePresence>
                            {activeOverlay === "attachment" && (
                                <AttachmentMenu
                                    onSelect={(type) => {
                                        if (type === "camera") setOverlay("camera");
                                        else if (type === "document" || type === "gallery") {
                                            fileInputRef.current?.click();
                                            setOverlay("none");
                                        } else if (type === "location") {
                                            sendMessage("", "location", { location: { lat: 28.6139, lng: 77.2090, address: "India Gate, New Delhi" } });
                                            setOverlay("none");
                                        } else if (type === "contact") {
                                            sendMessage("", "contact", { contact: { name: "Vikram Seth", phone: "+91 99887 76655" } });
                                            setOverlay("none");
                                        } else {
                                            sendMessage(`Shared ${type}`, "text");
                                            setOverlay("none");
                                        }
                                    }}
                                />
                            )}
                        </AnimatePresence>

                        <button
                            onClick={() => setOverlay(activeOverlay === "emoji" ? "none" : "emoji")}
                            className={`p-2.5 rounded-xl transition-all ${activeOverlay === "emoji" ? "bg-white text-black" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
                        >
                            <Smile size={20} strokeWidth={1.8} />
                        </button>
                        <button
                            onClick={() => setOverlay(activeOverlay === "attachment" ? "none" : "attachment")}
                            className={`p-2.5 rounded-xl transition-all ${activeOverlay === "attachment" ? "bg-white text-black" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
                        >
                            <Paperclip size={20} strokeWidth={1.8} />
                        </button>
                        <button
                            onClick={() => setOverlay("camera")}
                            className="p-2.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <Camera size={20} strokeWidth={1.8} />
                        </button>
                    </div>

                    {/* Text input */}
                    <div className="flex-1 relative">
                        <AnimatePresence mode="wait">
                            {isRecording ? (
                                <motion.div
                                    key="recording"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full bg-white/[0.04] border border-white/20 rounded-2xl py-3 px-5 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-white/80">Recording</span>
                                        <span className="text-xs text-zinc-500 font-mono">
                                            0:{recordingTime.toString().padStart(2, "0")}
                                        </span>
                                    </div>
                                    <button onClick={() => setIsRecording(false)} className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
                                        Cancel
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.input
                                    key="input"
                                    ref={inputRef}
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Message"
                                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl py-3 px-5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/10 focus:bg-white/[0.06] transition-all font-light"
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Send / mic button */}
                    <AnimatePresence mode="wait">
                        {isRecording ? (
                            <motion.button
                                key="stop"
                                onClick={stopRecording}
                                whileTap={{ scale: 0.9 }}
                                className="p-3.5 bg-white text-black rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-105 transition-all flex-shrink-0"
                            >
                                <StopCircle size={22} fill="black" />
                            </motion.button>
                        ) : text.trim() ? (
                            <motion.button
                                key="send"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                onClick={handleSend}
                                whileTap={{ scale: 0.9 }}
                                className="p-3.5 bg-white text-black rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-105 transition-all flex-shrink-0"
                            >
                                <Send size={20} fill="black" />
                            </motion.button>
                        ) : (
                            <motion.button
                                key="mic"
                                onClick={() => setIsRecording(true)}
                                whileTap={{ scale: 0.9 }}
                                className="p-3.5 bg-white/[0.04] text-zinc-500 hover:text-white hover:bg-white/10 rounded-2xl transition-all flex-shrink-0"
                            >
                                <Mic size={22} strokeWidth={1.8} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
