"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { Story } from "../../types/chat";

export const StatusStories = () => {
    const { stories, markStoryViewed } = useChatStore();
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [progress, setProgress] = useState(0);

    const handleOpenStory = (story: Story) => {
        setSelectedStory(story);
        setProgress(0);
        markStoryViewed(story.id);
    };

    const handleClose = () => {
        setSelectedStory(null);
        setProgress(0);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (selectedStory) {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        handleClose();
                        return 100;
                    }
                    return prev + 1;
                });
            }, 50); // 5 seconds total
        }
        return () => clearInterval(interval);
    }, [selectedStory]);

    return (
        <div className="flex flex-col gap-3 px-4 py-2">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Status</h3>
            <div className="flex items-center gap-4 overflow-x-auto pb-2 custom-scrollbar-hide">
                {/* My Status Add */}
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden">
                            <Plus size={20} className="text-zinc-500 group-hover:text-white transition-colors" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-[#0f0f0f]">
                            <Plus size={12} className="text-black" />
                        </div>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-medium">Add Status</span>
                </div>

                {stories.map((story) => (
                    <div
                        key={story.id}
                        onClick={() => handleOpenStory(story)}
                        className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
                    >
                        <div className={`p-0.5 rounded-[1.25rem] border-2 transition-all duration-500 ${story.viewed ? "border-zinc-800" : "border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"}`}>
                            <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-white/10 overflow-hidden">
                                <img src={story.userAvatar} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </div>
                        <span className={`text-[10px] font-medium truncate w-14 text-center ${story.viewed ? "text-zinc-500" : "text-white/90"}`}>
                            {story.userName.split(" ")[0]}
                        </span>
                    </div>
                ))}
            </div>

            {/* Fullscreen Story Viewer */}
            <AnimatePresence>
                {selectedStory && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
                    >
                        {/* Progress Bar Container */}
                        <div className="absolute top-0 left-0 right-0 h-1 gap-1 flex px-4 z-[210] mt-12 md:mt-8">
                            <div className="flex-1 h-full bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Story UI Header */}
                        <div className="absolute top-16 left-0 right-0 px-6 z-[210] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/20 overflow-hidden">
                                    <img src={selectedStory.userAvatar} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white tracking-tight">{selectedStory.userName}</span>
                                    <span className="text-[10px] text-zinc-400">{selectedStory.timestamp}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Media Content */}
                        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                            <img
                                src={selectedStory.mediaUrl}
                                alt=""
                                className="w-full h-full object-cover md:max-w-md md:h-auto md:rounded-3xl md:aspect-[9/16] shadow-2xl"
                            />

                            {/* Tap Navigations */}
                            <div className="absolute inset-0 flex">
                                <div className="w-1/2 h-full cursor-pointer" onClick={() => setProgress(0)} />
                                <div className="w-1/2 h-full cursor-pointer" onClick={handleClose} />
                            </div>
                        </div>

                        {/* Navigation Buttons (Desktop) */}
                        <div className="hidden md:flex absolute inset-x-0 top-1/2 -translate-y-1/2 justify-between px-10 pointer-events-none">
                            <button className="p-4 bg-white/5 backdrop-blur-md rounded-full text-white/40 pointer-events-auto hover:bg-white/10 transition-all">
                                <ChevronLeft size={32} />
                            </button>
                            <button className="p-4 bg-white/5 backdrop-blur-md rounded-full text-white/40 pointer-events-auto hover:bg-white/10 transition-all">
                                <ChevronRight size={32} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
