import { create } from "zustand";
import {
    ChatState, Message, Chat, User, Notification, Story,
    SectionType, Call, PrivacySettings, ChatSettings, NotificationSettings, MessageType, CallType
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
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AmanG",
        lastMessage: "Let's catch up tomorrow! 🔥",
        timestamp: "10:30 PM",
        online: true,
        unreadCount: 3,
        isPinned: true,
        about: "Product Designer @ Startup",
    },
    {
        id: "2",
        name: "Sarah Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahC",
        lastMessage: "The design looks crisp.",
        timestamp: "Yesterday",
        online: false,
        unreadCount: 0,
        about: "Frontend Engineer",
    },
    {
        id: "g1",
        name: "Project Alpha",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ProjectAlpha",
        lastMessage: "Aman: Meeting at 5?",
        timestamp: "12:00 PM",
        online: true,
        unreadCount: 5,
        isGroup: true,
        about: "Team collaboration group for Project Alpha.",
        members: [
            { id: "1", name: "Aman Gupta", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AmanG", status: "Designer", online: true },
            { id: "2", name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahC", status: "Engineer", online: false },
            { id: "me", name: "mdparwej", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mdparwej", status: "Available", online: true },
            { id: "4", name: "Rohan Mehta", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RohanM", status: "Dev", online: false },
        ],
        admins: ["1", "me"]
    },
    {
        id: "3",
        name: "John Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JohnD",
        lastMessage: "📎 Document shared",
        timestamp: "8:45 AM",
        online: false,
        unreadCount: 0,
        isArchived: true,
    },
    {
        id: "4",
        name: "Priya Sharma",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaS",
        lastMessage: "📍 Location shared",
        timestamp: "Mon",
        online: true,
        unreadCount: 1,
    },
    {
        id: "5",
        name: "Dev Squad",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DevSquad",
        lastMessage: "Sarah: Pushed the new build!",
        timestamp: "Sun",
        online: true,
        unreadCount: 0,
        isGroup: true,
        members: [
            { id: "1", name: "Aman Gupta", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AmanG", status: "", online: true },
            { id: "2", name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahC", status: "", online: false },
            { id: "me", name: "mdparwej", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mdparwej", status: "", online: true },
        ],
        admins: ["me"]
    }
];

const MOCK_MESSAGES: Message[] = [
    // Chat 1 - Aman
    { id: "m1", chatId: "1", senderId: "1", text: "Hey! How's the project going?", timestamp: "10:00 PM", type: "text", status: "read" },
    { id: "m2", chatId: "1", senderId: "me", text: "It's going great. Just finished the layout.", timestamp: "10:01 PM", type: "text", status: "read" },
    { id: "m3", chatId: "1", senderId: "1", text: "That's awesome! Can you share a screenshot?", timestamp: "10:02 PM", type: "text", status: "read" },
    { id: "m4", chatId: "1", senderId: "me", text: "", timestamp: "10:05 PM", type: "image", status: "read", contentUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" },
    { id: "m5", chatId: "1", senderId: "1", text: "Looks sharp! Love the dark theme.", timestamp: "10:06 PM", type: "text", status: "read" },
    { id: "m6", chatId: "1", senderId: "me", text: "", timestamp: "10:08 PM", type: "voice", status: "read", duration: 12 },
    { id: "m7", chatId: "1", senderId: "1", text: "Let's catch up tomorrow! 🔥", timestamp: "10:30 PM", type: "text", status: "read" },
    { id: "m8", chatId: "1", senderId: "me", text: "Sure! I'll send the location.", timestamp: "10:31 PM", type: "text", status: "delivered" },
    { id: "m9", chatId: "1", senderId: "me", text: "", timestamp: "10:31 PM", type: "location", status: "sent", location: { lat: 28.6139, lng: 77.2090, address: "India Gate, New Delhi" } },

    // Chat 2 - Sarah
    { id: "m10", chatId: "2", senderId: "2", text: "Did you review the Figma file?", timestamp: "Yesterday", type: "text", status: "read" },
    { id: "m11", chatId: "2", senderId: "me", text: "Yes! The design looks crisp.", timestamp: "Yesterday", type: "text", status: "read" },
    { id: "m12", chatId: "2", senderId: "2", text: "", timestamp: "Yesterday", type: "file", status: "read", fileName: "Design_v3_Final.pdf", contentUrl: "#" },
    { id: "m13", chatId: "2", senderId: "me", text: "Got it. Reviewing now.", timestamp: "Yesterday", type: "text", status: "read" },
    { id: "m14", chatId: "2", senderId: "2", text: "The design looks crisp.", timestamp: "Yesterday", type: "text", status: "read" },

    // Group g1
    { id: "m15", chatId: "g1", senderId: "1", senderName: "Aman Gupta", text: "Hey team! Sprint planning at 5 PM?", timestamp: "11:00 AM", type: "text", status: "read" },
    { id: "m16", chatId: "g1", senderId: "2", senderName: "Sarah Chen", text: "Works for me 👍", timestamp: "11:02 AM", type: "text", status: "read" },
    { id: "m17", chatId: "g1", senderId: "me", text: "I'll be there.", timestamp: "11:05 AM", type: "text", status: "read" },
    { id: "m18", chatId: "g1", senderId: "1", senderName: "Aman Gupta", text: "Great! Meeting at 5?", timestamp: "12:00 PM", type: "text", status: "read" },

    // Chat 4 - Priya
    { id: "m19", chatId: "4", senderId: "4", text: "Hey are you free this weekend?", timestamp: "Mon", type: "text", status: "read" },
    { id: "m20", chatId: "4", senderId: "me", text: "Probably Sunday! What's up?", timestamp: "Mon", type: "text", status: "read" },
    { id: "m21", chatId: "4", senderId: "4", text: "", timestamp: "Mon", type: "contact", status: "read", contact: { name: "Vikram Seth", phone: "+91 99887 76655" } },
    { id: "m22", chatId: "4", senderId: "4", text: "", timestamp: "Mon", type: "location", status: "delivered", location: { lat: 19.0760, lng: 72.8777, address: "Bandra, Mumbai" } },
];

const MOCK_STORIES: Story[] = [
    {
        id: "s1", userId: "1", userName: "Aman Gupta",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AmanG",
        mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
        timestamp: "2h ago", viewed: false, caption: "Working on the new UI 🎨"
    },
    {
        id: "s2", userId: "1", userName: "Aman Gupta",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AmanG",
        mediaUrl: "https://images.unsplash.com/photo-1545670723-196ed0954986?auto=format&fit=crop&q=80&w=1000",
        timestamp: "3h ago", viewed: false, caption: "Design sprint day 2"
    },
    {
        id: "s3", userId: "2", userName: "Sarah Chen",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahC",
        mediaUrl: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1000",
        timestamp: "5h ago", viewed: true, caption: "Coffee + code ☕"
    },
    {
        id: "s4", userId: "4", userName: "Priya Sharma",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaS",
        mediaUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1000",
        timestamp: "8h ago", viewed: false, caption: "Goa trip vibes 🌊"
    },
    {
        id: "s5", userId: "4", userName: "Priya Sharma",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaS",
        mediaUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000",
        timestamp: "9h ago", viewed: false, caption: "Sunset 🌅"
    },
];

const MOCK_CALLS: Call[] = [
    { id: "c1", userId: "1", userName: "Aman Gupta", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AmanG", type: "voice", status: "incoming", timestamp: "10:45 PM", duration: "05:23", dateLabel: "Today" },
    { id: "c2", userId: "2", userName: "Sarah Chen", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahC", type: "video", status: "missed", timestamp: "2:15 PM", dateLabel: "Today" },
    { id: "c3", userId: "4", userName: "Priya Sharma", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaS", type: "voice", status: "outgoing", timestamp: "9:00 AM", duration: "02:10", dateLabel: "Today" },
    { id: "c4", userId: "1", userName: "Aman Gupta", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AmanG", type: "video", status: "incoming", timestamp: "3:30 PM", duration: "12:44", dateLabel: "Yesterday" },
    { id: "c5", userId: "2", userName: "Sarah Chen", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahC", type: "voice", status: "missed", timestamp: "11:20 AM", dateLabel: "Yesterday" },
    { id: "c6", userId: "4", userName: "Priya Sharma", userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaS", type: "voice", status: "outgoing", timestamp: "Mon, 6:00 PM", duration: "08:30", dateLabel: "Monday" },
];

export const useChatStore = create<ChatState>((set, get) => ({
    isLoggedIn: false,
    currentUser: MOCK_CURRENT_USER,
    chats: MOCK_CHATS,
    messages: MOCK_MESSAGES,
    stories: MOCK_STORIES,
    calls: MOCK_CALLS,
    activeChatId: null,
    activeSection: "chats",
    activeOverlay: "none",
    activeSettingsSubpage: "none",
    onlineUsers: ["1", "4"],
    typingUsers: [],
    unreadCounts: { "1": 3, "g1": 5, "4": 1 },
    notificationCount: 1,
    replyingTo: null,
    blockedUsers: [],
    activeCallTarget: null,
    inChatSearch: false,
    chatSearchQuery: "",

    privacySettings: {
        lastSeen: "everyone",
        profilePhoto: "everyone",
        about: "everyone",
        readReceipts: true,
        twoStepVerification: false,
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
        calls: true,
        sounds: "default",
        vibration: true,
        previews: true,
    },

    notifications: [],
    notificationPermission: "default",
    fcmToken: null,
    deviceToken: null,
    isNotificationCenterOpen: false,

    setLoggedIn: (v) => set({ isLoggedIn: v }),

    setActiveChat: (chatId) =>
        set((state) => {
            if (!chatId) return { activeChatId: null, replyingTo: null, isNotificationCenterOpen: false, activeOverlay: "none", inChatSearch: false, chatSearchQuery: "" };

            const isNewChat = state.activeChatId !== chatId;
            if (isNewChat) {
                const unreadCounts = { ...state.unreadCounts, [chatId]: 0 };
                setTimeout(() => {
                    set((s) => ({ typingUsers: [...s.typingUsers, chatId] }));
                    setTimeout(() => {
                        set((s) => ({ typingUsers: s.typingUsers.filter((id) => id !== chatId) }));
                    }, 3000);
                }, 800);
                return { activeChatId: chatId, unreadCounts, isNotificationCenterOpen: false, replyingTo: null, activeOverlay: "none", inChatSearch: false, chatSearchQuery: "" };
            }
            return { activeChatId: chatId, isNotificationCenterOpen: false, activeOverlay: "none" };
        }),

    setActiveSection: (section) => set({ activeSection: section, activeOverlay: "none", inChatSearch: false, chatSearchQuery: "" }),
    setOverlay: (overlay) => set({ activeOverlay: overlay }),
    setSettingsSubpage: (subpage) => set({ activeSettingsSubpage: subpage }),

    sendMessage: (text: string, type: MessageType = "text", optional: any = {}) => {
        const state = get();
        if (!state.activeChatId) return;

        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const newMessage: Message = {
            id: messageId,
            chatId: state.activeChatId,
            senderId: "me",
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type,
            status: "sent",
            replyTo: state.replyingTo || undefined,
            ...optional
        };

        set((state) => ({
            messages: [...state.messages, newMessage],
            replyingTo: null,
            chats: state.chats.map((c) =>
                c.id === state.activeChatId
                    ? { ...c, lastMessage: type === "text" ? text : `[${type}]`, timestamp: "Now" }
                    : c
            ),
        }));

        setTimeout(() => {
            set((s) => ({ messages: s.messages.map(m => m.id === messageId ? { ...m, status: "delivered" } : m) }));
            setTimeout(() => {
                set((s) => ({ messages: s.messages.map(m => m.id === messageId ? { ...m, status: "read" } : m) }));
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
        set((state) => ({ messages: state.messages.filter((m) => m.id !== messageId) })),

    markAsRead: (chatId) =>
        set((state) => ({ unreadCounts: { ...state.unreadCounts, [chatId]: 0 } })),

    toggleArchive: (chatId) =>
        set((state) => ({ chats: state.chats.map(c => c.id === chatId ? { ...c, isArchived: !c.isArchived } : c) })),

    togglePin: (chatId) =>
        set((state) => ({ chats: state.chats.map(c => c.id === chatId ? { ...c, isPinned: !c.isPinned } : c) })),

    toggleMute: (chatId) =>
        set((state) => ({ chats: state.chats.map(c => c.id === chatId ? { ...c, isMuted: !c.isMuted } : c) })),

    toggleDisappearing: (chatId) =>
        set((state) => ({ chats: state.chats.map(c => c.id === chatId ? { ...c, isDisappearing: !c.isDisappearing } : c) })),

    clearChat: (chatId) =>
        set((state) => ({ messages: state.messages.filter(m => m.chatId !== chatId) })),

    deleteChat: (chatId) =>
        set((state) => ({
            chats: state.chats.filter(c => c.id !== chatId),
            messages: state.messages.filter(m => m.chatId !== chatId),
            activeChatId: state.activeChatId === chatId ? null : state.activeChatId,
        })),

    toggleStarMessage: (messageId) =>
        set((state) => ({
            messages: state.messages.map(m => m.id === messageId ? { ...m, isStarred: !m.isStarred } : m)
        })),

    setInChatSearch: (v) => set({ inChatSearch: v, chatSearchQuery: v ? get().chatSearchQuery : "" }),
    setChatSearchQuery: (q) => set({ chatSearchQuery: q }),

    startCall: (target) => set({ activeCallTarget: target, activeOverlay: "call" }),
    endCall: () => set({ activeCallTarget: null, activeOverlay: "none" }),

    addGroupMember: (chatId, user) =>
        set((state) => ({
            chats: state.chats.map(c =>
                c.id === chatId
                    ? { ...c, members: [...(c.members || []), user] }
                    : c
            )
        })),

    removeGroupMember: (chatId, userId) =>
        set((state) => ({
            chats: state.chats.map(c =>
                c.id === chatId
                    ? { ...c, members: (c.members || []).filter(m => m.id !== userId) }
                    : c
            )
        })),

    exitGroup: (chatId) =>
        set((state) => ({
            chats: state.chats.filter(c => c.id !== chatId),
            activeChatId: state.activeChatId === chatId ? null : state.activeChatId,
        })),

    markStoryViewed: (storyId) =>
        set((state) => ({ stories: state.stories.map(s => s.id === storyId ? { ...s, viewed: true } : s) })),

    addCall: (call) =>
        set((state) => ({ calls: [call, ...state.calls] })),

    updatePrivacySettings: (settings) =>
        set((state) => ({ privacySettings: { ...state.privacySettings, ...settings } })),

    updateChatSettings: (settings) =>
        set((state) => ({ chatSettings: { ...state.chatSettings, ...settings } })),

    updateNotificationSettings: (settings) =>
        set((state) => ({ notificationSettings: { ...state.notificationSettings, ...settings } })),

    updateProfile: (data) =>
        set((state) => ({ currentUser: { ...state.currentUser, ...data } })),

    blockUser: (userId) =>
        set((state) => ({ blockedUsers: [...state.blockedUsers, userId] })),

    unblockUser: (userId) =>
        set((state) => ({ blockedUsers: state.blockedUsers.filter(id => id !== userId) })),

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

    markAllNotificationsAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            notificationCount: 0
        })),

    clearNotifications: () =>
        set({ notifications: [], notificationCount: 0 }),

    toggleNotificationCenter: () =>
        set((state) => ({ isNotificationCenterOpen: !state.isNotificationCenterOpen })),

    addInAppNotification: (notification) =>
        set((state) => ({
            notifications: [notification, ...state.notifications],
            notificationCount: state.notificationCount + 1
        })),
}));
