"use client";

import React, { useState } from "react";
import { Phone, Video, Plus, PhoneIncoming, PhoneMissed, PhoneOutgoing } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { Call } from "../../types/chat";
import { motion } from "framer-motion";
import { CallModal } from "./CallModal";

const CallIcon = ({ status, type }: { status: Call["status"]; type: Call["type"] }) => {
    const Icon = type === "video" ? Video : Phone;
    if (status === "missed") return <PhoneMissed size={14} className="text-red-400" />;
    if (status === "incoming") return <PhoneIncoming size={14} className="text-white/60" />;
    return <PhoneOutgoing size={14} className="text-white/60" />;
};

export const CallsSidebar = () => {
    const { calls, startCall } = useChatStore();
    const [modalCall, setModalCall] = useState<Call | null>(null);

    // Group by dateLabel
    const groups = calls.reduce<Record<string, Call[]>>((acc, call) => {
        const label = call.dateLabel || "Earlier";
        if (!acc[label]) acc[label] = [];
        acc[label].push(call);
        return acc;
    }, {});

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a]">
            {/* Header */}
            <div className="px-5 pt-6 pb-3 flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight">Calls</h2>
                <button className="p-2 hover:bg-white/5 rounded-xl transition-all text-zinc-500 hover:text-white">
                    <Plus size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4 space-y-4">
                {Object.entries(groups).map(([label, groupCalls]) => (
                    <div key={label}>
                        <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em] px-3 py-2">{label}</p>
                        {groupCalls.map((call) => (
                            <motion.div
                                key={call.id}
                                whileTap={{ scale: 0.985 }}
                                onClick={() => setModalCall(call)}
                                className="flex items-center gap-3 p-3 hover:bg-white/[0.04] rounded-2xl cursor-pointer group transition-all"
                            >
                                <div className="w-11 h-11 rounded-[13px] bg-zinc-900 border border-white/[0.06] overflow-hidden flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500">
                                    <img src={call.userAvatar} alt="" className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold truncate ${call.status === "missed" ? "text-red-400" : "text-white/90 group-hover:text-white"} transition-colors`}>
                                        {call.userName}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <CallIcon status={call.status} type={call.type} />
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${call.status === "missed" ? "text-red-500/60" : "text-zinc-600"}`}>
                                            {call.status}
                                            {call.duration ? ` · ${call.duration}` : ""}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-zinc-700 group-hover:text-zinc-500 transition-colors">{call.timestamp}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startCall({ name: call.userName, avatar: call.userAvatar, type: call.type });
                                        }}
                                        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-xl text-zinc-500 hover:text-white transition-all"
                                        title={`${call.type === "video" ? "Video" : "Voice"} call back`}
                                    >
                                        {call.type === "video" ? <Video size={14} /> : <Phone size={14} />}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ))}
            </div>

            <CallModal isOpen={!!modalCall} call={modalCall} onClose={() => setModalCall(null)} />
        </div>
    );
};
