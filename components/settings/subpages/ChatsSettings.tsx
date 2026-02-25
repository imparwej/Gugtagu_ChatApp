"use client";

import React from "react";
import { useChatStore } from "../../../store/chatStore";
import { motion } from "framer-motion";
import { Image as ImageIcon, Type, Archive, ArrowUpRight, History } from "lucide-react";

const WALLPAPERS = [
    { id: "default", bg: "bg-zinc-900" },
    { id: "dots", bg: "bg-white/5", pattern: "radial-gradient(circle, #fff 1px, transparent 1px)" },
    { id: "lines", bg: "bg-white/5", pattern: "linear-gradient(45deg, #fff 1px, transparent 1px)" },
    { id: "dark", bg: "bg-black" },
    { id: "blue", bg: "bg-blue-900/40" },
];

const ToggleRow = ({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: () => void }) => (
    <div className="flex items-center justify-between py-5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01] transition-colors px-1 -mx-1">
        <div className="flex-1 pr-6">
            <p className="text-sm font-semibold text-white/90">{label}</p>
            {desc && <p className="text-[11px] text-zinc-500 mt-1 font-light leading-relaxed">{desc}</p>}
        </div>
        <button onClick={onChange} className={`toggle-track ${value ? "on" : ""}`}>
            <div className="toggle-thumb" />
        </button>
    </div>
);

export const ChatsSettings = () => {
    const { chatSettings, updateChatSettings } = useChatStore();

    return (
        <div className="h-full overflow-y-auto custom-scrollbar px-8 py-6 space-y-10">
            {/* Appearance */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <ImageIcon size={14} className="text-zinc-500" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Chat Wallpaper</p>
                </div>
                <div className="grid grid-cols-5 gap-3">
                    {WALLPAPERS.map((wp) => (
                        <button
                            key={wp.id}
                            onClick={() => updateChatSettings({ wallpaper: wp.id })}
                            className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${chatSettings.wallpaper === wp.id ? "border-white" : "border-white/5 hover:border-white/20"
                                } ${wp.bg}`}
                        >
                            {wp.pattern && <div className="absolute inset-0 opacity-10" style={{ backgroundImage: wp.pattern, backgroundSize: "12px 12px" }} />}
                            {chatSettings.wallpaper === wp.id && (
                                <motion.div layoutId="wp-active" className="absolute inset-0 bg-white/10 flex items-center justify-center backdrop-blur-[1px]">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                </motion.div>
                            )}
                        </button>
                    ))}
                </div>
                <button className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors">
                    Choose from Gallery <ArrowUpRight size={10} />
                </button>
            </div>

            {/* Accessibility */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Type size={14} className="text-zinc-500" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Text Size</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-6">
                    <div className="flex justify-between items-end mb-4 px-1">
                        <span className="text-[10px] font-bold text-zinc-600">A</span>
                        <span className="text-2xl font-bold text-zinc-400">A</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="2"
                        step="1"
                        value={chatSettings.fontSize === "small" ? 0 : chatSettings.fontSize === "medium" ? 1 : 2}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            updateChatSettings({ fontSize: val === 0 ? "small" : val === 1 ? "medium" : "large" });
                        }}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <div className="flex justify-between mt-3 px-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        <span>Small</span>
                        <span>Medium</span>
                        <span>Large</span>
                    </div>
                </div>
            </div>

            {/* Chat Options */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Archive size={14} className="text-zinc-500" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Chat Options</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl px-5 divide-y divide-white/[0.04]">
                    <ToggleRow
                        label="Enter to Send"
                        desc="The enter key will send your message"
                        value={chatSettings.enterToSend}
                        onChange={() => updateChatSettings({ enterToSend: !chatSettings.enterToSend })}
                    />
                    <ToggleRow
                        label="Archive Chats"
                        desc="Archived chats will remain archived when new messages are received"
                        value={chatSettings.archiveChats}
                        onChange={() => updateChatSettings({ archiveChats: !chatSettings.archiveChats })}
                    />
                </div>
            </div>

            {/* Backups */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <History size={14} className="text-zinc-500" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Chat Backup</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:bg-white/[0.04] transition-all">
                    <div>
                        <p className="text-sm font-semibold text-white/90">Last Backup: Today, 4:20 AM</p>
                        <p className="text-[11px] text-zinc-600 mt-1 font-light">Size: 42.5 MB</p>
                    </div>
                    <button className="px-5 py-2.5 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-zinc-100 active:scale-95 transition-all">
                        Back up
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 border-t border-white/[0.05]">
                <div className="bg-red-500/5 border border-red-500/10 rounded-2xl overflow-hidden">
                    {["Clear All Chats", "Delete All Chats"].map((item, i, arr) => (
                        <button key={item} className={`w-full px-5 py-4 text-left text-sm font-semibold text-red-400 hover:bg-red-500/5 hover:text-red-300 transition-all ${i < arr.length - 1 ? "border-b border-white/[0.04]" : ""}`}>
                            {item}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
