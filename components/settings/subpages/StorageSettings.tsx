"use client";

import React, { useState } from "react";
import { HardDrive, Image, Video, FileText, Music, Trash2, PieChart, ChevronRight, Download, Wifi } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const storageData = [
    { icon: Image, label: "Photos", size: "124 MB", count: 147, pct: 15, color: "bg-white" },
    { icon: Video, label: "Videos", size: "856 MB", count: 42, pct: 45, color: "bg-zinc-500" },
    { icon: FileText, label: "Documents", size: "38 MB", count: 123, pct: 10, color: "bg-zinc-700" },
    { icon: Music, label: "Voice Notes", size: "14 MB", count: 231, pct: 5, color: "bg-zinc-800" },
];

const total = "1.03 GB";
const used = 1032;
const max = 2048;
const usedPct = (used / max) * 100;

const CategoryCard = ({ icon: Icon, label, size, count, pct, color }: any) => (
    <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-5 hover:bg-white/[0.05] transition-all group cursor-pointer">
        <div className="flex items-center gap-4 mb-4">
            <div className={`w-10 h-10 ${color} bg-opacity-10 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors`}>
                <Icon size={18} />
            </div>
            <div className="flex-1">
                <p className="text-sm font-semibold text-white/90">{label}</p>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{count} items</p>
            </div>
            <p className="text-xs font-black text-white/60">{size}</p>
        </div>
        <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${color} opacity-40`}
            />
        </div>
    </div>
);

export const StorageSettings = () => {
    const [isCleaning, setIsCleaning] = useState(false);

    const handleClear = () => {
        setIsCleaning(true);
        setTimeout(() => setIsCleaning(false), 2000);
    };

    return (
        <div className="h-full overflow-y-auto custom-scrollbar px-8 py-6 space-y-10 pb-12">
            {/* Header section with cumulative bar */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/5 border border-white/[0.08] rounded-2xl flex items-center justify-center">
                            <HardDrive size={28} className="text-zinc-500" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter">{total} used</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">of 2 GB Device Storage</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClear}
                        disabled={isCleaning}
                        className="p-4 bg-white/[0.05] hover:bg-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all disabled:opacity-50"
                    >
                        {isCleaning ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Trash2 size={20} /></motion.div> : <Trash2 size={20} />}
                    </button>
                </div>

                {/* Visual Storage Bar */}
                <div className="space-y-3">
                    <div className="h-4 bg-white/[0.04] rounded-full overflow-hidden flex">
                        {storageData.map((d, i) => (
                            <motion.div
                                key={i}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className={`h-full ${d.color} origin-left`}
                                style={{ width: `${d.pct}%` }}
                            />
                        ))}
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                        {storageData.map((d, i) => (
                            <div key={i} className="flex items-center gap-1.5 flex-shrink-0">
                                <div className={`w-2 h-2 rounded-full ${d.color}`} />
                                <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">{d.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Breakdown */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <PieChart size={14} className="text-zinc-500" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Storage Breakdown</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {storageData.map((data, i) => (
                        <CategoryCard key={i} {...data} />
                    ))}
                </div>
            </div>

            {/* Media Auto-Download */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Download size={14} className="text-zinc-500" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Media Auto-Download</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-[2rem] px-6 divide-y divide-white/[0.04]">
                    {[
                        { icon: Wifi, label: "When using mobile data", value: "Photos" },
                        { icon: Wifi, label: "When connected on Wi-Fi", value: "All Media" },
                        { icon: Wifi, label: "When roaming", value: "No Media" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-5 group cursor-pointer hover:bg-white/[0.01] transition-all px-1 -mx-1">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-600 group-hover:text-white transition-colors">
                                    <item.icon size={14} />
                                </div>
                                <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{item.label}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors font-medium">{item.value}</span>
                                <ChevronRight size={14} className="text-zinc-800 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Storage Management Tools */}
            <div className="pt-4">
                <button className="w-full flex items-center justify-between p-6 bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] rounded-[2rem] transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                            <Trash2 size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-white/90">Deep Cleanup</p>
                            <p className="text-[11px] text-zinc-600 font-light mt-0.5">Find and delete large attachments</p>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-zinc-800 group-hover:text-white transition-colors" />
                </button>
            </div>
        </div>
    );
};
