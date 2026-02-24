"use client";

import React from "react";
import { useChatStore } from "../../store/chatStore";
import { motion, AnimatePresence } from "framer-motion";
import { Settings as SettingsIcon } from "lucide-react";

export const SettingsView = () => {
    const { activeSettingsSubpage } = useChatStore();

    if (activeSettingsSubpage === "none") {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-black text-center p-8">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 mx-auto shadow-2xl">
                        <SettingsIcon size={44} className="text-white/20" />
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter mb-4 text-white">Settings</h2>
                    <p className="text-zinc-500 text-sm font-light leading-relaxed">
                        Manage your profile, account security, privacy, and application appearance.
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-black overflow-hidden p-12">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSettingsSubpage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="max-w-3xl mx-auto w-full"
                >
                    <header className="mb-12">
                        <h1 className="text-5xl font-black tracking-tighter capitalize border-b border-white/10 pb-8">{activeSettingsSubpage}</h1>
                    </header>

                    <div className="space-y-12">
                        {/* Placeholder for settings content */}
                        <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem]">
                            <h3 className="text-xl font-bold mb-4 tracking-tight">System Configuration</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                                Detailed settings for {activeSettingsSubpage} will be implemented here. This is part of the modular architecture.
                            </p>
                            <div className="w-full h-[1px] bg-white/5 mb-8" />
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div>
                                    <p className="font-bold text-white/90 group-hover:text-white transition-colors">Placeholder Setting Option</p>
                                    <p className="text-xs text-zinc-600 mt-1">A description of what this setting does</p>
                                </div>
                                <div className="w-12 h-6 bg-zinc-800 rounded-full relative">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white/20 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
