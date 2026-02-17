import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const socketConnection = (userId) => {
    return io(BASE_URL, {
        path: "/api/socket.io",
        query: { userId },
        reconnection: true,
    });
};
