export interface User {
    id: string;
    name: string;
    avatar: string;
    status: string;
    online: boolean;
}

export type MessageType = "text" | "image" | "file" | "voice";
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
    contentUrl?: string; // For images, files, voice
    fileName?: string;
    duration?: number; // For voice messages
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

export interface ChatState {
    currentUser: User;
    chats: Chat[];
    messages: Message[];
    stories: Story[];
    activeChatId: string | null;
    onlineUsers: string[];
    typingUsers: string[];
    unreadCounts: Record<string, number>;
    notificationCount: number;
    replyingTo: Message | null;

    // Notification State
    notifications: Notification[];
    notificationPermission: NotificationPermissionStatus;
    fcmToken: string | null;
    deviceToken: string | null;
    isNotificationCenterOpen: boolean;

    // Actions
    setActiveChat: (chatId: string | null) => void;
    sendMessage: (text: string, type?: MessageType, optional?: any) => void;
    setTyping: (userId: string, isTyping: boolean) => void;
    setReplyingTo: (message: Message | null) => void;
    deleteMessage: (messageId: string) => void;
    markAsRead: (chatId: string) => void;

    // Story Actions
    markStoryViewed: (storyId: string) => void;

    // Notification Actions
    setNotificationPermission: (status: NotificationPermissionStatus) => void;
    setFcmToken: (token: string | null) => void;
    setDeviceToken: (token: string | null) => void;
    markNotificationAsRead: (notificationId: string) => void;
    toggleNotificationCenter: () => void;
    addInAppNotification: (notification: Notification) => void;
}
