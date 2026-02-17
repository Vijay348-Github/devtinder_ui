import React from "react";
import axios from "axios";
import { API_BASE } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setConnections } from "../utils/connectionSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Connections = () => {
    const dispatch = useDispatch();
    const connections = useSelector((store) => store.connections);
    const navigate = useNavigate();

    const getConnections = async () => {
        try {
            const res = await axios.get(API_BASE + "/user/connections", {
                withCredentials: true,
            });
            dispatch(setConnections(res.data.data));
        } catch (error) {
            alert(
                "Error fetching connections. Please try again. " +
                    error.message,
            );
        }
    };

    useEffect(() => {
        getConnections();
    }, []);

    /* ── EMPTY STATE ── */
    if (!connections || connections.length === 0) {
        return (
            <div
                className="min-h-screen bg-base-100 flex flex-col items-center justify-center gap-4"
                data-theme="black"
            >
                {/* Icon */}
                <div className="w-20 h-20 rounded-full bg-base-200 border border-base-300 flex items-center justify-center mb-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-9 h-9 text-base-content/20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6-4a3 3 0 11-6 0 3 3 0 016 0zM3 8a3 3 0 116 0A3 3 0 013 8z"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-base-content">
                    No connections yet
                </h2>
                <p className="text-base-content/40 text-sm text-center max-w-xs">
                    Start connecting with people to see them here
                </p>
                <button
                    className="btn btn-primary btn-sm mt-2 px-6"
                    onClick={() => navigate("/")}
                >
                    Explore People
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 px-6 py-14" data-theme="black">
            {/* PAGE HEADER */}
            <div className="max-w-6xl mx-auto mb-10">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-1 h-6 bg-primary rounded-full" />
                            <h1 className="text-2xl font-bold text-base-content tracking-tight">
                                My Connections
                            </h1>
                        </div>
                        <p className="text-base-content/40 text-sm ml-4">
                            People you're connected with
                        </p>
                    </div>

                    {/* Connection count badge */}
                    <div className="flex items-center gap-2 bg-base-200 border border-base-300 rounded-xl px-4 py-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-base-content font-semibold text-sm">
                            {connections.length}
                        </span>
                        <span className="text-base-content/40 text-sm">
                            {connections.length === 1
                                ? "connection"
                                : "connections"}
                        </span>
                    </div>
                </div>

                <div className="divider border-base-300 mt-6 mb-0" />
            </div>

            {/* GRID */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {connections.map((connection) => {
                    const {
                        _id,
                        firstName,
                        lastName,
                        age,
                        gender,
                        photo,
                        about,
                    } = connection;

                    return (
                        <div
                            key={_id}
                            className="group bg-base-200 border border-base-300 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 flex flex-col"
                        >
                            {/* PHOTO */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={photo}
                                    alt={firstName}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                                {/* Gender badge */}
                                {gender && (
                                    <div className="absolute top-3 right-3">
                                        <span className="badge badge-sm bg-base-100/80 backdrop-blur-sm border-0 text-base-content/70 capitalize font-medium">
                                            {gender}
                                        </span>
                                    </div>
                                )}

                                {/* Name on photo */}
                                <div className="absolute bottom-3 left-4 z-10">
                                    <h2 className="text-white font-bold text-lg leading-tight">
                                        {firstName} {lastName}
                                        {age && (
                                            <span className="font-normal text-white/70 text-base ml-1">
                                                · {age}
                                            </span>
                                        )}
                                    </h2>
                                </div>
                            </div>

                            {/* BIO */}
                            <div className="px-4 pt-3 pb-2 flex-1">
                                <p className="text-base-content/50 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                                    {about || "No bio available"}
                                </p>
                            </div>

                            {/* DIVIDER + ACTION */}
                            <div className="px-4 pb-4 pt-2">
                                <div className="divider border-base-300 my-0 mb-3" />
                                <button
                                    onClick={() => navigate(`/chat/${_id}`)}
                                    className="btn btn-primary btn-sm w-full font-semibold tracking-wide"
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
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                    Message
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Connections;
