import React from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const FeedCard = ({ user }) => {
    const dispatch = useDispatch();
    const handleSendRequest = async (status, requestId) => {
        try {
            const response = await axios.post(
                BASE_URL + "/send/request/" + status + "/" + requestId,
                {},
                {
                    withCredentials: true,
                },
            );
            dispatch(removeUserFromFeed(requestId));
        } catch (error) {
            alert("Error sending request. Please try again. " + error.message);
        }
    };
    if (!user) return null;
    const { _id, firstName, lastName, age, gender, about, photo } = user;
    return (
        <div className="flex justify-center mt-10">
            <div className="card bg-sky-50 border border-sky-300 w-96 shadow-lg r">
                <figure className="h-72 overflow-hidden rounded-xl mx-6 mt-6">
                    <img
                        src={photo}
                        alt="Photo"
                        className="w-full h-full object-cover"
                    />
                </figure>

                <div className="card-body items-center text-center">
                    <h2 className="card-title text-xl">
                        {firstName + " " + lastName}
                    </h2>
                    {age && gender && (
                        <p className="text-sm text-gray-500">
                            {age} · {gender}
                        </p>
                    )}

                    <p className="text-gray-700">{about}</p>

                    <div className="card-actions">
                        <button
                            className="btn btn-outline btn-error"
                            onClick={() => handleSendRequest("ignored", _id)}
                        >
                            ❌ Pass
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => handleSendRequest("interested", _id)}
                        >
                            ❤️ Like
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedCard;
