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
        <div className="min-h-screen bg-base-100 py-14 px-6" data-theme="black">
            {/* PAGE HEADER */}
            <div className="max-w-5xl mx-auto mb-10">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-1 h-6 bg-primary rounded-full" />
                    <h1 className="text-2xl font-bold text-base-content tracking-tight">
                        Edit Profile
                    </h1>
                </div>
                <p className="text-base-content/40 text-sm ml-4">
                    Update your profile information and preview changes in real
                    time
                </p>
            </div>

            {/* MAIN LAYOUT */}
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
                {/* LEFT — EDIT FORM */}
                <div className="flex-1 w-full">
                    <div className="card bg-base-200 border border-base-300 rounded-2xl shadow-xl">
                        <div className="card-body p-8 space-y-5">
                            {/* NAME ROW */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="form-control">
                                    <label className="label pb-1.5">
                                        <span className="label-text text-base-content/60 text-xs font-semibold uppercase tracking-widest">
                                            First Name
                                        </span>
                                    </label>
                                    <input
                                        className="input bg-base-100 border-base-300 focus:border-primary focus:outline-none w-full text-base-content placeholder:text-base-content/20 h-11"
                                        placeholder="John"
                                        value={firstName}
                                        onChange={(e) =>
                                            setFirstName(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label pb-1.5">
                                        <span className="label-text text-base-content/60 text-xs font-semibold uppercase tracking-widest">
                                            Last Name
                                        </span>
                                    </label>
                                    <input
                                        className="input bg-base-100 border-base-300 focus:border-primary focus:outline-none w-full text-base-content placeholder:text-base-content/20 h-11"
                                        placeholder="Doe"
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* AGE + GENDER ROW */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="form-control">
                                    <label className="label pb-1.5">
                                        <span className="label-text text-base-content/60 text-xs font-semibold uppercase tracking-widest">
                                            Age
                                        </span>
                                    </label>
                                    <input
                                        className="input bg-base-100 border-base-300 focus:border-primary focus:outline-none w-full text-base-content placeholder:text-base-content/20 h-11"
                                        placeholder="25"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label pb-1.5">
                                        <span className="label-text text-base-content/60 text-xs font-semibold uppercase tracking-widest">
                                            Gender
                                        </span>
                                    </label>
                                    <select
                                        className="select bg-base-100 border-base-300 focus:border-primary focus:outline-none w-full text-base-content h-11 min-h-0"
                                        value={gender}
                                        onChange={(e) =>
                                            setGender(e.target.value)
                                        }
                                    >
                                        <option value="" disabled>
                                            Select gender
                                        </option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>

                            {/* ABOUT */}
                            <div className="form-control">
                                <label className="label pb-1.5">
                                    <span className="label-text text-base-content/60 text-xs font-semibold uppercase tracking-widest">
                                        About
                                    </span>
                                </label>
                                <textarea
                                    className="textarea bg-base-100 border-base-300 focus:border-primary focus:outline-none w-full text-base-content placeholder:text-base-content/20 resize-none"
                                    placeholder="Tell something about yourself..."
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            {/* PHOTO URL */}
                            <div className="form-control">
                                <label className="label pb-1.5">
                                    <span className="label-text text-base-content/60 text-xs font-semibold uppercase tracking-widest">
                                        Photo URL
                                    </span>
                                </label>
                                <div className="flex gap-3 items-center">
                                    {/* Photo preview avatar */}
                                    <div className="avatar shrink-0">
                                        <div className="w-11 h-11 rounded-xl bg-base-300 ring-1 ring-base-300">
                                            {photo ? (
                                                <img
                                                    src={photo}
                                                    alt="preview"
                                                    className="object-cover w-full h-full rounded-xl"
                                                    onError={(e) =>
                                                        (e.target.style.display =
                                                            "none")
                                                    }
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-base-content/20 text-xs">
                                                    No img
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        className="input bg-base-100 border-base-300 focus:border-primary focus:outline-none flex-1 text-base-content placeholder:text-base-content/20 h-11"
                                        placeholder="https://example.com/photo.jpg"
                                        value={photo}
                                        onChange={(e) =>
                                            setPhoto(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* DIVIDER */}
                            <div className="divider my-1 border-base-300" />

                            {/* ERROR */}
                            {error && (
                                <div className="alert alert-error py-3 text-sm rounded-xl">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"
                                        />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* ACTIONS */}
                            <div className="flex items-center justify-between pt-1">
                                <p className="text-base-content/30 text-xs">
                                    Changes reflect instantly in the preview →
                                </p>
                                <button
                                    className="btn btn-primary px-8 h-11 min-h-0 font-semibold tracking-wide"
                                    onClick={handleSaveProfile}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT — LIVE PREVIEW */}
                <div className="w-full lg:w-auto lg:sticky lg:top-10">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <p className="text-base-content/40 text-xs font-medium uppercase tracking-widest">
                            Live Preview
                        </p>
                    </div>
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
            </div>

            {/* TOAST */}
            {showToast && (
                <div className="toast toast-top toast-center z-50">
                    <div className="alert alert-success shadow-lg">
                        <span>✅ Profile updated successfully!</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileEdit;
