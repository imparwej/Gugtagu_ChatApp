"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Shield, X } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    contactName: string;
}

export const EncryptionModal = ({ isOpen, onClose, contactName }: Props) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/70 backdrop-blur-xl"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    className="relative z-10 w-full max-w-sm bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-7 pt-7 pb-0">
                        <div className="w-8 h-8" />
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                            <Lock size={28} className="text-white" />
                        </div>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-500 hover:text-white transition-all">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-6 text-center">
                        <h3 className="text-lg font-black tracking-tight mb-2">End-to-End Encrypted</h3>
                        <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                            Messages and calls between you and{" "}
                            <span className="text-white font-semibold">{contactName}</span>{" "}
                            are secured with end-to-end encryption. Nobody else can read or listen — not even Guftagu.
                        </p>
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4 text-left">
                            {[
                                ["Military-grade AES-256", "Your messages are encrypted before they leave your device."],
                                ["Zero knowledge", "Guftagu servers never see your message content."],
                                ["Perfect forward secrecy", "Every session uses a unique encryption key."]
                            ].map(([title, desc]) => (
                                <div key={title} className="flex items-start gap-3">
                                    <Shield size={14} className="text-white/30 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-white/80">{title}</p>
                                        <p className="text-[10px] text-zinc-600 font-light mt-0.5">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="px-8 pb-8">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-white text-black rounded-2xl font-bold text-sm hover:bg-zinc-100 transition-all"
                        >
                            Got it
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);
