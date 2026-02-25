"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Story } from "../../types/chat";
import { useChatStore } from "../../store/chatStore";

interface Props {
    viewingUserId: string | null;
    allStories: Story[];
    onClose: () => void;
}

export const StatusStories = ({ viewingUserId, allStories, onClose }: Props) => {
    const { markStoryViewed } = useChatStore();
    const [storyIndex, setStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    // Group all stories by userId, maintaining order
    const userGroups = (() => {
        const map = new Map<string, Story[]>();
        allStories.forEach(s => {
            if (!map.has(s.userId)) map.set(s.userId, []);
            map.get(s.userId)!.push(s);
        });
        return Array.from(map.entries()); // [[userId, stories[]], ...]
    })();

    const userGroupIndex = userGroups.findIndex(([uid]) => uid === viewingUserId);
    const currentUserStories = viewingUserId ? (userGroups[userGroupIndex]?.[1] ?? []) : [];
    const currentStory = currentUserStories[storyIndex];

    // Mark as viewed & reset progress when story changes
    useEffect(() => {
        if (!currentStory) return;
        setProgress(0);
        markStoryViewed(currentStory.id);
    }, [currentStory?.id, viewingUserId]);

    // Auto-progress
    useEffect(() => {
        if (!viewingUserId || !currentStory) return;
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    goNext();
                    return 0;
                }
                return p + 2; // 50 steps × 20ms = ~5s
            });
        }, 100);
        return () => clearInterval(interval);
    }, [currentStory?.id, viewingUserId]);

    const goNext = () => {
        if (storyIndex < currentUserStories.length - 1) {
            setStoryIndex(i => i + 1);
        } else if (userGroupIndex < userGroups.length - 1) {
            // Move to next user's stories
            const nextUserId = userGroups[userGroupIndex + 1][0];
            // trigger parent switch
            onClose(); // simplified — close instead of cross-user navigation
        } else {
            onClose();
        }
    };

    const goPrev = () => {
        if (storyIndex > 0) setStoryIndex(i => i - 1);
        else onClose();
    };

    if (!viewingUserId || !currentStory) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[300] bg-black flex items-center justify-center"
            >
                {/* Background blur */}
                <div className="absolute inset-0">
                    <img src={currentStory.mediaUrl} alt="" className="w-full h-full object-cover blur-3xl opacity-20 scale-110" />
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                {/* Story card */}
                <div className="relative w-full h-full md:max-w-sm md:h-[90vh] md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
                    {/* Progress bars */}
                    <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-4 pt-4">
                        {currentUserStories.map((_, i) => (
                            <div key={i} className="flex-1 h-[2px] bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white rounded-full"
                                    style={{
                                        width: i < storyIndex ? "100%" : i === storyIndex ? `${progress}%` : "0%"
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="absolute top-10 left-0 right-0 z-20 flex items-center justify-between px-4 py-2">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl border border-white/20 overflow-hidden">
                                <img src={currentStory.userAvatar} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white leading-tight">{currentStory.userName}</p>
                                <p className="text-[10px] text-white/50">{currentStory.timestamp}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Media */}
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentStory.id}
                            initial={{ opacity: 0, scale: 1.04 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            src={currentStory.mediaUrl}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </AnimatePresence>

                    {/* Caption */}
                    {currentStory.caption && (
                        <div className="absolute bottom-16 left-0 right-0 px-5 z-20">
                            <p className="text-white text-sm font-medium text-center drop-shadow-lg bg-black/30 backdrop-blur-sm px-4 py-2 rounded-2xl">
                                {currentStory.caption}
                            </p>
                        </div>
                    )}

                    {/* Tap zones */}
                    <div className="absolute inset-0 z-10 flex">
                        <div className="w-1/3 h-full cursor-pointer" onClick={goPrev} />
                        <div className="flex-1 h-full" />
                        <div className="w-1/3 h-full cursor-pointer" onClick={goNext} />
                    </div>

                    {/* Arrow buttons */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-20 pointer-events-none">
                        {storyIndex > 0 && (
                            <button onClick={goPrev} className="p-2 bg-black/30 backdrop-blur-md rounded-full text-white/60 pointer-events-auto hover:bg-black/50 transition-all">
                                <ChevronLeft size={24} />
                            </button>
                        )}
                        <div className="flex-1" />
                        <button onClick={goNext} className="p-2 bg-black/30 backdrop-blur-md rounded-full text-white/60 pointer-events-auto hover:bg-black/50 transition-all">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
