import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const socketConnection = (userId) => {
    return io(BASE_URL, {
        path:
            location.hostname === "localhost" ? "/socket.io" : "/api/socket.io",
        query: { userId },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
    });
};
