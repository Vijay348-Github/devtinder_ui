import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Home = () => {
    const [email, setEmail] = useState("ellyse@gmail.com");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const resultData = await axios.post(
                BASE_URL + "/login",
                { email, password },
                { withCredentials: true },
            );
            dispatch(addUser(resultData.data));
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                navigate("/");
            }, 1500);
        } catch (error) {
            setError(error?.response?.data?.details || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="card w-96 bg-base-100 shadow-2xl rounded-2xl">
                <div className="card-body">
                    <h2 className="text-3xl font-extrabold text-center mb-2">
                        Welcome Back 👋
                    </h2>
                    <p className="text-center text-sm text-gray-500 mb-6">
                        Login to continue
                    </p>

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold">
                                Email
                            </span>
                        </label>
                        <input
                            type="email"
                            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-control mb-2">
                        <label className="label">
                            <span className="label-text font-semibold">
                                Password
                            </span>
                        </label>
                        <input
                            type="password"
                            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-error text-sm mt-2 text-center">
                            {error}
                        </p>
                    )}

                    <div className="mt-6">
                        <button
                            className="btn btn-primary w-full text-lg tracking-wide"
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                    </div>

                    <p className="text-center text-sm mt-4">
                        New here?{" "}
                        <span
                            className="text-primary font-semibold cursor-pointer hover:underline"
                            onClick={() => navigate("/signup")}
                        >
                            Create an account
                        </span>
                    </p>
                </div>
            </div>
            {showToast && (
                <div className="toast toast-top toast-center z-50">
                    <div className="alert alert-success shadow-lg">
                        <span>✅ Logged in successfully!</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
