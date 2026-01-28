import React, { useState } from "react";
// import { useParams } from "react-router-dom";

const Chat = () => {
    // const { messagetoid } = useParams();
    const [message, setMessage] = useState("");

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex justify-center items-center px-4">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b flex items-center gap-3 bg-base-100">
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                    <div>
                        <h2 className="font-semibold text-lg">John Doe</h2>
                        <p className="text-xs text-green-500">Online</p>
                    </div>
                </div>

                <div
                    className="flex-1 overflow-y-auto px-6 py-4 space-y-4
                bg-[radial-gradient(circle_at_top,_#ffffff,_#f1f5f9)]
                relative"
                >
                    <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                        <div className="bg-white border rounded-2xl px-4 py-2 max-w-xs">
                            <p className="text-sm">Hey! How are you doing?</p>
                            <span className="text-xs text-gray-400 block mt-1">
                                10:30 AM
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="bg-primary text-white rounded-2xl px-4 py-2 max-w-xs">
                            <p className="text-sm">
                                I’m good! Working on the chat feature 😄
                            </p>
                            <span className="text-xs text-white/70 block mt-1 text-right">
                                10:31 AM
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t bg-base-100">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="input input-bordered w-full rounded-full"
                        />
                        <button className="btn btn-primary rounded-full px-6">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
