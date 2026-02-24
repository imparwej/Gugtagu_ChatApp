"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useChatStore } from "../../store/chatStore";

export const StatusSidebar = () => {
    const { stories, currentUser } = useChatStore();

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a]">
            {/* Header */}
            <div className="p-6 pb-2">
                <h2 className="text-2xl font-black tracking-tighter">Status</h2>
            </div>

            {/* My Status */}
            <div className="p-4">
                <div className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all cursor-pointer group">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                            <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-lg border-[3px] border-[#0a0a0a] flex items-center justify-center text-black">
                            <Plus size={12} strokeWidth={4} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white/90">My Status</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Tap to add update</p>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-2 space-y-2 custom-scrollbar">
                <div className="px-4 mb-2 text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em]">Recent Updates</div>
                {stories.map((story) => (
                    <div
                        key={story.id}
                        className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all cursor-pointer group"
                    >
                        <div className={`p-0.5 rounded-xl border-2 ${story.viewed ? 'border-zinc-800' : 'border-white'} transition-colors duration-500 shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>
                            <div className="w-11 h-11 rounded-lg bg-zinc-900 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                <img src={story.userAvatar} alt="" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white/90 truncate group-hover:text-white transition-colors">{story.userName}</h4>
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">{story.timestamp}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
