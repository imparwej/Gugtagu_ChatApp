"use client";

import React, { useState, useRef, useEffect } from "react";
import { Smile, Paperclip, Send, X, Mic, StopCircle, Camera } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { motion, AnimatePresence } from "framer-motion";
import { AttachmentMenu } from "./AttachmentMenu";
import { CameraUI } from "./CameraUI";

export const MessageInput = () => {
    const [text, setText] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        sendMessage,
        replyingTo,
        setReplyingTo,
        activeOverlay,
        setOverlay
    } = useChatStore();

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
            sendMessage("", isImage ? "image" : "file", {
                contentUrl: url,
                fileName: file.name
            });
            setOverlay("none");
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

    return (
        <div className="p-6 bg-black border-t border-white/5 relative z-30">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

            <div className="max-w-4xl mx-auto flex flex-col gap-4">
                {/* Overlays */}
                <AnimatePresence>
                    {activeOverlay === "attachment" && (
                        <AttachmentMenu
                            onSelect={(type) => {
                                if (type === "camera") setOverlay("camera");
                                else if (type === "document" || type === "gallery") fileInputRef.current?.click();
                                else {
                                    sendMessage(`Shared ${type}`, "text");
                                    setOverlay("none");
                                }
                            }}
                        />
                    )}
                    {activeOverlay === "camera" && (
                        <CameraUI
                            onCapture={(img) => {
                                sendMessage("", "image", { contentUrl: img });
                                setOverlay("none");
                            }}
                            onClose={() => setOverlay("none")}
                        />
                    )}
                </AnimatePresence>

                {/* Reply Preview */}
                <AnimatePresence>
                    {replyingTo && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between backdrop-blur-3xl shadow-2xl"
                        >
                            <div className="flex-1 min-w-0 pr-8">
                                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1 block">Replying to {replyingTo.senderId === 'me' ? 'Me' : 'Contact'}</span>
                                <p className="text-xs text-zinc-500 truncate italic">"{replyingTo.text || `[${replyingTo.type}]`}"</p>
                            </div>
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="p-2 hover:bg-white/10 rounded-xl transition-all text-zinc-500 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-white/5 border border-white/5 p-1 rounded-2xl">
                        <button
                            onClick={() => setOverlay(activeOverlay === "emoji" ? "none" : "emoji")}
                            className={`p-2.5 rounded-xl transition-all ${activeOverlay === "emoji" ? "bg-white text-black" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
                        >
                            <Smile size={20} strokeWidth={2} />
                        </button>
                        <button
                            onClick={() => setOverlay(activeOverlay === "attachment" ? "none" : "attachment")}
                            className={`p-2.5 rounded-xl transition-all ${activeOverlay === "attachment" ? "bg-white text-black" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
                        >
                            <Paperclip size={20} strokeWidth={2} />
                        </button>
                        <button
                            onClick={() => setOverlay("camera")}
                            className="p-2.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <Camera size={20} strokeWidth={2} />
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
                                    className="w-full bg-white/5 border border-white/20 rounded-2xl py-3 px-6 flex items-center justify-between backdrop-blur-3xl"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                        <span className="text-xs font-black uppercase tracking-[0.2em] text-white/90">Recording</span>
                                        <span className="text-xs text-zinc-500 font-mono font-bold tracking-tighter">0:{recordingTime.toString().padStart(2, '0')}</span>
                                    </div>
                                    <button
                                        onClick={() => setIsRecording(false)}
                                        className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="input"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="relative flex items-center"
                                >
                                    <input
                                        type="text"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                        placeholder="Type a message..."
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 px-6 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/10 focus:bg-white/10 transition-all font-medium"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-2">
                        <AnimatePresence mode="wait">
                            {isRecording ? (
                                <motion.button
                                    key="stop"
                                    onClick={stopRecording}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-3.5 bg-white text-black rounded-2xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                >
                                    <StopCircle size={24} fill="black" />
                                </motion.button>
                            ) : (
                                <div className="flex items-center">
                                    {!text.trim() ? (
                                        <motion.button
                                            key="mic"
                                            onClick={() => setIsRecording(true)}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-3.5 bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
                                        >
                                            <Mic size={24} strokeWidth={2} />
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            key="send"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            onClick={handleSend}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-3.5 bg-white text-black rounded-2xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                        >
                                            <Send size={22} fill="black" />
                                        </motion.button>
                                    )}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
