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
        <div className="flex flex-row justify-center gap-12 px-10 py-10">
            <div className="flex justify-center">
                <div className="card bg-sky-50 border border-sky-300 w-96 shadow-lg">
                    <div className="card-body p-6">
                        <h2 className="card-title justify-center mb-4">
                            Edit Profile
                        </h2>

                        <div className="space-y-3">
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-semibold">
                                        First Name
                                    </span>
                                </label>
                                <input
                                    className="input input-bordered input-sm"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-semibold">
                                        Last Name
                                    </span>
                                </label>
                                <input
                                    className="input input-bordered input-sm"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-semibold">
                                        Age
                                    </span>
                                </label>
                                <input
                                    className="input input-bordered input-sm"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-semibold">
                                        Gender
                                    </span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
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
                                <label className="label py-1">
                                    <span className="label-text font-semibold">
                                        About
                                    </span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    placeholder="Tell something about yourself..."
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text font-semibold">
                                        Photo URL
                                    </span>
                                </label>
                                <input
                                    className="input input-bordered input-sm"
                                    value={photo}
                                    onChange={(e) => setPhoto(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <p className="text-error font-bold mt-4">{error}</p>
                        </div>
                        <div className="card-actions justify-center mt-6">
                            <button
                                className="btn btn-primary btn-sm px-8"
                                onClick={handleSaveProfile}
                            >
                                Save Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <FeedCard
                user={{ firstName, lastName, age, gender, about, photo }}
            />

            {showToast && (
                <div className="toast toast-top toast-center">
                    <div className="alert alert-success">
                        <span>Profile updated successfully 🎉</span>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ProfileEdit;
