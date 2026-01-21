import React from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setRequests } from "../utils/requestSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { clearRequest } from "../utils/requestSlice";

const Requests = () => {
    const dispatch = useDispatch();
    const requests = useSelector((store) => store.requests);

    const reviewRequest = async (status, requestId) => {
        try {
            const res = await axios.post(
                BASE_URL + "/request/review/" + status + "/" + requestId,
                {},
                {
                    withCredentials: true,
                },
            );
            dispatch(clearRequest(requestId));
        } catch (error) {
            alert(
                "Error reviewing request. Please try again. " + error.message,
            );
        }
    };

    const fetchRequests = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/requests/received", {
                withCredentials: true,
            });
            dispatch(setRequests(res.data.data));
        } catch (error) {
            alert(
                "Error fetching requests. Please try again. " + error.message,
            );
        }
    };
    useEffect(() => {
        fetchRequests();
    }, []);

    if (!requests || requests.length === 0) {
        return (
            <div className="flex justify-center min-h-screen my-6">
                <h1 className="text-3xl font-semibold text-gray-500">
                    No Connection Requests Found
                </h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 py-8">
            <h1 className="text-4xl font-extrabold text-center mb-12 relative">
                Connection Requests
                <span className="block w-20 h-1 bg-primary mx-auto mt-3 rounded-full"></span>
            </h1>

            <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8">
                {requests.map((request) => {
                    const {
                        _id,
                        firstName,
                        lastName,
                        age,
                        gender,
                        photo,
                        about,
                    } = request.fromId;

                    return (
                        <div
                            key={_id}
                            className="w-80 bg-base-200 rounded-3xl shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300"
                        >
                            <div className="relative h-80">
                                <img
                                    src={photo}
                                    alt={firstName}
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                                <div className="absolute bottom-4 left-4 text-white">
                                    <h2 className="text-2xl font-bold">
                                        {firstName} {lastName}
                                        {age && (
                                            <span className="font-normal">
                                                , {age}
                                            </span>
                                        )}
                                    </h2>

                                    {gender && (
                                        <p className="text-sm capitalize opacity-80">
                                            {gender}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 text-center">
                                <p className="text-sm text-gray-600 italic line-clamp-3">
                                    {about || "No bio available"}
                                </p>
                            </div>

                            <div className="card-actions justify-around p-4 justify-center">
                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        reviewRequest("accepted", request._id)
                                    }
                                >
                                    ❤️ Accept
                                </button>
                                <button
                                    className="btn btn-outline btn-error"
                                    onClick={() =>
                                        reviewRequest("rejected", request._id)
                                    }
                                >
                                    ❌ Reject
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Requests;
