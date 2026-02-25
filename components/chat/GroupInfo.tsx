"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, UserMinus, UserPlus, LogOut, Users, Info, ChevronRight, FileText } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

interface GroupInfoProps {
    isOpen: boolean;
    onClose: () => void;
}

export const GroupInfo = ({ isOpen, onClose }: GroupInfoProps) => {
    const {
        chats, activeChatId, messages, groups, users,
        removeGroupMember, addGroupMember, exitGroup
    } = useChatStore();
    const [showAddMember, setShowAddMember] = useState(false);
    const [newMemberName, setNewMemberName] = useState("");
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    // Find the chat and the corresponding group data
    const chat = chats.find(c => c.id === activeChatId);
    const group = groups.find(g => g.id === activeChatId);

    if (!chat || !chat.isGroup) return null;

    const isAdmin = chat.admins?.includes("me");

    // Resolve members: if group.members (string IDs) exists, map them to User objects. 
    // Otherwise fallback to chat.members (User objects).
    const resolvedMembers = group
        ? group.members.map(id => users.find(u => u.id === id)).filter(Boolean) as any[]
        : chat.members || [];

    const createdDate = group?.createdAt || "Feb 1, 2026";

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

    // Calculate Media, Links & Docs
    const mediaMessages = messages.filter(m =>
        m.chatId === activeChatId && (m.type === "image" || m.type === "video" || m.type === "file")
    );

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
                            <h3 className="font-bold text-base tracking-tight uppercase text-[10px] tracking-[0.2em] text-white/60">Group Info</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {/* Group avatar + name */}
                            <div className="flex flex-col items-center py-10 px-6 border-b border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent">
                                <div className="w-28 h-28 rounded-[2rem] bg-zinc-900 border-2 border-white/10 overflow-hidden shadow-2xl mb-4 grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer">
                                    <img src={chat.avatar} alt="" className="w-full h-full object-cover" />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight mb-1 text-white">{chat.name}</h2>
                                <div className="flex flex-col items-center gap-1 mt-3">
                                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                        <Users size={10} />
                                        {resolvedMembers.length} members
                                    </div>
                                    <p className="text-[9px] text-zinc-600 font-medium">Created {createdDate}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="px-5 py-6 border-b border-white/[0.04]">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <Info size={9} /> Description
                                </p>
                                <p className="text-sm text-zinc-400 font-light leading-relaxed italic">
                                    {chat.about || "No description added."}
                                </p>
                            </div>

                            {/* Media Section */}
                            <div className="p-5 border-b border-white/[0.04]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                                        <span>Media, Links & Docs</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                                        {mediaMessages.length} <ChevronRight size={14} className="text-zinc-700" />
                                    </div>
                                </div>
                                {mediaMessages.length > 0 ? (
                                    <div className="grid grid-cols-4 gap-2">
                                        {mediaMessages.slice(0, 8).map((msg) => (
                                            <div key={msg.id} className="aspect-square bg-white/5 rounded-lg border border-white/5 overflow-hidden hover:opacity-80 transition-opacity cursor-pointer grayscale hover:grayscale-0">
                                                {msg.type === "image" ? (
                                                    <img src={msg.contentUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                        <FileText size={16} className="text-zinc-600" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest text-center py-4 bg-white/[0.02] rounded-xl border border-dashed border-white/5">
                                        No media shared yet
                                    </p>
                                )}
                            </div>

                            {/* Members */}
                            <div className="px-5 py-6">
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                        Participants ({resolvedMembers.length})
                                    </p>
                                    {isAdmin && (
                                        <button
                                            onClick={() => setShowAddMember(true)}
                                            className="flex items-center gap-1.5 text-[10px] font-black text-white hover:opacity-70 transition-all bg-white/5 px-2 py-1 rounded-lg border border-white/10"
                                        >
                                            <UserPlus size={12} /> ADD
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
                                            className="overflow-hidden mb-6"
                                        >
                                            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3">
                                                <input
                                                    autoFocus
                                                    value={newMemberName}
                                                    onChange={e => setNewMemberName(e.target.value)}
                                                    onKeyDown={e => e.key === "Enter" && handleAddMember()}
                                                    placeholder="Enter name to invite…"
                                                    className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none font-medium"
                                                />
                                                <button onClick={handleAddMember} className="text-[10px] font-black text-black bg-white px-3 py-1.5 rounded-xl hover:opacity-80 transition-all uppercase tracking-widest">Add</button>
                                                <button onClick={() => setShowAddMember(false)} className="text-zinc-600 hover:text-white transition-colors p-1"><X size={14} /></button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-1">
                                    {resolvedMembers.map(member => {
                                        const memberIsAdmin = chat.admins?.includes(member.id);
                                        return (
                                            <div
                                                key={member.id}
                                                className="flex items-center gap-3 p-3 hover:bg-white/[0.03] rounded-[1.25rem] transition-all group border border-transparent hover:border-white/5"
                                            >
                                                <div className="relative">
                                                    <div className="w-11 h-11 rounded-[1.2rem] bg-zinc-800 border-2 border-white/5 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                                        <img src={member.avatar} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    {member.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white border-[3px] border-[#0a0a0a] rounded-full" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="text-sm font-bold text-white/90 truncate tracking-tight">
                                                            {member.id === "me" ? "You" : member.name}
                                                        </p>
                                                        {memberIsAdmin && (
                                                            <span className="flex items-center gap-0.5 text-[8px] font-black text-zinc-900 bg-white px-2 py-0.5 rounded-full uppercase tracking-widest">
                                                                Admin
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-zinc-600 font-medium truncate">{member.status || "Guftagu user"}</p>
                                                </div>
                                                {isAdmin && member.id !== "me" && (
                                                    <button
                                                        onClick={() => activeChatId && removeGroupMember(activeChatId, member.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-xl text-zinc-600 hover:text-red-400 transition-all"
                                                        title="Remove"
                                                    >
                                                        <UserMinus size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Exit group */}
                        <div className="p-6 border-t border-white/[0.06] bg-black/50">
                            {!showExitConfirm ? (
                                <button
                                    onClick={() => setShowExitConfirm(true)}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 rounded-2xl text-red-500 hover:text-red-400 transition-all text-sm font-black uppercase tracking-widest"
                                >
                                    <LogOut size={16} />
                                    Exit Group
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-4 bg-white/5 rounded-2xl text-sm font-black text-zinc-500 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest">Cancel</button>
                                    <button onClick={handleExit} className="flex-1 py-4 bg-red-500 border border-red-500/20 rounded-2xl text-sm font-black text-white hover:bg-red-600 transition-all uppercase tracking-widest">Exit</button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
