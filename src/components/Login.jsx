import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Home = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const resultData = await axios.post(
                `${BASE_URL}/login`,
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
            setError(
                error?.response?.data?.details ||
                    error?.response?.data ||
                    "Login failed",
            );
        }
    };

    return (
        <div className="min-h-screen flex" data-theme="black">
            {/* LEFT PANEL — Branding */}
            <div className="hidden lg:flex w-1/2 bg-base-200 flex-col justify-between p-14 relative overflow-hidden">
                {/* Background decorative circles */}
                <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full bg-primary opacity-10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 rounded-full bg-secondary opacity-10 blur-3xl pointer-events-none" />

                {/* Logo */}
                <div className="flex items-center gap-3 z-10">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-primary-content"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-base-content">
                        Connect
                    </span>
                </div>

                {/* Center quote */}
                <div className="z-10">
                    <h1 className="text-5xl font-extrabold text-base-content leading-tight mb-6">
                        Where professionals
                        <br />
                        <span className="text-primary">connect</span> and
                        <br />
                        grow together.
                    </h1>
                    <p className="text-base-content/50 text-lg leading-relaxed max-w-sm">
                        Join thousands of professionals building meaningful
                        connections every day.
                    </p>
                </div>

                {/* Stats row */}
                <div className="flex gap-10 z-10">
                    <div>
                        <p className="text-3xl font-bold text-base-content">
                            10K+
                        </p>
                        <p className="text-base-content/40 text-sm mt-1">
                            Active Users
                        </p>
                    </div>
                    <div className="w-px bg-base-content/10" />
                    <div>
                        <p className="text-3xl font-bold text-base-content">
                            50K+
                        </p>
                        <p className="text-base-content/40 text-sm mt-1">
                            Connections Made
                        </p>
                    </div>
                    <div className="w-px bg-base-content/10" />
                    <div>
                        <p className="text-3xl font-bold text-base-content">
                            98%
                        </p>
                        <p className="text-base-content/40 text-sm mt-1">
                            Satisfaction Rate
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL — Login Form */}
            <div className="flex-1 flex items-center justify-center bg-base-100 px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-primary-content"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-base-content">
                            Connect
                        </span>
                    </div>

                    {/* Header */}
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-base-content mb-2">
                            Welcome back
                        </h2>
                        <p className="text-base-content/40 text-sm">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* EMAIL */}
                        <div className="form-control">
                            <label className="label pb-1.5">
                                <span className="label-text text-base-content/70 text-sm font-medium">
                                    Email address
                                </span>
                            </label>
                            <input
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="you@example.com"
                                className="input input-bordered bg-base-200 border-base-300 focus:border-primary focus:outline-none w-full text-base-content placeholder:text-base-content/20 h-12"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="form-control">
                            <div className="flex items-center justify-between pb-1.5">
                                <label className="label p-0">
                                    <span className="label-text text-base-content/70 text-sm font-medium">
                                        Password
                                    </span>
                                </label>
                                <span className="text-xs text-primary cursor-pointer hover:underline">
                                    Forgot password?
                                </span>
                            </div>
                            <input
                                type="password"
                                autoComplete="current-password"
                                required
                                placeholder="••••••••"
                                className="input input-bordered bg-base-200 border-base-300 focus:border-primary focus:outline-none w-full text-base-content placeholder:text-base-content/20 h-12"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

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

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            className="btn btn-primary w-full h-12 text-base font-semibold tracking-wide mt-2"
                        >
                            Sign in
                        </button>

                        {/* DIVIDER */}
                        <div className="divider text-base-content/20 text-xs">
                            OR
                        </div>

                        {/* SIGNUP REDIRECT */}
                        <p className="text-center text-sm text-base-content/40">
                            Don't have an account?{" "}
                            <span
                                className="text-primary font-semibold cursor-pointer hover:underline"
                                onClick={() => navigate("/signup")}
                            >
                                Create one free
                            </span>
                        </p>
                    </form>

                    {/* Footer note */}
                    <p className="text-center text-xs text-base-content/20 mt-10">
                        By signing in, you agree to our{" "}
                        <span className="underline cursor-pointer">
                            Terms of Service
                        </span>{" "}
                        and{" "}
                        <span className="underline cursor-pointer">
                            Privacy Policy
                        </span>
                    </p>
                </div>
            </div>

            {/* TOAST */}
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
