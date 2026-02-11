import React from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const FeedCard = ({ user, showActions = true }) => {
    const dispatch = useDispatch();

    const handleSendRequest = async (status, requestId) => {
        try {
            await axios.post(
                BASE_URL + "/send/request/" + status + "/" + requestId,
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
        <div className="flex justify-center">
            <div className="card w-[420px] bg-base-100 shadow-2xl border border-base-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                {/* Image */}
                <figure className="h-80 overflow-hidden">
                    <img
                        src={photo}
                        alt="Photo"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                </figure>

                {/* Content */}
                <div className="card-body items-center text-center px-8 py-6">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {firstName} {lastName}
                    </h2>

                    {age && gender && (
                        <p className="text-sm text-gray-500 font-medium">
                            {age} · {gender}
                        </p>
                    )}

                    <p className="text-gray-600 mt-2 leading-relaxed">
                        {about}
                    </p>

                    {showActions && (
                        <div className="card-actions justify-center gap-6 mt-6">
                            <button
                                className="btn btn-outline btn-error rounded-full px-8 hover:scale-105 transition-all duration-200"
                                onClick={() =>
                                    handleSendRequest("ignored", _id)
                                }
                            >
                                ❌ Pass
                            </button>

                            <button
                                className="btn btn-primary rounded-full px-8 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                                onClick={() =>
                                    handleSendRequest("interested", _id)
                                }
                            >
                                ❤️ Like
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedCard;
