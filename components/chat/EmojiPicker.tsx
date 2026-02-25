"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

interface Props {
    onSelect: (emoji: string) => void;
    onClose: () => void;
}

const EMOJI_CATEGORIES: { label: string; emoji: string; items: string[] }[] = [
    {
        label: "Smileys", emoji: "😀",
        items: ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "🥰", "😘", "😗", "😙", "😚", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😒", "😞", "😔", "😟", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😣", "😢", "😭", "😤", "😠", "😡", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖"]
    },
    {
        label: "People", emoji: "👋",
        items: ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "🤞", "🫶", "👏", "🙌", "🫙", "👐", "🤲", "🤝", "🙏", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🫀", "🫁", "🧠", "🦷", "🦴", "👀", "👁", "👅", "👄", "💋", "🫦"]
    },
    {
        label: "Nature", emoji: "🌿",
        items: ["🌱", "🌿", "☘️", "🍀", "🎋", "🎍", "🍃", "🍂", "🍁", "🍄", "🐚", "🪨", "🌾", "💐", "🌷", "🌹", "🥀", "🌺", "🌸", "🌼", "🌻", "🌞", "🌝", "🌛", "🌜", "🌚", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓", "🌔", "🌙", "🌟", "⭐", "🌠", "☁️", "⛅", "🌤", "🌥", "🌦", "🌧", "⛈", "🌩", "🌨", "❄️", "☃️", "⛄", "🌬", "💨", "🌀", "🌈", "☂️", "☔", "⚡", "🔥"]
    },
    {
        label: "Food", emoji: "🍔",
        items: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🥑", "🥦", "🥬", "🥒", "🌶", "🫑", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🌭", "🍔", "🍟", "🍕", "🫓", "🥪", "🥙", "🧆", "🌮", "🌯", "🫔", "🥗", "🥘", "🫕", "🥫"]
    },
    {
        label: "Activity", emoji: "⚽",
        items: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂", "🏋️", "🤼", "🤸", "⛹️", "🤺", "🤾", "🏌️", "🏇", "🧘", "🏄", "🏊", "🤽", "🚣", "🧗", "🚵", "🚴", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🏵️"]
    },
    {
        label: "Travel", emoji: "✈️",
        items: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎", "🚓", "🚑", "🚒", "🚐", "🦯", "🦽", "🦼", "🛺", "🚲", "🛵", "🏍", "🛻", "🚨", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", "🚟", "🚃", "🚋", "🚞", "🚝", "🚄", "🚅", "🚈", "🚂", "🚆", "🚇", "🚊", "🚉", "✈️", "🛫", "🛬", "🛩", "💺", "🛰", "🚀", "🛸", "🚁", "🛶", "⛵", "🚤", "🛥", "🛳", "⛴", "🚢", "⚓", "🪝", "⛽", "🚧", "🚦", "🚥"]
    },
    {
        label: "Objects", emoji: "💡",
        items: ["⌚", "📱", "📲", "💻", "⌨️", "🖥", "🖨", "🖱", "🖲", "🕹", "🗜", "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥", "📽", "🎞", "📞", "☎️", "📟", "📠", "📺", "📻", "🧭", "⏱", "⏲", "🕰", "⌛", "⏳", "📡", "🔋", "🔌", "💡", "🔦", "🕯", "🪔", "🧯", "🛢", "💸", "💵", "💴", "💶", "💷", "💰", "💳", "🪙", "💎", "⚖️", "🧰", "🔧", "🔨", "⚒️", "🛠", "😼"]
    },
    {
        label: "Symbols", emoji: "❤️",
        items: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉", "✡️", "🔯", "☸️", "☯️", "🕎", "⛎", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "🆔", "⚡", "🔱", "📛", "🔰", "⭕", "✅", "☑️", "✔️", "❎", "➕", "➖", "➗", "✖️", "♾", "💲", "💱", "™️", "©️", "®️"]
    },
];

export const EmojiPicker = ({ onSelect, onClose }: Props) => {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        setTimeout(() => window.addEventListener("mousedown", handler), 50);
        return () => window.removeEventListener("mousedown", handler);
    }, [onClose]);

    const filteredEmojis = search
        ? EMOJI_CATEGORIES.flatMap(c => c.items).filter(e => e.includes(search))
        : EMOJI_CATEGORIES[activeCategory].items;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full left-0 mb-2 w-[340px] bg-[#111] border border-white/10 rounded-[1.75rem] overflow-hidden shadow-2xl z-50"
        >
            {/* Search */}
            <div className="p-3 border-b border-white/[0.06]">
                <div className="relative">
                    <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search emojis…"
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-8 pr-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/10 transition-all"
                    />
                </div>
            </div>

            {/* Category tabs */}
            {!search && (
                <div className="flex items-center gap-0 overflow-x-auto custom-scrollbar-hide px-2 pt-2 border-b border-white/[0.06]">
                    {EMOJI_CATEGORIES.map((cat, i) => (
                        <button
                            key={cat.label}
                            onClick={() => setActiveCategory(i)}
                            className={`flex-shrink-0 px-2 py-1.5 text-lg rounded-lg transition-all ${activeCategory === i ? "bg-white/10" : "hover:bg-white/5"}`}
                            title={cat.label}
                        >
                            {cat.emoji}
                        </button>
                    ))}
                </div>
            )}

            {/* Emojis grid */}
            <div className="h-52 overflow-y-auto custom-scrollbar p-2">
                {!search && (
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1 pb-1">
                        {EMOJI_CATEGORIES[activeCategory].label}
                    </p>
                )}
                <div className="grid grid-cols-8 gap-0.5">
                    {filteredEmojis.map((emoji, i) => (
                        <button
                            key={i}
                            onClick={() => onSelect(emoji)}
                            className="w-9 h-9 flex items-center justify-center text-xl rounded-lg hover:bg-white/8 transition-all active:scale-90"
                        >
                            {emoji}
                        </button>
                    ))}
                    {filteredEmojis.length === 0 && (
                        <div className="col-span-8 py-8 text-center text-zinc-600 text-xs">No results</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
