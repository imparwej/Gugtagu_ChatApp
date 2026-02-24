import { create } from "zustand";
import {
    ChatState, Message, Chat, User, Notification, Story,
    SectionType, Call, PrivacySettings, ChatSettings, NotificationSettings, MessageType
} from "../types/chat";

const MOCK_CURRENT_USER: User = {
    id: "me",
    name: "mdparwej",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mdparwej",
    status: "Available",
    online: true,
    phone: "+91 98765 43210",
    about: "Hey there! I am using Guftagu."
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
        isPinned: true,
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
    {
        id: "g1",
        name: "Project Alpha",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alpha",
        lastMessage: "Meeting at 5?",
        timestamp: "12:00 PM",
        online: true,
        unreadCount: 5,
        isGroup: true,
        members: [
            { id: "1", name: "Aman Gupta", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman", status: "", online: true },
            { id: "2", name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", status: "", online: false },
        ],
        admins: ["1"]
    },
    {
        id: "3",
        name: "John Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        lastMessage: "Got the files.",
        timestamp: "8:45 AM",
        online: false,
        unreadCount: 0,
        isArchived: true,
    }
];

const MOCK_STORIES: Story[] = [
    {
        id: "s1",
        userId: "1",
        userName: "Aman Gupta",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman",
        mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
        timestamp: "2h ago",
        viewed: false,
    },
    {
        id: "s2",
        userId: "2",
        userName: "Sarah Chen",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        mediaUrl: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1000",
        timestamp: "5h ago",
        viewed: true,
    }
];

const MOCK_CALLS: Call[] = [
    {
        id: "c1",
        userId: "1",
        userName: "Aman Gupta",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman",
        type: "voice",
        status: "incoming",
        timestamp: "Today, 10:45 PM",
        duration: "05:23"
    },
    {
        id: "c2",
        userId: "2",
        userName: "Sarah Chen",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        type: "video",
        status: "missed",
        timestamp: "Yesterday, 2:15 PM"
    }
];

const MOCK_MESSAGES: Message[] = [
    {
        id: "m1",
        chatId: "1",
        senderId: "1",
        text: "Hey! How's the project going?",
        timestamp: "10:00 PM",
        type: "text",
        status: "read",
    },
    {
        id: "m2",
        chatId: "1",
        senderId: "me",
        text: "It's going great. Just finished the layout.",
        timestamp: "10:01 PM",
        type: "text",
        status: "read",
    },
];

export const useChatStore = create<ChatState>((set, get) => ({
    currentUser: MOCK_CURRENT_USER,
    chats: MOCK_CHATS,
    messages: MOCK_MESSAGES,
    stories: MOCK_STORIES,
    calls: MOCK_CALLS,
    activeChatId: null,
    activeSection: "chats",
    activeOverlay: "none",
    activeSettingsSubpage: "none",
    onlineUsers: ["1"],
    typingUsers: [],
    unreadCounts: { "1": 2, "g1": 5 },
    notificationCount: 1,
    replyingTo: null,
    blockedUsers: [],

    // Settings
    privacySettings: {
        lastSeen: "everyone",
        profilePhoto: "everyone",
        about: "everyone",
        readReceipts: true,
    },
    chatSettings: {
        wallpaper: "default",
        fontSize: "medium",
        enterToSend: true,
        archiveChats: false,
    },
    notificationSettings: {
        messages: true,
        groups: true,
        sounds: "default",
        vibration: true,
        previews: true,
    },

    // Notification State
    notifications: [],
    notificationPermission: "default",
    fcmToken: null,
    deviceToken: null,
    isNotificationCenterOpen: false,

    setActiveChat: (chatId) =>
        set((state) => {
            if (!chatId) return { activeChatId: null, replyingTo: null, isNotificationCenterOpen: false, activeOverlay: "none" };

            const isNewChat = state.activeChatId !== chatId;
            if (isNewChat) {
                // Mark as read in store
                const unreadCounts = { ...state.unreadCounts, [chatId]: 0 };

                // Simulation: Typing indicator
                setTimeout(() => {
                    set((s) => ({ typingUsers: [...s.typingUsers, chatId] }));
                    setTimeout(() => {
                        set((s) => ({
                            typingUsers: s.typingUsers.filter((id) => id !== chatId),
                        }));
                    }, 3000);
                }, 500);

                return {
                    activeChatId: chatId,
                    unreadCounts,
                    isNotificationCenterOpen: false,
                    replyingTo: null,
                    activeOverlay: "none"
                };
            }
            return { activeChatId: chatId, isNotificationCenterOpen: false, activeOverlay: "none" };
        }),

    setActiveSection: (section) => set({ activeSection: section, activeOverlay: "none" }),
    setOverlay: (overlay) => set({ activeOverlay: overlay }),
    setSettingsSubpage: (subpage) => set({ activeSettingsSubpage: subpage }),

    sendMessage: (text: string, type: MessageType = "text", optional: any = {}) => {
        const state = get();
        if (!state.activeChatId) return;

        const messageId = Math.random().toString(36).substring(7);
        const newMessage: Message = {
            id: messageId,
            chatId: state.activeChatId,
            senderId: "me",
            text,
            timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            type,
            status: "sent",
            replyTo: state.replyingTo || undefined,
            ...optional
        };

        set((state) => ({
            messages: [...state.messages, newMessage],
            replyingTo: null,
            chats: state.chats.map((c) =>
                c.id === state.activeChatId ? { ...c, lastMessage: type === "text" ? text : `[${type}]` } : c
            ),
        }));

        // Status Lifecycle Simulation
        setTimeout(() => {
            set((state) => ({
                messages: state.messages.map(m => m.id === messageId ? { ...m, status: "delivered" } : m)
            }));
            setTimeout(() => {
                set((state) => ({
                    messages: state.messages.map(m => m.id === messageId ? { ...m, status: "read" } : m)
                }));
            }, 2000);
        }, 1000);
    },

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

    markAsRead: (chatId) =>
        set((state) => ({
            unreadCounts: { ...state.unreadCounts, [chatId]: 0 }
        })),

    toggleArchive: (chatId) =>
        set((state) => ({
            chats: state.chats.map(c => c.id === chatId ? { ...c, isArchived: !c.isArchived } : c)
        })),

    togglePin: (chatId) =>
        set((state) => ({
            chats: state.chats.map(c => c.id === chatId ? { ...c, isPinned: !c.isPinned } : c)
        })),

    markStoryViewed: (storyId) =>
        set((state) => ({
            stories: state.stories.map(s => s.id === storyId ? { ...s, viewed: true } : s)
        })),

    addCall: (call) =>
        set((state) => ({
            calls: [call, ...state.calls]
        })),

    updatePrivacySettings: (settings) =>
        set((state) => ({
            privacySettings: { ...state.privacySettings, ...settings }
        })),

    updateChatSettings: (settings) =>
        set((state) => ({
            chatSettings: { ...state.chatSettings, ...settings }
        })),

    updateNotificationSettings: (settings) =>
        set((state) => ({
            notificationSettings: { ...state.notificationSettings, ...settings }
        })),

    updateProfile: (data) =>
        set((state) => ({
            currentUser: { ...state.currentUser, ...data }
        })),

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

    addInAppNotification: (notification) =>
        set((state) => ({
            notifications: [notification, ...state.notifications],
            notificationCount: state.notificationCount + 1
        })),
}));
