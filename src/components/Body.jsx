import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { API_BASE } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((store) => store.user);
    const getUser = async () => {
        if (userData) return;
        try {
            const result = await axios.get(API_BASE + "/profile/view", {
                withCredentials: true,
            });
            dispatch(addUser(result.data));
        } catch (error) {
            if (error.response?.status === 401) {
                navigate("/login");
            }
            console.error("Error fetching user profile:", error);
        }
    };
    useEffect(() => {
        getUser();
    }, []);

    return (
        <div>
            <NavBar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default Body;
