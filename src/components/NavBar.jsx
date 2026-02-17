import React from "react";
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

    return (
        <div className="navbar bg-base-200 px-6 shadow-md border-b border-base-300">
            <div className="flex-1">
                <Link
                    to="/"
                    className="text-xl font-bold tracking-tight hover:text-primary transition-colors"
                >
                    Dev<span className="text-primary">Tinder</span>
                </Link>
            </div>

            {user && (
                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-500 hidden sm:block">
                        Welcome,{" "}
                        <span className="font-medium text-gray-800">
                            {user.firstName}
                        </span>
                    </p>

                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img alt="User Avatar" src={user.photo} />
                            </div>
                        </div>

                        <ul
                            tabIndex={-1}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-56 p-2 shadow-lg border border-base-200"
                        >
                            <li>
                                <Link to="/profile" className="justify-between">
                                    Profile
                                    <span className="badge badge-primary badge-sm">
                                        New
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/connections">Connections</Link>
                            </li>
                            <li>
                                <Link to="/requests">Connection Requests</Link>
                            </li>
                            <li className="mt-1 border-t border-base-200">
                                <a
                                    onClick={handleLogout}
                                    className="text-error hover:bg-error/10"
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
