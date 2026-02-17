import io from "socket.io-client";
import { SOCKET_BASE } from "./constants";

export const socketConnection = (userId) => {
    return io(SOCKET_BASE, {
        path: "/api/socket.io",
        query: { userId },
        reconnection: true,
    });
};
