export interface User {
    id: string;
    name: string;
    avatar: string;
    status: string;
    online: boolean;
    phone?: string;
    about?: string;
}

export type MessageType = "text" | "image" | "video" | "file" | "voice" | "location" | "contact";
export type MessageStatus = "sent" | "delivered" | "read";

export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    senderName?: string; // For group chats
    text?: string;
    timestamp: string;
    type: MessageType;
    status: MessageStatus;
    replyTo?: Message;
    contentUrl?: string; // For images, videos, files, voice
    fileName?: string;
    duration?: number; // For voice/video
    location?: {
        lat: number;
        lng: number;
        address: string;
    };
    contact?: {
        name: string;
        phone: string;
    };
}

export interface Chat {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    online: boolean;
    unreadCount: number;
    isGroup?: boolean;
    isArchived?: boolean;
    isPinned?: boolean;
    members?: User[];
    admins?: string[]; // IDs
}

export interface Story {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    mediaUrl: string;
    timestamp: string;
    viewed: boolean;
}

export type CallType = "voice" | "video";
export type CallStatus = "missed" | "incoming" | "outgoing";

export interface Call {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    type: CallType;
    status: CallStatus;
    timestamp: string;
    duration?: string;
}

export type SectionType = "chats" | "status" | "calls" | "settings";

export interface PrivacySettings {
    lastSeen: "everyone" | "contacts" | "nobody";
    profilePhoto: "everyone" | "contacts" | "nobody";
    about: "everyone" | "contacts" | "nobody";
    readReceipts: boolean;
}

export interface ChatSettings {
    wallpaper: string;
    fontSize: "small" | "medium" | "large";
    enterToSend: boolean;
    archiveChats: boolean;
}

export interface NotificationSettings {
    messages: boolean;
    groups: boolean;
    sounds: string;
    vibration: boolean;
    previews: boolean;
}

export interface Notification {
    id: string;
    type: "message" | "system" | "update";
    title: string;
    body: string;
    senderId?: string;
    chatId?: string;
    timestamp: string;
    read: boolean;
    avatar?: string;
}

export type NotificationPermissionStatus = "default" | "granted" | "denied";

export type OverlayType = "camera" | "attachment" | "gallery" | "emoji" | "none";
export type SettingsSubpage = "profile" | "account" | "privacy" | "chats" | "notifications" | "storage" | "none";

export interface ChatState {
    currentUser: User;
    chats: Chat[];
    messages: Message[];
    stories: Story[];
    calls: Call[];
    activeChatId: string | null;
    activeSection: SectionType;
    activeOverlay: OverlayType;
    activeSettingsSubpage: SettingsSubpage;
    onlineUsers: string[];
    typingUsers: string[];
    unreadCounts: Record<string, number>;
    notificationCount: number;
    replyingTo: Message | null;
    blockedUsers: string[];

    // Settings
    privacySettings: PrivacySettings;
    chatSettings: ChatSettings;
    notificationSettings: NotificationSettings;

    // Notification State
    notifications: Notification[];
    notificationPermission: NotificationPermissionStatus;
    fcmToken: string | null;
    deviceToken: string | null;
    isNotificationCenterOpen: boolean;

    // Actions
    setActiveChat: (chatId: string | null) => void;
    setActiveSection: (section: SectionType) => void;
    setOverlay: (overlay: OverlayType) => void;
    setSettingsSubpage: (subpage: SettingsSubpage) => void;
    setTyping: (userId: string, isTyping: boolean) => void;
    setReplyingTo: (message: Message | null) => void;
    sendMessage: (text: string, type?: MessageType, optional?: any) => void;
    deleteMessage: (messageId: string) => void;
    markAsRead: (chatId: string) => void;
    toggleArchive: (chatId: string) => void;
    togglePin: (chatId: string) => void;

    // Story Actions
    markStoryViewed: (storyId: string) => void;

    // Call Actions
    addCall: (call: Call) => void;

    // Settings Actions
    updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
    updateChatSettings: (settings: Partial<ChatSettings>) => void;
    updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
    updateProfile: (data: Partial<User>) => void;

    // Notification Actions
    setNotificationPermission: (status: NotificationPermissionStatus) => void;
    setFcmToken: (token: string | null) => void;
    setDeviceToken: (token: string | null) => void;
    markNotificationAsRead: (notificationId: string) => void;
    toggleNotificationCenter: () => void;
    addInAppNotification: (notification: Notification) => void;
}
