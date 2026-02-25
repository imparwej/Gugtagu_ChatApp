"use client";

import React, { useState } from "react";
import { Search, Plus, Pin, Archive, MoreVertical, Phone, CircleDashed } from "lucide-react";
import { Story } from "../../types/chat";
import { useChatStore } from "../../store/chatStore";
import { motion, AnimatePresence } from "framer-motion";
import { StatusStories } from "../status/StatusStories";
import { StatusCircles } from "../status/StatusCircles";
import { CallModal } from "../calls/CallModal";
import { SettingsModule } from "../settings/SettingsModule";

export const Sidebar = () => {
    const {
        chats,
        activeChatId,
        setActiveChat,
        activeSection,
        calls,
        currentUser,
        stories
    } = useChatStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCall, setSelectedCall] = useState<any>(null);
    const [viewingUserId, setViewingUserId] = useState<string | null>(null);

    const filteredChats = chats.filter(c =>
        !c.isArchived &&
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pinnedChats = filteredChats.filter(c => c.isPinned);
    const otherChats = filteredChats.filter(c => !c.isPinned);
    const archivedCount = chats.filter(c => c.isArchived).length;

    const renderChats = () => (
        <div className="flex flex-col h-full bg-[#0f0f0f]">
            <div className="p-6 pb-4 flex items-center justify-between">
                <h2 className="text-3xl font-black tracking-tighter">Chats</h2>
                <div className="flex items-center gap-1">
                    <button className="p-2.5 hover:bg-white/5 rounded-xl transition-all"><Plus size={20} className="text-zinc-400" /></button>
                    <button className="p-2.5 hover:bg-white/5 rounded-xl transition-all"><MoreVertical size={20} className="text-zinc-400" /></button>
                </div>
            </div>

            <StatusCircles onSelectUser={(uid) => setViewingUserId(uid)} />

            <div className="px-6 py-4">
                <div className="relative group">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder="Search chats"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-[1.25rem] py-3.5 pl-11 pr-4 text-xs focus:outline-none focus:border-white/10 focus:bg-white/10 transition-all placeholder:text-zinc-700 font-medium"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
                {archivedCount > 0 && (
                    <div className="mx-3 my-2 px-4 py-3.5 flex items-center gap-4 bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer rounded-2xl transition-all group">
                        <Archive size={18} className="text-zinc-500 group-hover:text-white" />
                        <span className="text-sm font-bold tracking-tight flex-1">Archived Chats</span>
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-zinc-400 font-bold">{archivedCount}</span>
                    </div>
                )}

                {pinnedChats.length > 0 && (
                    <div className="mt-4">
                        <div className="px-4 mb-2 flex items-center gap-2 text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em]">
                            <Pin size={10} /> Pinned
                        </div>
                        {pinnedChats.map(renderChatCard)}
                    </div>
                )}

                <div className="mt-6 mb-8">
                    {pinnedChats.length > 0 && (
                        <div className="px-4 mb-2 text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em]">Recent Conversations</div>
                    )}
                    {otherChats.map(renderChatCard)}
                </div>
            </div>
        </div>
    );

    const renderChatCard = (chat: any) => (
        <motion.div
            key={chat.id}
            onClick={() => setActiveChat(chat.id)}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-4 p-4 rounded-[1.75rem] cursor-pointer transition-all duration-500 group border border-transparent ${activeChatId === chat.id ? "bg-white/10 border-white/5 shadow-2xl" : "hover:bg-white/5"
                }`}
        >
            <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden shadow-inner grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700">
                    <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                </div>
                {chat.online && !chat.isGroup && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white border-[3px] border-[#0f0f0f] rounded-full shadow-lg"></div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-sm truncate text-white/90 tracking-tight group-hover:text-white transition-colors">{chat.name}</h3>
                    <span className="text-[10px] text-zinc-600 font-medium whitespace-nowrap ml-2 italic">{chat.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-500 truncate font-light flex-1 pr-4">{chat.lastMessage}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {chat.isPinned && <Pin size={12} className="text-zinc-800 rotate-45" />}
                        {chat.unreadCount > 0 && (
                            <span className="min-w-[18px] h-[18px] bg-white text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-lg px-1.5">
                                {chat.unreadCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderCallsList = () => (
        <div className="flex flex-col h-full bg-[#0f0f0f] animate-in fade-in slide-in-from-right-8 duration-700">
            <CallModal isOpen={!!selectedCall} onClose={() => setSelectedCall(null)} call={selectedCall} />
            <div className="p-8 pb-4">
                <h2 className="text-4xl font-black tracking-tighter mb-8">Calls</h2>
                <div className="bg-white/5 border border-white/5 p-4 rounded-[1.5rem] flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shadow-2xl group-active:scale-95 transition-all">
                        <Phone size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white/90">Create call link</p>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Share with others</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 custom-scrollbar">
                <div className="px-4 mb-4 text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em]">Recent Logs</div>
                {calls.map((call) => (
                    <div
                        key={call.id}
                        onClick={() => setSelectedCall(call)}
                        className="flex items-center gap-5 p-4 hover:bg-white/5 rounded-[2rem] transition-all cursor-pointer group hover:scale-[1.02] active:scale-95"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden shadow-inner grayscale group-hover:grayscale-0 transition-all duration-1000">
                            <img src={call.userAvatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">{call.userName}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${call.status === 'missed' ? 'text-red-500' : 'text-zinc-600'}`}>
                                    {call.status} Call
                                </span>
                                <span className="text-[10px] text-zinc-800">• {call.timestamp}</span>
                            </div>
                        </div>
                        <div className="p-3 text-zinc-700 group-hover:text-white transition-colors">
                            <Phone size={20} className={call.type === 'video' ? 'hidden' : 'block'} />
                            <Phone size={20} className={call.type === 'video' ? 'block' : 'hidden'} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStatusList = () => {
        const userStatusGroups = (() => {
            const map = new Map<string, { stories: Story[], allViewed: boolean, userName: string, userAvatar: string, latestTimestamp: string }>();
            stories.forEach(s => {
                if (!map.has(s.userId)) {
                    map.set(s.userId, { stories: [], allViewed: true, userName: s.userName, userAvatar: s.userAvatar, latestTimestamp: s.timestamp });
                }
                const group = map.get(s.userId)!;
                group.stories.push(s);
                if (!s.viewed) group.allViewed = false;
                // Simple latest timestamp check
                if (s.timestamp > group.latestTimestamp) group.latestTimestamp = s.timestamp;
            });
            return Array.from(map.entries());
        })();

        return (
            <div className="flex flex-col h-full bg-[#0f0f0f] animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="p-8 pb-4">
                    <h2 className="text-4xl font-black tracking-tighter mb-8">Status</h2>
                    <div className="flex items-center gap-5 p-4 group cursor-pointer hover:bg-white/5 rounded-[2rem] transition-all">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-white/5 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                                <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-xl border-4 border-[#0f0f0f] flex items-center justify-center text-black">
                                <Plus size={14} strokeWidth={4} />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white/90">My Status</p>
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Add to your update</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 custom-scrollbar">
                    <div className="px-4 mb-4 text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em]">Recent Updates</div>
                    {userStatusGroups.length > 0 ? (
                        userStatusGroups.map(([userId, group]) => (
                            <div
                                key={userId}
                                onClick={() => setViewingUserId(userId)}
                                className="flex items-center gap-5 p-4 hover:bg-white/5 rounded-[2rem] transition-all cursor-pointer group hover:scale-[1.02] active:scale-95 border border-transparent hover:border-white/5"
                            >
                                <div className={`p-0.5 rounded-[1.4rem] ${group.allViewed ? 'border border-zinc-800' : 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.15)]'}`}>
                                    <div className={`w-14 h-14 rounded-2xl bg-zinc-900 overflow-hidden transition-all duration-700 ${group.allViewed ? 'grayscale opacity-60 group-hover:opacity-100' : 'grayscale group-hover:grayscale-0'}`}>
                                        <img src={group.userAvatar} alt={group.userName} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">{group.userName}</h4>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter mt-1">{group.latestTimestamp}</p>
                                </div>
                                {!group.allViewed && (
                                    <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-8 text-center">
                            <CircleDashed className="w-12 h-12 text-zinc-800 mx-auto mb-4 animate-spin-slow" />
                            <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">No updates found</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-[#0f0f0f] text-white overflow-hidden relative border-r border-white/10">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="h-full"
                >
                    {activeSection === "chats" && renderChats()}
                    {activeSection === "calls" && renderCallsList()}
                    {activeSection === "settings" && <div className="h-full bg-black"><SettingsModule /></div>}
                    {activeSection === "status" && renderStatusList()}
                </motion.div>
            </AnimatePresence>

            <StatusStories
                viewingUserId={viewingUserId}
                allStories={stories}
                onClose={() => setViewingUserId(null)}
            />
        </div>
    );
};
