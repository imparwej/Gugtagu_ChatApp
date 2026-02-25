"use client";

import React from "react";
import { useChatStore } from "../../store/chatStore";
import { motion, AnimatePresence } from "framer-motion";
import { Settings as SettingsIcon, ChevronLeft } from "lucide-react";

import { ProfileSettings } from "./subpages/ProfileSettings";
import { AccountSettings } from "./subpages/AccountSettings";
import { PrivacySettings } from "./subpages/PrivacySettings";
import { ChatsSettings } from "./subpages/ChatsSettings";
import { NotificationsSettings } from "./subpages/NotificationsSettings";
import { StorageSettings } from "./subpages/StorageSettings";

export const SettingsView = () => {
    const { activeSettingsSubpage, setSettingsSubpage } = useChatStore();

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

    const renderSubpage = () => {
        switch (activeSettingsSubpage) {
            case "profile": return <ProfileSettings />;
            case "account": return <AccountSettings />;
            case "privacy": return <PrivacySettings />;
            case "chats": return <ChatsSettings />;
            case "notifications": return <NotificationsSettings />;
            case "storage": return <StorageSettings />;
            default: return null;
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-black overflow-hidden py-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSettingsSubpage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className="flex flex-col h-full max-w-4xl mx-auto w-full px-6 md:px-12"
                >
                    <header className="flex items-center gap-6 mb-8 mt-2">
                        <button
                            onClick={() => setSettingsSubpage("none")}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all group"
                        >
                            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <h1 className="text-4xl font-black tracking-tighter capitalize">
                            {activeSettingsSubpage === "storage" ? "Storage & Data" : activeSettingsSubpage}
                        </h1>
                    </header>

                    <div className="flex-1 overflow-hidden">
                        {renderSubpage()}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
