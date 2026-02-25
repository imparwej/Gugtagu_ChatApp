"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, UserMinus, UserPlus, LogOut, Users, Info, ChevronRight } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

interface GroupInfoProps {
    isOpen: boolean;
    onClose: () => void;
}

export const GroupInfo = ({ isOpen, onClose }: GroupInfoProps) => {
    const { chats, activeChatId, removeGroupMember, addGroupMember, exitGroup } = useChatStore();
    const [showAddMember, setShowAddMember] = useState(false);
    const [newMemberName, setNewMemberName] = useState("");
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    const chat = chats.find(c => c.id === activeChatId);
    if (!chat || !chat.isGroup) return null;

    const isAdmin = chat.admins?.includes("me");

    const handleAddMember = () => {
        if (!newMemberName.trim() || !activeChatId) return;
        addGroupMember(activeChatId, {
            id: `u_${Date.now()}`,
            name: newMemberName.trim(),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newMemberName}`,
            status: "Guftagu user",
            online: false,
        });
        setNewMemberName("");
        setShowAddMember(false);
    };

    const handleExit = () => {
        if (activeChatId) exitGroup(activeChatId);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 bottom-0 w-[360px] bg-[#0a0a0a] border-l border-white/[0.06] z-[110] flex flex-col shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] bg-black/50">
                            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-xl text-zinc-500 hover:text-white transition-all">
                                <X size={18} />
                            </button>
                            <h3 className="font-bold text-base tracking-tight">Group Info</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {/* Group avatar + name */}
                            <div className="flex flex-col items-center py-8 px-6 border-b border-white/[0.04]">
                                <div className="w-24 h-24 rounded-[2rem] bg-zinc-900 border-2 border-white/10 overflow-hidden shadow-2xl mb-4 grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer">
                                    <img src={chat.avatar} alt="" className="w-full h-full object-cover" />
                                </div>
                                <h2 className="text-xl font-black tracking-tight mb-1">{chat.name}</h2>
                                {chat.about && <p className="text-xs text-zinc-500 text-center font-light">{chat.about}</p>}
                                <div className="flex items-center gap-2 mt-3 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                    <Users size={10} />
                                    {chat.members?.length} members
                                </div>
                            </div>

                            {/* Description */}
                            <div className="px-5 py-4 border-b border-white/[0.04]">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                    <Info size={9} /> Group Description
                                </p>
                                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                                    {chat.about || "No description added."}
                                </p>
                            </div>

                            {/* Members */}
                            <div className="px-5 py-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                        Members ({chat.members?.length})
                                    </p>
                                    {isAdmin && (
                                        <button
                                            onClick={() => setShowAddMember(true)}
                                            className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 hover:text-white transition-colors"
                                        >
                                            <UserPlus size={12} /> Add
                                        </button>
                                    )}
                                </div>

                                {/* Add member form */}
                                <AnimatePresence>
                                    {showAddMember && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden mb-3"
                                        >
                                            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-3 py-2">
                                                <input
                                                    autoFocus
                                                    value={newMemberName}
                                                    onChange={e => setNewMemberName(e.target.value)}
                                                    onKeyDown={e => e.key === "Enter" && handleAddMember()}
                                                    placeholder="Enter name…"
                                                    className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-600 focus:outline-none"
                                                />
                                                <button onClick={handleAddMember} className="text-[10px] font-black text-white bg-white/10 px-2 py-1 rounded-lg hover:bg-white/20 transition-all">Add</button>
                                                <button onClick={() => setShowAddMember(false)} className="text-zinc-600 hover:text-white transition-colors"><X size={12} /></button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-1">
                                    {chat.members?.map(member => {
                                        const memberIsAdmin = chat.admins?.includes(member.id);
                                        return (
                                            <div
                                                key={member.id}
                                                className="flex items-center gap-3 p-3 hover:bg-white/[0.03] rounded-xl transition-all group"
                                            >
                                                <div className="relative">
                                                    <div className="w-10 h-10 rounded-[12px] bg-zinc-800 border border-white/5 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                                        <img src={member.avatar} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    {member.online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-white border-2 border-[#0a0a0a] rounded-full" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="text-sm font-semibold text-white/90 truncate">
                                                            {member.id === "me" ? "You" : member.name}
                                                        </p>
                                                        {memberIsAdmin && (
                                                            <span className="flex items-center gap-0.5 text-[8px] font-black text-white/40 bg-white/5 px-1.5 py-0.5 rounded uppercase tracking-widest">
                                                                <Crown size={7} /> Admin
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-zinc-600">{member.status || "Guftagu user"}</p>
                                                </div>
                                                {isAdmin && member.id !== "me" && (
                                                    <button
                                                        onClick={() => activeChatId && removeGroupMember(activeChatId, member.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 rounded-lg text-zinc-600 hover:text-red-400 transition-all"
                                                        title="Remove"
                                                    >
                                                        <UserMinus size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Exit group */}
                        <div className="p-5 border-t border-white/[0.06]">
                            {!showExitConfirm ? (
                                <button
                                    onClick={() => setShowExitConfirm(true)}
                                    className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 rounded-2xl text-red-400 hover:text-red-300 transition-all text-sm font-bold"
                                >
                                    <LogOut size={16} />
                                    Exit Group
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-3 bg-white/5 rounded-2xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/10 transition-all">Cancel</button>
                                    <button onClick={handleExit} className="flex-1 py-3 bg-red-500/20 border border-red-500/20 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/30 transition-all">Confirm Exit</button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
