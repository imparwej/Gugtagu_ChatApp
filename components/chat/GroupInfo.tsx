"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, LogOut, Bell, Shield, Info, MoreHorizontal, User } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

export const GroupInfo = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { chats, activeChatId } = useChatStore();
    const group = chats.find(c => c.id === activeChatId);

    if (!group || !group.isGroup) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[350] flex items-center justify-end">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ x: 400 }}
                        animate={{ x: 0 }}
                        exit={{ x: 400 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-sm h-full bg-[#0f0f0f] border-l border-white/10 shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-zinc-900/50">
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all"><X size={20} /></button>
                            <h2 className="text-xl font-bold tracking-tight">Group Info</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {/* Group Profile */}
                            <div className="p-8 flex flex-col items-center text-center bg-gradient-to-b from-zinc-900/50 to-transparent">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-800 border-2 border-white/10 overflow-hidden mb-6 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                                    <img src={group.avatar} alt="" className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight mb-2">{group.name}</h3>
                                <p className="text-xs text-zinc-500 font-medium uppercase tracking-[0.2em] mb-4">Group • {group.members?.length || 0} Members</p>

                                <div className="flex gap-4">
                                    <button className="flex flex-col items-center gap-1.5 p-3 hover:bg-white/5 rounded-2xl transition-all">
                                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white"><Bell size={20} /></div>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Mute</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-1.5 p-3 hover:bg-white/5 rounded-2xl transition-all">
                                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white"><UserPlus size={20} /></div>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Add</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-1.5 p-3 hover:bg-white/5 rounded-2xl transition-all">
                                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white"><LogOut size={20} /></div>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Exit</span>
                                    </button>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="p-6 space-y-8">
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-4">Description</h4>
                                    <div className="p-4 bg-white/5 rounded-2xl text-sm text-zinc-400 font-light leading-relaxed">
                                        Engineering & Design collaboration group for Project Alpha. All resources and timelines are pinned in the chat.
                                    </div>
                                </div>

                                {/* Members List */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center ml-4 px-1">
                                        <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{group.members?.length || 0} Members</h4>
                                        <button className="text-[10px] font-bold text-white hover:underline transition-all">View All</button>
                                    </div>
                                    <div className="space-y-1">
                                        {group.members?.map((member) => (
                                            <div key={member.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-all group cursor-pointer">
                                                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/5 overflow-hidden">
                                                    <img src={member.avatar} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-white/90 truncate">{member.name}</p>
                                                    <p className="text-[10px] text-zinc-600 font-light truncate">{member.status || 'Available'}</p>
                                                </div>
                                                {group.admins?.includes(member.id) && (
                                                    <span className="text-[8px] border border-white/10 px-1.5 py-0.5 rounded text-zinc-500 font-black tracking-tighter uppercase group-hover:text-white transition-colors">Admin</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/5 bg-zinc-900/30">
                            <button className="w-full py-4 text-red-500/80 hover:text-red-500 text-xs font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-red-500/5 rounded-2xl transition-all">
                                <LogOut size={16} /> Exit Group
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
