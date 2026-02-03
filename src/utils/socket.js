import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const socketConnection = (userId) => {
  return io(BASE_URL, {
    query: { userId },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
  });
};
