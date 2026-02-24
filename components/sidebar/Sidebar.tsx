"use client";

import React from "react";
import { Search, Settings, Bell } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { motion, AnimatePresence } from "framer-motion";

export const Sidebar = () => {
    const {
        chats,
        activeChatId,
        setActiveChat,
        notificationCount,
        toggleNotificationCenter
    } = useChatStore();

    return (
        <div className="flex flex-col h-full bg-[#0f0f0f]/80 backdrop-blur-xl text-white overflow-hidden border-r border-white/10 shadow-2xl">
            {/* Top Profile Section */}
            <div className="p-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10 shadow-lg">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Profile"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="font-semibold text-sm tracking-tight text-white/90">Me</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={toggleNotificationCenter}
                        className="p-2 hover:bg-white/10 rounded-2xl transition-all duration-300 relative group"
                    >
                        <Bell size={20} className="text-zinc-400 group-hover:text-white" />
                        {notificationCount > 0 && (
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                            />
                        )}
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-2xl transition-all duration-300">
                        <Settings size={20} className="text-zinc-400 hover:text-white" />
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="p-4">
                <div className="relative group">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors duration-300"
                    />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-300 placeholder:text-zinc-600"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-2 custom-scrollbar">
                <AnimatePresence>
                    {chats.map((chat) => (
                        <motion.div
                            key={chat.id}
                            onClick={() => setActiveChat(chat.id)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 group relative ${activeChatId === chat.id
                                ? "bg-white/10 border border-white/10 shadow-xl"
                                : "bg-transparent border border-transparent hover:bg-white/5"
                                }`}
                        >
                            {/* Avatar with wrap for online indicator */}
                            <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 overflow-hidden shadow-md">
                                    <img
                                        src={chat.avatar}
                                        alt={chat.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {chat.online && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white border-2 border-[#0f0f0f] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                                )}
                            </div>

                            {/* Chat Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h3 className="font-semibold text-sm truncate text-white/90 tracking-tight">{chat.name}</h3>
                                    <span className="text-[10px] text-zinc-500 font-medium">{chat.timestamp}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-zinc-500 truncate pr-2 font-light">
                                        {chat.lastMessage}
                                    </p>
                                    {chat.unreadCount > 0 && (
                                        <motion.span
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="flex-shrink-0 min-w-[18px] h-[18px] bg-white text-[#000000] text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                                        >
                                            {chat.unreadCount}
                                        </motion.span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
