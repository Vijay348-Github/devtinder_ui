import React from "react";

const FeedCard = ({ user }) => {
    if (!user) return null;
    const { firstName, lastName, age, gender, about, photo } = user;
    return (
        <div className="flex justify-center mt-10">
            <div className="card bg-base-300 w-96 shadow-sm">
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
                        <button className="btn btn-outline btn-error">
                            ❌ Pass
                        </button>
                        <button className="btn btn-primary">❤️ Like</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedCard;
