"use client";

import React from "react";
import { Phone, Video, MoreVertical, Plus } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

export const CallsSidebar = () => {
    const { calls } = useChatStore();

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a]">
            {/* Header */}
            <div className="p-6 pb-2 flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tighter">Calls</h2>
                <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-white/5 rounded-xl transition-all"><Plus size={20} className="text-zinc-400" /></button>
                    <button className="p-2 hover:bg-white/5 rounded-xl transition-all"><MoreVertical size={20} className="text-zinc-400" /></button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar pb-8">
                <div className="px-4 mb-3 mt-4 text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em]">Recent Logs</div>
                {calls.map((call) => (
                    <div
                        key={call.id}
                        className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all cursor-pointer group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                            <img src={call.userAvatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-bold truncate ${call.status === 'missed' ? 'text-red-500' : 'text-white/90'}`}>{call.userName}</h4>
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">{call.status} • {call.timestamp}</p>
                        </div>
                        <div className="text-zinc-800 group-hover:text-white transition-colors">
                            {call.type === 'video' ? <Video size={18} /> : <Phone size={18} />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
