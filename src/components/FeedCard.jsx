import React from "react";
import axios from "axios";
import { API_BASE } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const FeedCard = ({ user, showActions = true }) => {
    const dispatch = useDispatch();

    const handleSendRequest = async (status, requestId) => {
        try {
            await axios.post(
                API_BASE + "/send/request/" + status + "/" + requestId,
                {},
                { withCredentials: true },
            );
            dispatch(removeUserFromFeed(requestId));
        } catch (error) {
            alert("Error sending request. Please try again. " + error.message);
        }
    };

    if (!user) return null;

    const { _id, firstName, lastName, age, gender, about, photo } = user;

    return (
        <div className="flex justify-center py-10">
            <div className="card w-[440px] bg-base-200 border border-base-300 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-primary/10 hover:border-primary/30">
                {/* Image */}
                <figure className="h-96 overflow-hidden relative">
                    <img
                        src={photo}
                        alt="Photo"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {/* Gradient overlay at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-base-200 to-transparent pointer-events-none" />
                </figure>

                {/* Content */}
                <div className="card-body items-center text-center px-8 py-7">
                    {/* Name */}
                    <h2 className="text-2xl font-bold tracking-tight text-base-content">
                        {firstName} {lastName}
                    </h2>

                    {/* Age + Gender */}
                    {age && gender && (
                        <div className="flex items-center gap-2 mt-1">
                            <span className="badge badge-sm bg-base-300 border-0 text-base-content/60 font-medium">
                                {age} years
                            </span>
                            <span className="text-base-content/20">·</span>
                            <span className="badge badge-sm bg-base-300 border-0 text-base-content/60 font-medium capitalize">
                                {gender}
                            </span>
                        </div>
                    )}

                    {/* About */}
                    <p className="text-base-content/60 text-sm mt-4 leading-relaxed max-w-sm">
                        {about}
                    </p>

                    {/* Actions */}
                    {showActions && (
                        <div className="flex items-center gap-4 mt-7 w-full">
                            {/* Pass button */}
                            <button
                                className="btn flex-1 bg-base-300 border-base-300 hover:bg-error/10 hover:border-error/30 hover:text-error text-base-content/50 rounded-xl h-12 font-semibold transition-all duration-200 hover:scale-105"
                                onClick={() =>
                                    handleSendRequest("ignored", _id)
                                }
                            >
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
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                                Pass
                            </button>

                            {/* Like button */}
                            <button
                                className="btn btn-primary flex-1 rounded-xl h-12 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all duration-200"
                                onClick={() =>
                                    handleSendRequest("interested", _id)
                                }
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                Like
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedCard;
