/**
 * Socket.io / WebSocket configuration placeholder.
 * Use this file to manage real-time event listeners and connections.
 */

// import { io, Socket } from "socket.io-client";

interface SocketStubs {
    connect: () => void;
    disconnect: () => void;
    emit: (event: string, data: any) => void;
    on: (event: string, callback: (data: any) => void) => void;
}

/**
 * Placeholder for the backend WebSocket URL.
 * In production, this would be process.env.NEXT_PUBLIC_WS_URL.
 */
const SOCKET_URL = "http://localhost:3001";

/**
 * Instance stub for global socket management.
 */
let socket: any = null;

export const connectSocket = () => {
    console.log("[Socket] Connecting to:", SOCKET_URL);
    // socket = io(SOCKET_URL);
    // socket.on("connect", () => console.log("[Socket] Connected"));
};

export const disconnectSocket = () => {
    if (socket) {
        console.log("[Socket] Disconnecting...");
        // socket.disconnect();
    }
};

export const getSocket = () => socket;
