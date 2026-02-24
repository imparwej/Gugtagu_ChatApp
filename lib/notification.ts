/**
 * Push Notification Utility (FCM/Web Push)
 * 
 * Use this file to handle:
 * 1. Requesting browser notification permissions.
 * 2. Fetching and storing FCM/Device tokens.
 * 3. Interacting with the Service Worker.
 */

export const requestNotificationPermission = async () => {
    console.log("[Notification] Requesting browser permission...");

    if (!("Notification" in window)) {
        console.warn("[Notification] This browser does not support notifications.");
        return "denied";
    }

    try {
        const permission = await Notification.requestPermission();
        console.log("[Notification] Permission status:", permission);
        return permission;
    } catch (error) {
        console.error("[Notification] Error requesting permission:", error);
        return "denied";
    }
};

export const getFCMToken = async () => {
    console.log("[Notification] Fetching FCM token from Firebase...");
    // Mock token for development preparation
    return "fcm_token_placeholder_" + Math.random().toString(36).substring(7);
};

export const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
        try {
            const registration = await navigator.serviceWorker.register("/sw.js");
            console.log("[ServiceWorker] Registered with scope:", registration.scope);
            return registration;
        } catch (error) {
            console.error("[ServiceWorker] Registration failed:", error);
        }
    }
};
