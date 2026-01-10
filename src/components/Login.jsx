import React from "react";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Home = () => {
    const [email, setEmail] = useState("ellyse@gmail.com");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const resultData = await axios.post(
                BASE_URL+ "/login",
                {
                    email,
                    password,
                },
                { withCredentials: true }
            );
            dispatch(addUser(resultData.data));
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="flex justify-center my-20">
            <div className="card bg-base-100 w-96 shadow-sm bg-cyan-300 ">
                <div className="card-body">
                    <h2 className="card-title justify-center">Login</h2>
                    <div className="form-control w-full max-w-xs p-4">
                        <label className="label">
                            <span className="label-text font-semibold text-gray-700 pb-2">
                                Email
                            </span>
                        </label>

                        <input
                            type="email"
                            className="input input-bordered w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-control w-full max-w-xs p-4">
                        <label className="label">
                            <span className="label-text font-semibold text-gray-700 pb-2">
                                Password
                            </span>
                        </label>

                        <input
                            type="password"
                            className="input input-bordered w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="card-actions justify-center mt-4">
                        <button
                            className="btn btn-primary"
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
