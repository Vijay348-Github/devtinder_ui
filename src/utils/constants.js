export const API_BASE =
    location.hostname === "localhost"
        ? "http://localhost:3000"
        : "/api";

export const SOCKET_BASE =
    location.hostname === "localhost"
        ? "http://localhost:3000"
        : "";
