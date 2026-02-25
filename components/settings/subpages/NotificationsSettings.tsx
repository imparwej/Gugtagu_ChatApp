"use client";

import React from "react";
import { useChatStore } from "../../../store/chatStore";
import { Bell, MessageSquare, Users, Phone, Music, Smartphone, Eye, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

const ToggleRow = ({ label, desc, value, onChange, icon: Icon }: { label: string; desc?: string; value: boolean; onChange: () => void; icon: any }) => (
    <div className="flex items-center justify-between py-5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01] transition-colors px-1 -mx-1">
        <div className="flex items-center gap-4 flex-1 pr-6">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500">
                <Icon size={14} />
            </div>
            <div className="flex-1">
                <p className="text-sm font-semibold text-white/90">{label}</p>
                {desc && <p className="text-[11px] text-zinc-600 mt-1 font-light leading-relaxed">{desc}</p>}
            </div>
        </div>
        <button onClick={onChange} className={`toggle-track ${value ? "on" : ""}`}>
            <div className="toggle-thumb" />
        </button>
    </div>
);

const SelectRow = ({ label, value, options, onChange, icon: Icon }: { label: string; value: string; options: string[]; onChange: (v: string) => void; icon: any }) => (
    <div className="flex items-center justify-between py-5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01] transition-colors px-1 -mx-1">
        <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500">
                <Icon size={14} />
            </div>
            <p className="text-sm font-semibold text-white/90">{label}</p>
        </div>
        <div className="relative">
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="bg-white/[0.06] border border-white/[0.08] hover:border-white/10 rounded-xl px-4 py-2 text-xs text-white/70 focus:outline-none appearance-none capitalize cursor-pointer transition-all"
            >
                {options.map(o => <option key={o} value={o} className="bg-[#111] capitalize">{o}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
                <Volume2 size={10} />
            </div>
        </div>
    </div>
);

export const NotificationsSettings = () => {
    const { notificationSettings, updateNotificationSettings } = useChatStore();

    return (
        <div className="h-full overflow-y-auto custom-scrollbar px-8 py-6 space-y-10">
            {/* Header section */}
            <div className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/[0.05] rounded-[2rem]">
                <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                        <Bell size={32} strokeWidth={1.5} />
                    </div>
                    {notificationSettings.messages && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-black"
                        />
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-black tracking-tight">Personalize Alerts</h3>
                    <p className="text-xs text-zinc-600 font-light mt-1">Manage how you're notified across devices.</p>
                </div>
            </div>

            {/* Message Notifications */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <MessageSquare size={14} className="text-zinc-500" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Messages</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl px-5 divide-y divide-white/[0.04]">
                    <ToggleRow
                        icon={Bell}
                        label="Message Notifications"
                        desc="Show notifications for individual chats"
                        value={notificationSettings.messages}
                        onChange={() => updateNotificationSettings({ messages: !notificationSettings.messages })}
                    />
                    <SelectRow
                        icon={Music}
                        label="Notification Tone"
                        value={notificationSettings.sounds}
                        options={["default", "silent", "classic", "modern", "chime"]}
                        onChange={(v) => updateNotificationSettings({ sounds: v as any })}
                    />
                    <SelectRow
                        icon={Smartphone}
                        label="Vibrate"
                        value={notificationSettings.vibration ? "default" : "off"}
                        options={["off", "default", "short", "long"]}
                        onChange={(v) => updateNotificationSettings({ vibration: v !== "off" })}
                    />
                </div>
            </div>

            {/* Group Notifications */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Users size={14} className="text-zinc-500" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Groups</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl px-5 divide-y divide-white/[0.04]">
                    <ToggleRow
                        icon={Bell}
                        label="Group Notifications"
                        desc="Show notifications for your group chats"
                        value={notificationSettings.groups}
                        onChange={() => updateNotificationSettings({ groups: !notificationSettings.groups })}
                    />
                    <SelectRow
                        icon={Music}
                        label="Group Tone"
                        value="classic" // Visual mock
                        options={["default", "silent", "classic", "playful"]}
                        onChange={() => { }}
                    />
                </div>
            </div>

            {/* Other Options */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Bell size={14} className="text-zinc-500" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Calls & Previews</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl px-5 divide-y divide-white/[0.04]">
                    <ToggleRow
                        icon={Phone}
                        label="Call Notifications"
                        value={notificationSettings.calls}
                        onChange={() => updateNotificationSettings({ calls: !notificationSettings.calls })}
                    />
                    <ToggleRow
                        icon={Eye}
                        label="Show Previews"
                        desc="Show message text inside notifications"
                        value={notificationSettings.previews}
                        onChange={() => updateNotificationSettings({ previews: !notificationSettings.previews })}
                    />
                </div>
            </div>

            <div className="pt-4">
                <button className="w-full py-5 bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] rounded-3xl text-sm font-bold text-zinc-400 hover:text-white transition-all">
                    Reset all notification settings
                </button>
            </div>
        </div>
    );
};
