"use client";

import React, { useEffect, useRef } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageBubble, TypingIndicator } from "@/components/chat/MessageBubble";
import { MessageInput } from "@/components/chat/MessageInput";
import { NotificationPermissionModal } from "@/components/notifications/NotificationPermissionModal";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { useChatStore } from "@/store/chatStore";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";

export default function Home() {
  const { messages, activeChatId, typingUsers } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeMessages = messages.filter((m) => m.chatId === activeChatId);
  const isTyping = activeChatId && typingUsers.includes(activeChatId);

  // Auto-scroll to bottom with smooth behavior
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [activeMessages, isTyping, activeChatId]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#000000] text-white">
      {/* Global Modals & Notifications */}
      <NotificationPermissionModal />
      <NotificationCenter />

      {/* Sidebar Container */}
      <aside className="hidden w-[30%] border-r border-white/5 bg-[#0f0f0f] md:block h-full">
        <Sidebar />
      </aside>

      {/* Chat Area Container */}
      <main className="flex-1 flex flex-col h-full bg-[#000000] relative">
        <AnimatePresence mode="wait">
          {!activeChatId ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col items-center justify-center p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black"
            >
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl flex flex-col items-center text-center max-w-sm">
                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                  <MessageSquare size={40} className="text-white/20" />
                </div>
                <h2 className="text-2xl font-bold mb-2 tracking-tight">Select a conversation</h2>
                <p className="text-zinc-500 text-sm font-light">
                  Choose a chat from the sidebar to start messaging your friends and colleagues.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              <ChatHeader />

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar"
              >
                <div className="max-w-4xl mx-auto flex flex-col pt-4">
                  {activeMessages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      msg={msg}
                    />
                  ))}

                  {isTyping && (
                    <div className="mt-2 text-left">
                      <TypingIndicator />
                    </div>
                  )}
                </div>
              </div>

              <MessageInput />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
