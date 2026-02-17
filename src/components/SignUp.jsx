import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Signup = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [about, setAbout] = useState("");
    const [age, setAge] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const handleSignup = async () => {
        try {
            setError("");
            const res = await axios.post(
                API_BASE + "/signup",
                {
                    firstName,
                    lastName,
                    email,
                    age,
                    password,
                    gender,
                    about,
                },
                { withCredentials: true },
            );
            dispatch(addUser(res.data));
            navigate("/profile");
        } catch (err) {
            setError(
                err?.response?.data?.details ||
                    err?.response?.data ||
                    "Signup failed",
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-300 bg-fixed bg-gradient-to-br from-primary/5 via-base-200 to-secondary/10 px-4">
            <div
                className="card w-full max-w-md 
      bg-gradient-to-br from-base-100 via-base-100 to-primary/10
      shadow-2xl rounded-3xl border border-base-300"
            >
                <div className="card-body gap-4">
                    <div className="text-center mb-2">
                        <h2 className="text-3xl font-extrabold tracking-tight">
                            Create Account
                        </h2>
                        <p className="text-sm text-base-content/60 mt-1">
                            Join and start connecting
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <input
                            className="input input-bordered input-md focus:outline-none focus:ring-2 focus:ring-primary/60"
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            className="input input-bordered input-md focus:outline-none focus:ring-2 focus:ring-primary/60"
                            placeholder="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <input
                        type="email"
                        className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/60"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/60"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <select
                        className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/60"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>

                    <input
                        type="number"
                        className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/60"
                        placeholder="Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    />

                    <textarea
                        className="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/60"
                        placeholder="About you"
                        rows={3}
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    />

                    {error && (
                        <div className="alert alert-error text-sm py-2">
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        className="btn btn-primary mt-2 w-full normal-case text-base font-semibold shadow-md hover:shadow-lg"
                        onClick={handleSignup}
                    >
                        Sign Up
                    </button>

                    <div className="divider text-sm text-base-content/50">
                        OR
                    </div>

                    <p className="text-center text-sm text-base-content/70">
                        Already have an account?{" "}
                        <span
                            className="text-primary font-semibold cursor-pointer hover:underline"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
