"use client";

import React from "react";
import { NavigationSidebar } from "./NavigationSidebar";
import { useChatStore } from "../store/chatStore";
import { AnimatePresence, motion } from "framer-motion";

// Section List Views
import { ChatListSidebar } from "./chat/ChatListSidebar";
import { StatusSidebar } from "./status/StatusSidebar";
import { CallsSidebar } from "./calls/CallsSidebar";
import { SettingsSidebar } from "./settings/SettingsSidebar";

// Section Main Views
import { ChatWindow } from "./chat/ChatWindow";
import { StatusView } from "./status/StatusView";
import { CallsView } from "./calls/CallsView";
import { SettingsView } from "./settings/SettingsView";

export const MainLayout = () => {
    const { activeSection } = useChatStore();

    const renderSidebar = () => {
        switch (activeSection) {
            case "chats": return <ChatListSidebar />;
            case "status": return <StatusSidebar />;
            case "calls": return <CallsSidebar />;
            case "settings": return <SettingsSidebar />;
            default: return <ChatListSidebar />;
        }
    };

    const renderMainContent = () => {
        switch (activeSection) {
            case "chats": return <ChatWindow />;
            case "status": return <StatusView />;
            case "calls": return <CallsView />;
            case "settings": return <SettingsView />;
            default: return <ChatWindow />;
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-black text-white selection:bg-white selection:text-black">
            {/* Column 1: Navigation Bar */}
            <NavigationSidebar />

            {/* Column 2: Section Sidebar (List View) */}
            <aside className="w-[360px] border-r border-white/5 bg-[#0a0a0a] flex flex-col h-full relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col h-full overflow-hidden"
                    >
                        {renderSidebar()}
                    </motion.div>
                </AnimatePresence>
            </aside>

            {/* Column 3: Main Content Area */}
            <main className="flex-1 flex flex-col h-full bg-black relative z-0 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="flex-1 flex flex-col h-full overflow-hidden"
                    >
                        {renderMainContent()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};
