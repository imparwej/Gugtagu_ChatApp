"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Users, UserPlus, Search, ChevronRight,
    ArrowLeft, Camera, Check, MessageSquare
} from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { User } from "../../types/chat";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

type ModalStep = "options" | "contacts" | "group-name";

export const NewChatModal = ({ isOpen, onClose }: Props) => {
    const { contacts, createChat, createGroup } = useChatStore();
    const [step, setStep] = useState<ModalStep>("options");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
    const [groupName, setGroupName] = useState("");

    const filteredContacts = (contacts || []).filter((c: User) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectContact = (contactId: string) => {
        if (step === "contacts" && selectedContacts.length === 0) {
            // New direct chat
            createChat(contactId);
            onClose();
            reset();
        } else {
            // Multi-select for group
            setSelectedContacts(prev =>
                prev.includes(contactId)
                    ? prev.filter(id => id !== contactId)
                    : [...prev, contactId]
            );
        }
    };

    const handleCreateGroup = () => {
        if (!groupName.trim() || selectedContacts.length === 0) return;
        createGroup(groupName.trim(), selectedContacts);
        onClose();
        reset();
    };

    const reset = () => {
        setStep("options");
        setSearchQuery("");
        setSelectedContacts([]);
        setGroupName("");
    };

    const renderOptions = () => (
        <div className="p-4 space-y-2">
            <button
                onClick={() => setStep("contacts")}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all group border border-transparent hover:border-white/5"
            >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-black transition-all">
                    <UserPlus size={20} />
                </div>
                <div className="flex-1 text-left">
                    <h4 className="font-bold text-white">New Chat</h4>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Start a private conversation</p>
                </div>
                <ChevronRight size={16} className="text-zinc-800" />
            </button>
            <button
                onClick={() => setStep("contacts")}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all group border border-transparent hover:border-white/5"
            >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-black transition-all">
                    <Users size={20} />
                </div>
                <div className="flex-1 text-left">
                    <h4 className="font-bold text-white">New Group</h4>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Chat with multiple people</p>
                </div>
                <ChevronRight size={16} className="text-zinc-800" />
            </button>
        </div>
    );

    const renderContacts = () => (
        <div className="flex flex-col h-full">
            <div className="p-4 pt-0">
                <div className="relative group/search">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/search:text-white transition-colors" />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.04] rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/10 focus:bg-white/[0.06] transition-all"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
                {filteredContacts.map((contact: User) => (
                    <button
                        key={contact.id}
                        onClick={() => handleSelectContact(contact.id)}
                        className="w-full flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-all group"
                    >
                        <div className="relative">
                            <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-white/5 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                <img src={contact.avatar} alt="" className="w-full h-full object-cover" />
                            </div>
                            {selectedContacts.includes(contact.id) && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-lg flex items-center justify-center text-black border-2 border-black">
                                    <Check size={12} strokeWidth={4} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 text-left">
                            <h4 className="text-sm font-bold text-white/90 truncate">{contact.name}</h4>
                            <p className="text-[10px] text-zinc-600 font-medium truncate">{contact.status}</p>
                        </div>
                    </button>
                ))}
            </div>

            {selectedContacts.length > 0 && (
                <div className="p-4 bg-black/80 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500">{selectedContacts.length} selected</span>
                    <button
                        onClick={() => setStep("group-name")}
                        className="px-6 py-2 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );

    const renderGroupName = () => (
        <div className="p-6 space-y-8 h-full flex flex-col">
            <div className="flex flex-col items-center gap-6 pt-4">
                <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-zinc-600 hover:border-white/40 hover:text-white transition-all cursor-pointer">
                    <Camera size={24} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Add Icon</span>
                </div>
                <div className="w-full">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 ml-2">Group Name</p>
                    <input
                        autoFocus
                        type="text"
                        placeholder="Enter group name..."
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleCreateGroup()}
                        className="w-full bg-transparent border-b border-white/10 py-3 text-xl font-black tracking-tight text-white focus:outline-none focus:border-white transition-all placeholder:text-zinc-800"
                    />
                </div>
            </div>

            <div className="flex-1" />

            <div className="space-y-4">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-2">Participating</p>
                <div className="flex -space-x-2 overflow-hidden px-2">
                    {selectedContacts.slice(0, 5).map(id => {
                        const c = contacts.find((con: User) => con.id === id);
                        return <img key={id} src={c?.avatar} className="inline-block h-10 w-10 rounded-xl ring-4 ring-[#0a0a0a] grayscale" />;
                    })}
                    {selectedContacts.length > 5 && (
                        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-zinc-900 ring-4 ring-[#0a0a0a] text-[10px] font-bold text-zinc-500">
                            +{selectedContacts.length - 5}
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={handleCreateGroup}
                className="w-full py-4 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-98 transition-all"
            >
                Create Group
            </button>
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-[440px] h-[580px] bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 h-20 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {step !== "options" && (
                                    <button
                                        onClick={() => setStep("options")}
                                        className="p-2 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"
                                    >
                                        <ArrowLeft size={18} />
                                    </button>
                                )}
                                <h2 className="text-xl font-black tracking-tighter">
                                    {step === "options" ? "New Message" : step === "contacts" ? "Select Contacts" : "Group Setup"}
                                </h2>
                            </div>
                            <button onClick={onClose} className="p-2.5 hover:bg-white/5 rounded-xl text-zinc-500 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden">
                            {step === "options" && renderOptions()}
                            {step === "contacts" && renderContacts()}
                            {step === "group-name" && renderGroupName()}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
