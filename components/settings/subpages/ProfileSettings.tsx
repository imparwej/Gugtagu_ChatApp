"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Edit2, QrCode, X, Check, Image } from "lucide-react";
import { useChatStore } from "../../../store/chatStore";

const MEDIA_GRID = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=70",
    "https://images.unsplash.com/photo-1545670723-196ed0954986?w=200&q=70",
    "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=200&q=70",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=70",
    "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=200&q=70",
    "https://images.unsplash.com/photo-1508921912186-1d1395efdb39?w=200&q=70",
];

const EditModal = ({ field, value, onSave, onClose }: { field: string; value: string; onSave: (v: string) => void; onClose: () => void }) => {
    const [val, setVal] = useState(value);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={onClose} />
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
                className="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-[2rem] p-7 shadow-2xl">
                <h3 className="text-base font-black mb-5 tracking-tight capitalize">Edit {field}</h3>
                <input
                    autoFocus value={val} onChange={e => setVal(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (onSave(val), onClose())}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-all mb-5"
                />
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-bold text-zinc-400 hover:text-white transition-all">Cancel</button>
                    <button onClick={() => { onSave(val); onClose(); }} className="flex-1 py-3 bg-white text-black rounded-2xl text-sm font-bold hover:bg-zinc-100 transition-all">Save</button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const QRModal = ({ onClose, name }: { onClose: () => void; name: string }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={onClose} />
        <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
            className="relative w-full max-w-xs bg-[#111] border border-white/10 rounded-[2.5rem] p-8 text-center shadow-2xl">
            <button onClick={onClose} className="absolute top-5 right-5 p-2 hover:bg-white/10 rounded-full text-zinc-500"><X size={16} /></button>
            <h3 className="text-base font-black mb-6">My QR Code</h3>
            <div className="w-40 h-40 mx-auto bg-white rounded-[1.5rem] flex items-center justify-center mb-4">
                <div className="w-32 h-32 grid grid-cols-5 gap-1">
                    {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className={`rounded-sm ${Math.random() > 0.45 ? "bg-black" : "bg-transparent"}`} />
                    ))}
                </div>
            </div>
            <p className="text-xs text-zinc-500 font-light">Scan to add <span className="text-white font-bold">{name}</span></p>
        </motion.div>
    </motion.div>
);

export const ProfileSettings = () => {
    const { currentUser, updateProfile } = useChatStore();
    const [editing, setEditing] = useState<"name" | "about" | null>(null);
    const [showQR, setShowQR] = useState(false);

    return (
        <div className="h-full overflow-y-auto custom-scrollbar">
            <AnimatePresence>
                {editing && <EditModal field={editing} value={currentUser[editing] || ""} onSave={(v) => updateProfile({ [editing]: v })} onClose={() => setEditing(null)} />}
                {showQR && <QRModal name={currentUser.name} onClose={() => setShowQR(false)} />}
            </AnimatePresence>

            {/* Avatar */}
            <div className="flex flex-col items-center py-10 px-8 border-b border-white/[0.05]">
                <div className="relative group mb-6">
                    <div className="w-28 h-28 rounded-[2.5rem] bg-zinc-900 border-2 border-white/10 overflow-hidden shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700">
                        <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-white text-black rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
                        <Camera size={16} />
                    </button>
                </div>
                <h2 className="text-2xl font-black tracking-tight">{currentUser.name}</h2>
                <p className="text-zinc-500 text-sm font-light mt-1">{currentUser.about}</p>
            </div>

            {/* Fields */}
            <div className="px-8 py-6 space-y-6 border-b border-white/[0.05]">
                {[
                    { label: "Name", key: "name" as const, value: currentUser.name, canEdit: true },
                    { label: "About", key: "about" as const, value: currentUser.about || "", canEdit: true },
                    { label: "Phone", key: "phone" as const, value: currentUser.phone || "", canEdit: false },
                ].map(({ label, key, value, canEdit }) => (
                    <div key={label}>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">{label}</p>
                        <div
                            className={`flex items-center justify-between bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3.5 ${canEdit ? "hover:border-white/10 cursor-pointer group" : ""}`}
                            onClick={() => canEdit && setEditing(key as any)}
                        >
                            <span className={`text-sm ${key === "phone" ? "font-mono" : "font-medium"} text-white/80`}>{value || "—"}</span>
                            {canEdit && <Edit2 size={14} className="text-zinc-700 group-hover:text-white transition-colors" />}
                        </div>
                    </div>
                ))}
            </div>

            {/* QR code */}
            <div className="px-8 py-4 border-b border-white/[0.05]">
                <button
                    onClick={() => setShowQR(true)}
                    className="w-full flex items-center gap-3 p-4 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] rounded-2xl transition-all group"
                >
                    <QrCode size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
                    <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">My QR Code</span>
                </button>
            </div>

            {/* Media grid */}
            <div className="px-8 py-6">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Media</p>
                    <button className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors">See All</button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {MEDIA_GRID.map((url, i) => (
                        <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/[0.06] group cursor-pointer">
                            <img src={url} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
