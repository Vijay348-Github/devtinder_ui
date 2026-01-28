import React from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
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
            const res = await axios.get(BASE_URL + "/user/connections", {
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
    if (!connections || connections.length === 0) {
        return (
            <div className="flex justify-center min-h-screen my-6">
                <h1 className="text-4xl font-bold drop-shadow-md">
                    No Connections Found
                </h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 py-8">
            <h1 className="text-4xl font-extrabold text-center mb-12 relative">
                Connections
                <span className="block w-20 h-1 bg-primary mx-auto mt-3 rounded-full"></span>
            </h1>

            <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8">
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
                            className="group w-80 bg-base-200 rounded-3xl shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col"
                        >
                            <div className="relative h-96">
                                <img
                                    src={photo}
                                    alt={firstName}
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>

                                <div className="absolute bottom-16 left-4 text-white z-10">
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

                                <div
                                    className="absolute bottom-4 left-0 right-0 flex justify-center
                 opacity-0 translate-y-2
                 group-hover:opacity-100 group-hover:translate-y-0
                 transition-all duration-300 z-20"
                                >
                                    <button
                                        onClick={() => navigate(`/chat/${_id}`)}
                                        className="btn btn-primary rounded-full px-8 shadow-lg"
                                    >
                                        💬 Chat
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 text-center group/bio">
                                <p
                                    className="text-sm text-gray-500 italic
               line-clamp-3
               group-hover/bio:line-clamp-none
               transition-all duration-300"
                                >
                                    {about || "No bio available"}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Connections;
