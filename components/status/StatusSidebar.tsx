"use client";

import React, { useState } from "react";
import { Plus, Camera } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { StatusStories } from "./StatusStories";

export const StatusSidebar = () => {
    const { stories, currentUser } = useChatStore();
    const [viewerOpen, setViewerOpen] = useState<string | null>(null);

    const recentStories = stories.filter(s => !s.viewed);
    const viewedStories = stories.filter(s => s.viewed);

    // Group by userId
    const groupByUser = (list: typeof stories) => {
        const map = new Map<string, typeof stories>();
        list.forEach(s => {
            if (!map.has(s.userId)) map.set(s.userId, []);
            map.get(s.userId)!.push(s);
        });
        return Array.from(map.entries());
    };

    const recentGroups = groupByUser(recentStories);
    const viewedGroups = groupByUser(viewedStories);

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a]">
            {/* Header */}
            <div className="px-5 pt-6 pb-3 flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight">Status</h2>
                <button className="p-2 hover:bg-white/5 rounded-xl transition-all text-zinc-500 hover:text-white">
                    <Camera size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
                {/* My Status */}
                <div className="px-4 pb-3">
                    <div className="flex items-center gap-3 p-3 hover:bg-white/[0.04] rounded-2xl transition-all cursor-pointer group">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-[14px] bg-zinc-900 border border-white/[0.06] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white rounded-lg border-[2.5px] border-[#0a0a0a] flex items-center justify-center text-black">
                                <Plus size={11} strokeWidth={3} />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white/90">My Status</p>
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Add update</p>
                        </div>
                    </div>
                </div>

                {/* Recent Updates */}
                {recentGroups.length > 0 && (
                    <div className="px-4 pb-4">
                        <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em] mb-2 px-1">Recent Updates</p>
                        {recentGroups.map(([userId, userStories]) => {
                            const first = userStories[0];
                            return (
                                <button
                                    key={userId}
                                    onClick={() => setViewerOpen(userId)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-white/[0.04] rounded-2xl transition-all group text-left"
                                >
                                    <div className="p-0.5 rounded-[15px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.15)]">
                                        <div className="w-11 h-11 rounded-[13px] bg-zinc-900 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                            <img src={first.userAvatar} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white/90 truncate group-hover:text-white transition-colors">{first.userName}</p>
                                        <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-wide mt-0.5">
                                            {first.timestamp} · {userStories.length} update{userStories.length > 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Viewed Updates */}
                {viewedGroups.length > 0 && (
                    <div className="px-4 pb-4">
                        <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em] mb-2 px-1">Viewed</p>
                        {viewedGroups.map(([userId, userStories]) => {
                            const first = userStories[0];
                            return (
                                <button
                                    key={userId}
                                    onClick={() => setViewerOpen(userId)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-white/[0.04] rounded-2xl transition-all group text-left"
                                >
                                    <div className="p-0.5 rounded-[15px] border border-zinc-800">
                                        <div className="w-11 h-11 rounded-[13px] bg-zinc-900 overflow-hidden grayscale transition-all duration-500 opacity-60 group-hover:opacity-100">
                                            <img src={first.userAvatar} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-zinc-500 truncate group-hover:text-white transition-colors">{first.userName}</p>
                                        <p className="text-[10px] text-zinc-700 uppercase font-bold tracking-wide mt-0.5">{first.timestamp}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Story viewer */}
            <StatusStories
                viewingUserId={viewerOpen}
                allStories={stories}
                onClose={() => setViewerOpen(null)}
            />
        </div>
    );
};
