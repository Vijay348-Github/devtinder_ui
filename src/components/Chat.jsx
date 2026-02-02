import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { socketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

const Chat = () => {
    const { messagetoid } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [receiver, setReceiver] = useState(null);
    const socketRef = useRef(null);

    const user = useSelector((store) => store.user);
    const userId = user?._id;

    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (!userId || !messagetoid) return;

        const socket = socketConnection();
        socketRef.current = socket;

        socket.emit("joinChat", { userId, messagetoid });

        socket.on("receiveMessage", ({ from, content, timestamp }) => {
            setMessages((prev) => [...prev, { from, content, timestamp }]);
        });

        return () => {
            socket.disconnect();
        };
    }, [userId, messagetoid]);

    useEffect(() => {
        if (!messagetoid) return;

        const fetchReceiver = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/user/${messagetoid}`, {
                    withCredentials: true,
                });

                setReceiver(res.data);
            } catch (error) {
                console.error("Failed to fetch receiver", error);
            }
        };

        fetchReceiver();
    }, [messagetoid]);

    const sendMessage = () => {
        if (!newMessage.trim() || !socketRef.current) return;

        socketRef.current.emit("sendMessage", {
            from: userId,
            to: messagetoid,
            content: newMessage,
            timestamp: new Date().toISOString(),
        });

        setNewMessage("");
    };

    return (
        <div className="h-screen bg-gradient-to-br from-[#eef2ff] via-[#f8fafc] to-[#eef2ff] flex justify-center items-center px-4">
            <div className="w-full max-w-3xl h-[90vh] bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/40">
                
                <div className="shrink-0 px-6 py-4 flex items-center gap-4 bg-white/80 backdrop-blur border-b border-gray-200">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {receiver?.firstName?.[0]}
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg text-gray-900">
                            {receiver
                                ? [receiver.firstName, receiver.lastName]
                                      .filter(Boolean)
                                      .join(" ")
                                : "Chat"}
                        </h2>
                        <p className="text-xs text-emerald-500 font-medium">
                            ● Online
                        </p>
                    </div>
                </div>

                
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-gradient-to-b from-white to-slate-50">
                    {messages.map((msg, index) => {
                        const isMe = msg.from === userId;

                        return (
                            <div
                                key={index}
                                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${
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
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="shrink-0 p-4 bg-white/80 backdrop-blur border-t border-gray-200">
                    <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-md border border-gray-200">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
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
