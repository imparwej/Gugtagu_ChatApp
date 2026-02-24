import { create } from "zustand";
import { ChatState, Message, Chat, User, Notification } from "../types/chat";

const MOCK_CURRENT_USER: User = {
    id: "me",
    name: "Me",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Profile",
    status: "Active",
    online: true,
};

const MOCK_CHATS: Chat[] = [
    {
        id: "1",
        name: "Aman Gupta",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman",
        lastMessage: "Let's catch up tomorrow!",
        timestamp: "10:30 PM",
        online: true,
        unreadCount: 2,
    },
    {
        id: "2",
        name: "Sarah Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        lastMessage: "The design looks crisp.",
        timestamp: "Yesterday",
        online: false,
        unreadCount: 0,
    },
];

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "n1",
        type: "message",
        title: "Aman Gupta",
        body: "Hey! Let's catch up tomorrow!",
        senderId: "1",
        chatId: "1",
        timestamp: "10:30 PM",
        read: false,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman",
    },
    {
        id: "n2",
        type: "system",
        title: "Security Update",
        body: "Your password was changed successfully.",
        timestamp: "Yesterday",
        read: true,
    }
];

const MOCK_MESSAGES: Message[] = [
    {
        id: "m1",
        chatId: "1",
        senderId: "1",
        text: "Hey! How's the project going?",
        timestamp: "10:00 PM",
        type: "received",
        status: "read",
    },
    {
        id: "m2",
        chatId: "1",
        senderId: "me",
        text: "It's going great. Just finished the layout.",
        timestamp: "10:01 PM",
        type: "sent",
        status: "read",
    },
];

export const useChatStore = create<ChatState>((set) => ({
    currentUser: MOCK_CURRENT_USER,
    chats: MOCK_CHATS,
    messages: MOCK_MESSAGES,
    activeChatId: null,
    onlineUsers: ["1"],
    typingUsers: [],
    unreadCounts: { "1": 2 },
    notificationCount: 1, // Start with 1 unread notification
    replyingTo: null,

    // Notification State
    notifications: MOCK_NOTIFICATIONS,
    notificationPermission: "default",
    fcmToken: null,
    deviceToken: null,
    isNotificationCenterOpen: false,

    setActiveChat: (chatId) =>
        set((state) => {
            if (!chatId) return { activeChatId: null, replyingTo: null, isNotificationCenterOpen: false };

            // Simulate typing when switching
            const isNewChat = state.activeChatId !== chatId;
            if (isNewChat) {
                setTimeout(() => {
                    set((s) => ({ typingUsers: [...s.typingUsers, chatId] }));
                    setTimeout(() => {
                        set((s) => ({
                            typingUsers: s.typingUsers.filter((id) => id !== chatId),
                        }));
                    }, 3000);
                }, 500);
            }

            return {
                activeChatId: chatId,
                unreadCounts: { ...state.unreadCounts, [chatId]: 0 },
                replyingTo: null,
                isNotificationCenterOpen: false, // Close center when opening chat
            };
        }),

    sendMessage: (text) =>
        set((state) => {
            if (!state.activeChatId) return state;

            const newMessage: Message = {
                id: Math.random().toString(36).substring(7),
                chatId: state.activeChatId,
                senderId: "me",
                text,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                type: "sent",
                status: "sent",
                replyTo: state.replyingTo || undefined,
            };

            return {
                messages: [...state.messages, newMessage],
                replyingTo: null,
                chats: state.chats.map((c) =>
                    c.id === state.activeChatId ? { ...c, lastMessage: text } : c
                ),
            };
        }),

    setTyping: (userId, isTyping) =>
        set((state) => ({
            typingUsers: isTyping
                ? [...state.typingUsers, userId]
                : state.typingUsers.filter((id) => id !== userId),
        })),

    setReplyingTo: (message) => set({ replyingTo: message }),

    deleteMessage: (messageId) =>
        set((state) => ({
            messages: state.messages.filter((m) => m.id !== messageId),
        })),

    // Notification Actions
    setNotificationPermission: (status) => set({ notificationPermission: status }),
    setFcmToken: (token) => set({ fcmToken: token }),
    setDeviceToken: (token) => set({ deviceToken: token }),
    markNotificationAsRead: (notificationId) =>
        set((state) => {
            const updatedNotifications = state.notifications.map((n) =>
                n.id === notificationId ? { ...n, read: true } : n
            );
            return {
                notifications: updatedNotifications,
                notificationCount: updatedNotifications.filter((n) => !n.read).length,
            };
        }),
    toggleNotificationCenter: () =>
        set((state) => ({ isNotificationCenterOpen: !state.isNotificationCenterOpen })),
}));
