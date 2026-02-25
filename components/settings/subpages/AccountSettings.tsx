"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, AlertTriangle, ChevronRight, X, KeyRound, Check } from "lucide-react";
import { useChatStore } from "../../../store/chatStore";

const ToggleRow = ({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: () => void }) => (
    <div className="flex items-center justify-between py-4 border-b border-white/[0.04] last:border-0">
        <div className="flex-1 pr-4">
            <p className="text-sm font-semibold text-white/90">{label}</p>
            <p className="text-[11px] text-zinc-600 mt-0.5 font-light">{desc}</p>
        </div>
        <button onClick={onChange} className={`toggle-track ${value ? "on" : ""}`}>
            <div className="toggle-thumb" />
        </button>
    </div>
);

const DeleteModal = ({ onClose }: { onClose: () => void }) => {
    const [step, setStep] = useState(1);
    const { setLoggedIn } = useChatStore();
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
            <motion.div initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}
                className="relative w-full max-w-sm bg-[#111] border border-red-500/20 rounded-[2rem] p-7 shadow-2xl">
                <button onClick={onClose} className="absolute top-5 right-5 p-1.5 hover:bg-white/10 rounded-full text-zinc-500"><X size={16} /></button>
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-4">
                        <AlertTriangle size={24} className="text-red-400" />
                    </div>
                    <h3 className="text-lg font-black text-red-400">Delete Account</h3>
                    {step === 1
                        ? <p className="text-sm text-zinc-500 mt-2 font-light">This will permanently delete your account and all your data. This cannot be undone.</p>
                        : <p className="text-sm text-red-400/80 mt-2 font-light">Are you absolutely certain? Your messages, media, and profile will be erased forever.</p>
                    }
                </div>
                {step === 1
                    ? <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-bold text-zinc-400 hover:text-white transition-all">Cancel</button>
                        <button onClick={() => setStep(2)} className="flex-1 py-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-2xl text-sm font-bold text-red-400 transition-all">Continue</button>
                    </div>
                    : <button onClick={() => { setLoggedIn(false); onClose(); }} className="w-full py-3 bg-red-500 text-white rounded-2xl text-sm font-bold hover:bg-red-600 active:scale-95 transition-all">
                        Yes, Delete My Account
                    </button>
                }
            </motion.div>
        </motion.div>
    );
};

export const AccountSettings = () => {
    const { privacySettings, updatePrivacySettings } = useChatStore();
    const [showDelete, setShowDelete] = useState(false);
    const [showTwoStep, setShowTwoStep] = useState(false);
    const [pin, setPin] = useState("");
    const [pinSaved, setPinSaved] = useState(false);

    return (
        <div className="h-full overflow-y-auto custom-scrollbar px-8 py-6">
            <AnimatePresence>
                {showDelete && <DeleteModal onClose={() => setShowDelete(false)} />}
            </AnimatePresence>

            {/* Change number */}
            <div className="mb-8">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Phone Number</p>
                <button className="w-full flex items-center gap-3 p-4 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] rounded-2xl transition-all group">
                    <Phone size={16} className="text-zinc-500" />
                    <span className="text-sm font-semibold text-white/80 flex-1 text-left">Change Number</span>
                    <ChevronRight size={14} className="text-zinc-700 group-hover:text-white transition-colors" />
                </button>
            </div>

            {/* Two-step verification */}
            <div className="mb-8">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Security</p>
                <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/[0.04] transition-all" onClick={() => setShowTwoStep(!showTwoStep)}>
                        <KeyRound size={16} className="text-zinc-500" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-white/80">Two-Step Verification</p>
                            <p className="text-[11px] text-zinc-600 font-light mt-0.5">Add a PIN for extra security</p>
                        </div>
                        <button className={`toggle-track ${privacySettings.twoStepVerification ? "on" : ""}`} onClick={(e) => { e.stopPropagation(); updatePrivacySettings({ twoStepVerification: !privacySettings.twoStepVerification }); }}>
                            <div className="toggle-thumb" />
                        </button>
                    </div>
                    <AnimatePresence>
                        {showTwoStep && privacySettings.twoStepVerification && (
                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-white/[0.06]">
                                <div className="p-4 flex gap-3">
                                    <input
                                        type="password" maxLength={6} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
                                        placeholder="Enter 6-digit PIN"
                                        className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-mono placeholder:text-zinc-700 focus:outline-none focus:border-white/20 transition-all"
                                    />
                                    <button onClick={() => { if (pin.length === 6) setPinSaved(true); }} className="px-4 py-2 bg-white text-black rounded-xl text-xs font-bold hover:bg-zinc-100 transition-all flex items-center gap-1.5">
                                        {pinSaved ? <><Check size={12} /> Saved</> : "Save"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Delete account */}
            <div>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Danger Zone</p>
                <button
                    onClick={() => setShowDelete(true)}
                    className="w-full flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 rounded-2xl transition-all group"
                >
                    <AlertTriangle size={16} className="text-red-400" />
                    <span className="text-sm font-semibold text-red-400">Delete Account</span>
                </button>
            </div>
        </div>
    );
};
