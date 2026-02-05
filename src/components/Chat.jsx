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
        <div className="h-screen bg-gradient-to-br from-[#eef2ff] via-[#f8fafc] to-[#eef2ff] flex justify-center items-center px-4">
            <div className="w-full max-w-3xl h-[90vh] bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/40">
                {/* HEADER */}
                <div className="shrink-0 px-6 py-4 flex items-center gap-4 bg-white/80 backdrop-blur border-b border-gray-200">
                    {/* Avatar with online dot */}
                    <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {receiver?.firstName?.[0]}
                        </div>
                        {/* ✅ Online dot on avatar */}
                        <span
                            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                isReceiverOnline
                                    ? "bg-emerald-500"
                                    : "bg-gray-400"
                            }`}
                        />
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg text-gray-900">
                            {receiver
                                ? [receiver.firstName, receiver.lastName]
                                      .filter(Boolean)
                                      .join(" ")
                                : "Chat"}
                        </h2>
                        {/* ✅ Dynamic online/offline status text */}
                        <p
                            className={`text-xs font-medium ${
                                isReceiverOnline
                                    ? "text-emerald-500"
                                    : "text-gray-400"
                            }`}
                        >
                            {isReceiverOnline ? "● Online" : "● Offline"}
                        </p>
                    </div>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-gradient-to-b from-white to-slate-50">
                    {messages.map((msg, index) => {
                        const isMe = msg.from === userId;

                        return (
                            <div
                                key={index}
                                className={`flex ${
                                    isMe ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div className="max-w-[70%]">
                                    {!isMe && msg.senderName && (
                                        <p className="text-xs text-gray-500 mb-1 ml-1">
                                            {msg.senderName}
                                        </p>
                                    )}

                                    <div
                                        className={`px-4 py-3 rounded-2xl shadow-sm ${
                                            isMe
                                                ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-br-md"
                                                : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                                        }`}
                                    >
                                        <p className="text-sm">{msg.content}</p>
                                        <div
                                            className={`text-[11px] mt-1 ${
                                                isMe
                                                    ? "text-white/70 text-right"
                                                    : "text-gray-400"
                                            }`}
                                        >
                                            {new Date(
                                                msg.timestamp,
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* ✅ TYPING INDICATOR BUBBLE */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-100 px-4 py-3 shadow-sm flex items-center gap-1">
                                <span
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0ms" }}
                                />
                                <span
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "150ms" }}
                                />
                                <span
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "300ms" }}
                                />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* INPUT */}
                <div className="shrink-0 p-4 bg-white/80 backdrop-blur border-t border-gray-200">
                    <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-md border border-gray-200">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleInputChange}
                            placeholder="Type your message…"
                            className="flex-1 bg-transparent outline-none text-sm"
                            onKeyDown={(e) =>
                                e.key === "Enter" && sendMessage()
                            }
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium transition"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
