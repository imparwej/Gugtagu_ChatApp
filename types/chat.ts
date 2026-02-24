export interface User {
    id: string;
    name: string;
    avatar: string;
    status: string;
    online: boolean;
}

export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    text: string;
    timestamp: string;
    type: "sent" | "received";
    status: "sent" | "delivered" | "read";
    replyTo?: Message;
}

export interface Chat {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    online: boolean;
    unreadCount: number;
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

    setActiveChat: (chatId: string | null) => void;
    sendMessage: (text: string) => void;
    setTyping: (userId: string, isTyping: boolean) => void;
    setReplyingTo: (message: Message | null) => void;
    deleteMessage: (messageId: string) => void;

    // Notification Actions
    setNotificationPermission: (status: NotificationPermissionStatus) => void;
    setFcmToken: (token: string | null) => void;
    setDeviceToken: (token: string | null) => void;
    markNotificationAsRead: (notificationId: string) => void;
    toggleNotificationCenter: () => void;
}
