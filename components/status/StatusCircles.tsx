"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Story, User } from "../../types/chat";
import { useChatStore } from "../../store/chatStore";

interface Props {
    onSelectUser: (userId: string) => void;
}

export const StatusCircles = ({ onSelectUser }: Props) => {
    const { stories, currentUser } = useChatStore();

    // Group by userId and check if all viewed
    const userStatusGroups = (() => {
        const map = new Map<string, { stories: Story[], allViewed: boolean, userName: string, userAvatar: string }>();
        stories.forEach(s => {
            if (!map.has(s.userId)) {
                map.set(s.userId, { stories: [], allViewed: true, userName: s.userName, userAvatar: s.userAvatar });
            }
            const group = map.get(s.userId)!;
            group.stories.push(s);
            if (!s.viewed) group.allViewed = false;
        });
        return Array.from(map.entries());
    })();

    return (
        <div className="flex items-center gap-4 px-6 py-4 overflow-x-auto custom-scrollbar no-scrollbar">
            {/* Add My Status */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer flex-shrink-0">
                <div className="relative">
                    <div className="w-16 h-16 rounded-[22px] bg-zinc-900 border border-white/5 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                        <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-xl border-[3px] border-[#0f0f0f] flex items-center justify-center text-black shadow-lg">
                        <Plus size={14} strokeWidth={4} />
                    </div>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 group-hover:text-white transition-colors">My Status</span>
            </div>

            {/* Other Statuses */}
            {userStatusGroups.map(([userId, group]) => (
                <div
                    key={userId}
                    onClick={() => onSelectUser(userId)}
                    className="flex flex-col items-center gap-2 group cursor-pointer flex-shrink-0"
                >
                    <div className={`p-0.5 rounded-[24px] ${group.allViewed ? 'border border-zinc-800' : 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.15)]'}`}>
                        <div className={`w-15 h-15 rounded-[22px] bg-zinc-900 overflow-hidden transition-all duration-500 ${group.allViewed ? 'grayscale opacity-60 group-hover:opacity-100' : 'grayscale group-hover:grayscale-0'}`}>
                            <img src={group.userAvatar} alt={group.userName} className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <span className={`text-[10px] font-bold truncate w-16 text-center transition-colors ${group.allViewed ? 'text-zinc-600' : 'text-zinc-400 group-hover:text-white'}`}>
                        {group.userName.split(' ')[0]}
                    </span>
                </div>
            ))}
        </div>
    );
};
