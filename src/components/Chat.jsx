import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

const Chat = () => {
    const { messagetoid } = useParams();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [receiver, setReceiver] = useState(null);
    const [isReceiverOnline, setIsReceiverOnline] = useState(false); // Online status
    const [isTyping, setIsTyping] = useState(false); // Typing indicator

    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null); // Debounce timeout for typing

    const user = useSelector((store) => store.user);
    const userId = user?._id;

    /* -------------------- AUTO SCROLL -------------------- */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]); // also scroll when typing indicator appears

    /* -------------------- SOCKET (CREATE ONCE PER USER) -------------------- */
    useEffect(() => {
        if (!userId) return;

        const socket = socketConnection(userId);
        socketRef.current = socket;

        // RECEIVE MESSAGE
        const handleReceiveMessage = (msg) => {
            setMessages((prev) => {
                const filtered = prev.filter(
                    (m) =>
                        !(
                            m._id?.startsWith("temp-") &&
                            m.from === msg.from &&
                            m.content === msg.content
                        ),
                );

                if (filtered.some((m) => m._id === msg._id)) {
                    return filtered;
                }

                return [...filtered, msg];
            });
        };

        // ONLINE STATUS HANDLERS
        const handleUserOnline = ({ userId: onlineUserId }) => {
            if (onlineUserId === messagetoid) {
                setIsReceiverOnline(true);
            }
        };

        const handleUserOffline = ({ userId: offlineUserId }) => {
            if (offlineUserId === messagetoid) {
                setIsReceiverOnline(false);
            }
        };

        // Fired when you join a room — tells you current status of the other user
        const handleOnlineStatus = ({ userId: statusUserId, isOnline }) => {
            if (statusUserId === messagetoid) {
                setIsReceiverOnline(isOnline);
            }
        };

        // TYPING INDICATOR HANDLERS
        const handleTyping = ({ userId: typingUserId }) => {
            if (typingUserId === messagetoid) {
                setIsTyping(true);
            }
        };

        const handleStopTyping = ({ userId: stopUserId }) => {
            if (stopUserId === messagetoid) {
                setIsTyping(false);
            }
        };

        // ERROR HANDLER
        const handleError = ({ message }) => {
            console.error("Socket error:", message);
        };

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("userOnline", handleUserOnline);
        socket.on("userOffline", handleUserOffline);
        socket.on("onlineStatus", handleOnlineStatus);
        socket.on("typing", handleTyping);
        socket.on("stopTyping", handleStopTyping);
        socket.on("error", handleError);

        socket.on("connect_error", (err) => {
            console.error("Socket connect error:", err.message);
        });

        socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
        });

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("userOnline", handleUserOnline);
            socket.off("userOffline", handleUserOffline);
            socket.off("onlineStatus", handleOnlineStatus);
            socket.off("typing", handleTyping);
            socket.off("stopTyping", handleStopTyping);
            socket.off("error", handleError);
            socket.disconnect();
        };
    }, [userId, messagetoid]);

    /* -------------------- JOIN / LEAVE CHAT ROOM -------------------- */
    useEffect(() => {
        if (!socketRef.current || !messagetoid || !userId) return;

        socketRef.current.emit("joinChat", {
            from: userId,
            to: messagetoid,
        });

        return () => {
            socketRef.current.emit("leaveChat", {
                from: userId,
                to: messagetoid,
            });
        };
    }, [messagetoid, userId]);

    /* -------------------- FETCH RECEIVER -------------------- */
    useEffect(() => {
        if (!messagetoid) return;

        const fetchReceiver = async () => {
            const res = await axios.get(`${BASE_URL}/user/${messagetoid}`, {
                withCredentials: true,
            });
            setReceiver(res.data.user || res.data);
        };

        fetchReceiver();
    }, [messagetoid]);

    /* -------------------- FETCH CHAT HISTORY -------------------- */
    useEffect(() => {
        if (!messagetoid) return;

        const fetchMessages = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/chat/${messagetoid}`, {
                    withCredentials: true,
                });

                const raw = res.data?.messages || [];

                const normalized = raw.map((msg) => ({
                    _id: msg._id.toString(),
                    from: msg.sender._id.toString(),
                    senderName: `${msg.sender.firstName} ${msg.sender.lastName}`,
                    content: msg.text,
                    timestamp: msg.createdAt,
                }));

                setMessages((prev) => {
                    const existing = new Set(prev.map((m) => m._id));
                    return [
                        ...prev,
                        ...normalized.filter((m) => !existing.has(m._id)),
                    ];
                });
            } catch (error) {
                if (error.response?.status === 403) {
                    alert("You are not connected with this user!");
                    navigate("/");
                }
            }
        };

        fetchMessages();
    }, [messagetoid]);

    /* -------------------- TYPING HANDLER (with debounce) -------------------- */
    const handleInputChange = useCallback(
        (e) => {
            setNewMessage(e.target.value);

            if (!socketRef.current || !messagetoid) return;

            // ✅ Emit "typing" immediately on first keystroke
            socketRef.current.emit("typing", { to: messagetoid });

            // ✅ Clear previous timeout and reset — if user stops typing for 1.5s, emit "stopTyping"
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
                socketRef.current?.emit("stopTyping", { to: messagetoid });
            }, 1500);
        },
        [messagetoid],
    );

    /* -------------------- SEND MESSAGE -------------------- */
    const sendMessage = () => {
        if (!newMessage.trim() || !socketRef.current) return;

        // ✅ Clear typing timeout and emit stopTyping on send
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        socketRef.current.emit("stopTyping", { to: messagetoid });

        const tempId = `temp-${Date.now()}`;

        setMessages((prev) => [
            ...prev,
            {
                _id: tempId,
                from: userId,
                content: newMessage,
                timestamp: new Date().toISOString(),
            },
        ]);

        socketRef.current.emit("sendMessage", {
            to: messagetoid,
            content: newMessage,
        });

        setNewMessage("");
    };

    /* -------------------- UI -------------------- */
    return (
        <div
            className="h-screen bg-base-100 flex justify-center items-center px-4"
            data-theme="black"
        >
            <div className="w-full max-w-3xl h-[90vh] bg-base-200 border border-base-300 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
                {/* ── HEADER ── */}
                <div className="shrink-0 px-5 py-4 flex items-center gap-4 bg-base-200 border-b border-base-300">
                    {/* Avatar + online dot */}
                    <div className="relative">
                        {receiver?.photo ? (
                            <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-base-300">
                                <img
                                    src={receiver.photo}
                                    alt={receiver.firstName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-11 h-11 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-lg">
                                {receiver?.firstName?.[0]}
                            </div>
                        )}
                        {/* Online dot */}
                        <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-200 ${
                                isReceiverOnline
                                    ? "bg-success"
                                    : "bg-base-content/20"
                            }`}
                        />
                    </div>

                    {/* Name + status */}
                    <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-base text-base-content truncate">
                            {receiver
                                ? [receiver.firstName, receiver.lastName]
                                      .filter(Boolean)
                                      .join(" ")
                                : "Chat"}
                        </h2>
                        <p
                            className={`text-xs font-medium ${
                                isReceiverOnline
                                    ? "text-success"
                                    : "text-base-content/30"
                            }`}
                        >
                            {isReceiverOnline ? "● Online" : "● Offline"}
                        </p>
                    </div>

                    {/* Header actions */}
                    <div className="flex items-center gap-2">
                        <div className="btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-base-content">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.8}
                                    d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* ── MESSAGES ── */}
                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-base-100 scrollbar-thin">
                    {messages.map((msg, index) => {
                        const isMe = msg.from === userId;

                        return (
                            <div
                                key={index}
                                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                                <div className="max-w-[70%]">
                                    {/* Sender name (others only) */}
                                    {!isMe && msg.senderName && (
                                        <p className="text-xs text-base-content/40 mb-1 ml-1">
                                            {msg.senderName}
                                        </p>
                                    )}

                                    <div
                                        className={`px-4 py-3 rounded-2xl ${
                                            isMe
                                                ? "bg-primary text-primary-content rounded-br-sm"
                                                : "bg-base-200 border border-base-300 text-base-content rounded-bl-sm"
                                        }`}
                                    >
                                        <p className="text-sm leading-relaxed">
                                            {msg.content}
                                        </p>
                                        <p
                                            className={`text-[11px] mt-1 ${
                                                isMe
                                                    ? "text-primary-content/50 text-right"
                                                    : "text-base-content/30"
                                            }`}
                                        >
                                            {new Date(
                                                msg.timestamp,
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* ── TYPING INDICATOR ── */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-base-200 border border-base-300 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                                <span
                                    className="w-2 h-2 bg-base-content/30 rounded-full animate-bounce"
                                    style={{ animationDelay: "0ms" }}
                                />
                                <span
                                    className="w-2 h-2 bg-base-content/30 rounded-full animate-bounce"
                                    style={{ animationDelay: "150ms" }}
                                />
                                <span
                                    className="w-2 h-2 bg-base-content/30 rounded-full animate-bounce"
                                    style={{ animationDelay: "300ms" }}
                                />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* ── INPUT ── */}
                <div className="shrink-0 px-4 py-3 bg-base-200 border-t border-base-300">
                    <div className="flex items-center gap-3 bg-base-100 border border-base-300 rounded-xl px-4 py-2.5 focus-within:border-primary transition-colors duration-200">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleInputChange}
                            placeholder="Type a message…"
                            className="flex-1 bg-transparent outline-none text-sm text-base-content placeholder:text-base-content/20"
                            onKeyDown={(e) =>
                                e.key === "Enter" && sendMessage()
                            }
                        />

                        {/* Send button */}
                        <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            className="btn btn-primary btn-sm rounded-lg px-4 h-9 min-h-0 font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                            Send
                        </button>
                    </div>

                    {/* Enter hint */}
                    <p className="text-center text-base-content/20 text-xs mt-1.5">
                        Press{" "}
                        <kbd className="kbd kbd-xs bg-base-300 border-base-content/10">
                            Enter
                        </kbd>{" "}
                        to send
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Chat;
