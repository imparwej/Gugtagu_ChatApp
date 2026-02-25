"use client";

import React, { useState } from "react";
import { ChevronDown, X, Shield, Eye, Bell, UserX, Lock, Fingerprint } from "lucide-react";
import { useChatStore } from "../../../store/chatStore";
import { motion, AnimatePresence } from "framer-motion";

type VisibilityOption = "everyone" | "contacts" | "nobody";

const VisibilitySelect = ({ label, value, onChange, icon: Icon }: { label: string; value: VisibilityOption; onChange: (v: VisibilityOption) => void; icon: any }) => {
    const [open, setOpen] = useState(false);
    const options: VisibilityOption[] = ["everyone", "contacts", "nobody"];
    return (
        <div className="flex items-center justify-between py-5 border-b border-white/[0.04] last:border-0 relative hover:bg-white/[0.01] transition-colors px-1 -mx-1">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500">
                    <Icon size={14} />
                </div>
                <p className="text-sm font-semibold text-white/80">{label}</p>
            </div>
            <div className="relative">
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] hover:border-white/10 rounded-xl px-4 py-2 text-xs text-white/70 hover:text-white transition-all capitalize"
                >
                    {value} <ChevronDown size={12} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 top-full mt-2 bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 min-w-[140px] py-1.5 backdrop-blur-xl"
                        >
                            {options.map(opt => (
                                <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
                                    className={`w-full px-4 py-2.5 text-left text-xs capitalize transition-all hover:bg-white/10 ${value === opt ? "text-white font-black" : "text-zinc-500"}`}>
                                    {opt}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const ToggleRow = ({ label, desc, value, onChange, icon: Icon }: { label: string; desc?: string; value: boolean; onChange: () => void; icon: any }) => (
    <div className="flex items-center justify-between py-5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01] transition-colors px-1 -mx-1">
        <div className="flex items-center gap-4 flex-1 pr-4">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 flex-shrink-0">
                <Icon size={14} />
            </div>
            <div className="flex-1">
                <p className="text-sm font-semibold text-white/80">{label}</p>
                {desc && <p className="text-[11px] text-zinc-600 mt-1 font-light leading-relaxed">{desc}</p>}
            </div>
        </div>
        <button onClick={onChange} className={`toggle-track ${value ? "on" : ""}`}>
            <div className="toggle-thumb" />
        </button>
    </div>
);

export const PrivacySettings = () => {
    const { privacySettings, updatePrivacySettings, unblockUser } = useChatStore();

    const BLOCKED_MOCK = [
        { id: "b1", name: "Spammer John", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=blocked1", date: "Feb 12" },
        { id: "b2", name: "Unknown", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=blocked2", date: "Jan 28" },
    ];

    return (
        <div className="h-full overflow-y-auto custom-scrollbar px-8 py-6 space-y-10">
            {/* Header section with icon */}
            <div className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/[0.05] rounded-[2rem]">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                    <Shield size={32} strokeWidth={1.5} />
                </div>
                <div>
                    <h3 className="text-lg font-black tracking-tight">Privacy Overview</h3>
                    <p className="text-xs text-zinc-600 font-light mt-1">Control who can see your info and reach you.</p>
                </div>
            </div>

            {/* Visibility settings */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Eye size={14} className="text-zinc-500" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Visibility</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl px-5 divide-y divide-white/[0.04]">
                    <VisibilitySelect icon={Lock} label="Last Seen" value={privacySettings.lastSeen} onChange={(v) => updatePrivacySettings({ lastSeen: v })} />
                    <VisibilitySelect icon={UserX} label="Profile Photo" value={privacySettings.profilePhoto} onChange={(v) => updatePrivacySettings({ profilePhoto: v })} />
                    <VisibilitySelect icon={Shield} label="About" value={privacySettings.about} onChange={(v) => updatePrivacySettings({ about: v })} />
                </div>
            </div>

            {/* Security features */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Lock size={14} className="text-zinc-500" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Messaging & Security</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl px-5 divide-y divide-white/[0.04]">
                    <ToggleRow
                        icon={Bell}
                        label="Read Receipts"
                        desc="If turned off, you won't send or receive read receipts. Read receipts are always sent for group chats."
                        value={privacySettings.readReceipts}
                        onChange={() => updatePrivacySettings({ readReceipts: !privacySettings.readReceipts })}
                    />
                    <ToggleRow
                        icon={Fingerprint}
                        label="App Lock"
                        desc="Require Biometrics to unlock Guftagu"
                        value={privacySettings.twoStepVerification}
                        onChange={() => updatePrivacySettings({ twoStepVerification: !privacySettings.twoStepVerification })}
                    />
                </div>
            </div>

            {/* Blocked contacts list */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <UserX size={14} className="text-zinc-500" />
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Blocked Contacts</p>
                    </div>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-zinc-500 font-bold">{BLOCKED_MOCK.length}</span>
                </div>
                {BLOCKED_MOCK.length === 0 ? (
                    <div className="p-8 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
                        <p className="text-sm text-zinc-700 font-light italic">No blocked contacts yet.</p>
                    </div>
                ) : (
                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-[2rem] overflow-hidden">
                        {BLOCKED_MOCK.map(user => (
                            <div key={user.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-all group border-b border-white/[0.04] last:border-0">
                                <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/[0.06] grayscale group-hover:grayscale-0 transition-all duration-500">
                                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-white/80">{user.name}</p>
                                    <p className="text-[10px] text-zinc-700 font-medium">Blocked on {user.date}</p>
                                </div>
                                <button
                                    onClick={() => unblockUser(user.id)}
                                    className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors px-4 py-2 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10"
                                >
                                    Unblock
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
