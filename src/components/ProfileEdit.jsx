import React from "react";
import { useState } from "react";
import FeedCard from "./FeedCard";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const ProfileEdit = ({ user }) => {
    const [firstName, setFirstName] = useState(user.firstName || "");
    const [lastName, setLastName] = useState(user.lastName || "");
    const [age, setAge] = useState(user.age || "");
    const [gender, setGender] = useState(user.gender || "");
    const [about, setAbout] = useState(user.about || "");
    const [photo, setPhoto] = useState(user.photo || "");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const [showToast, setShowToast] = useState(false);

    const handleSaveProfile = async () => {
        try {
            const res = await axios.patch(
                BASE_URL + "/profile/edit",
                {
                    firstName,
                    lastName,
                    age,
                    gender,
                    about,
                    photo,
                },
                { withCredentials: true },
            );
            dispatch(addUser(res?.data?.user));
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
            setError(error?.response?.data || "Profile update failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100 py-16">
            <div className="flex flex-row justify-center gap-16 px-10">
                {/* EDIT CARD */}
                <div className="card w-[420px] bg-base-100 shadow-2xl border border-base-200 rounded-2xl">
                    <div className="card-body p-8">
                        <h2 className="text-2xl font-bold text-center mb-6 tracking-tight">
                            Edit Profile
                        </h2>

                        <div className="space-y-5">
                            <div className="form-control">
                                <label className="label pb-1">
                                    <span className="label-text font-medium text-gray-600">
                                        First Name
                                    </span>
                                </label>
                                <input
                                    className="input input-bordered w-full focus:input-primary"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label pb-1">
                                    <span className="label-text font-medium text-gray-600">
                                        Last Name
                                    </span>
                                </label>
                                <input
                                    className="input input-bordered w-full focus:input-primary"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label pb-1">
                                    <span className="label-text font-medium text-gray-600">
                                        Age
                                    </span>
                                </label>
                                <input
                                    className="input input-bordered w-full focus:input-primary"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label pb-1">
                                    <span className="label-text font-medium text-gray-600">
                                        Gender
                                    </span>
                                </label>
                                <select
                                    className="select select-bordered w-full focus:select-primary"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="" disabled>
                                        Select gender
                                    </option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label pb-1">
                                    <span className="label-text font-medium text-gray-600">
                                        About
                                    </span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered w-full focus:textarea-primary"
                                    placeholder="Tell something about yourself..."
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label pb-1">
                                    <span className="label-text font-medium text-gray-600">
                                        Photo URL
                                    </span>
                                </label>
                                <input
                                    className="input input-bordered w-full focus:input-primary"
                                    value={photo}
                                    onChange={(e) => setPhoto(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-error font-medium mt-4 text-sm text-center">
                                {error}
                            </p>
                        )}

                        <div className="card-actions justify-center mt-8">
                            <button
                                className="btn btn-primary px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                                onClick={handleSaveProfile}
                            >
                                Save Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* PREVIEW CARD */}
                <div className="transition-all duration-300 hover:scale-[1.02]">
                    <FeedCard
                        user={{
                            firstName,
                            lastName,
                            age,
                            gender,
                            about,
                            photo,
                        }}
                        showActions={false}
                    />
                </div>
            </div>

            {showToast && (
                <div className="toast toast-top toast-center">
                    <div className="alert alert-success shadow-lg">
                        <span>Profile updated successfully 🎉</span>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ProfileEdit;
