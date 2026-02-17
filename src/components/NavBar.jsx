import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../utils/constants";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../utils/userSlice";

const NavBar = () => {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(API_BASE + "/logout");
            dispatch(clearUser());
            navigate("/login");
        } catch (error) {
            alert("Error logging out. Please try again. " + error.message);
        }
    };

    // Theme setup on load
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    // Toggle theme
    const toggleTheme = () => {
        const current =
            document.documentElement.getAttribute("data-theme") || "light";
        const next = current === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
    };

    return (
        <div className="navbar bg-base-200 px-6 border-b border-base-300 h-16 min-h-0">
            {/* ── LOGO ── */}
            <div className="flex-1">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-primary-content"
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
                    <span className="text-lg font-bold tracking-tight text-base-content group-hover:text-primary transition-colors duration-200">
                        DevTinder
                    </span>
                </Link>
            </div>

            {/* ── RIGHT SECTION ── */}
            {user && (
                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <label className="swap swap-rotate">
                        <input
                            type="checkbox"
                            onChange={toggleTheme}
                            defaultChecked={
                                localStorage.getItem("theme") === "dark"
                            }
                        />

                        {/* Sun icon */}
                        <svg
                            className="swap-off w-5 h-5 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="M5.64 17.66L4.22 19.07L5.64 20.49L7.05 19.07M12 4V1M4 12H1M21 12H23M12 23V20M19.78 4.22L18.36 5.64M17.66 17.66L19.07 19.07M6.34 6.34L4.93 4.93M12 6A6 6 0 1012 18A6 6 0 0012 6Z" />
                        </svg>

                        {/* Moon icon */}
                        <svg
                            className="swap-on w-5 h-5 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="M21.75 15.5A9 9 0 1112.5 2.25A7 7 0 0021.75 15.5Z" />
                        </svg>
                    </label>

                    {/* Welcome text */}
                    <p className="text-sm text-base-content/40 hidden sm:block">
                        Hey,{" "}
                        <span className="font-semibold text-base-content/70">
                            {user.firstName}
                        </span>
                    </p>

                    <div className="w-px h-5 bg-base-300 hidden sm:block" />

                    {/* Avatar dropdown */}
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-base-300 transition-colors duration-200 cursor-pointer group"
                        >
                            <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-base-300 group-hover:ring-primary/50 transition-all duration-200">
                                <img
                                    alt="User Avatar"
                                    src={user.photo}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3.5 h-3.5 text-base-content/30 group-hover:text-base-content/60 transition-colors"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>

                        <ul
                            tabIndex={-1}
                            className="menu menu-sm dropdown-content bg-base-200 border border-base-300 rounded-xl mt-2 w-56 p-1.5 shadow-2xl z-50"
                        >
                            <li className="px-3 py-2 mb-1">
                                <div className="flex items-center gap-3 hover:bg-transparent cursor-default">
                                    <div className="w-9 h-9 rounded-lg overflow-hidden ring-1 ring-base-300 shrink-0">
                                        <img
                                            src={user.photo}
                                            alt="avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-base-content truncate">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs text-base-content/40 truncate">
                                            {user.email || "View profile"}
                                        </p>
                                    </div>
                                </div>
                            </li>

                            <div className="border-t border-base-300 mx-2 mb-1" />

                            <li>
                                <Link to="/profile">Profile</Link>
                            </li>
                            <li>
                                <Link to="/connections">Connections</Link>
                            </li>
                            <li>
                                <Link to="/requests">Connection Requests</Link>
                            </li>

                            <div className="border-t border-base-300 mx-2 my-1" />

                            <li>
                                <a
                                    onClick={handleLogout}
                                    className="text-error cursor-pointer"
                                >
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavBar;
