import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { API_BASE } from "../utils/constants";
import { setFeed } from "../utils/feedSlice.js";
import FeedCard from "./FeedCard.jsx";

const Feed = () => {
    const feed = useSelector((store) => store.feed);
    const dispatch = useDispatch();
    const getFeed = async () => {
        try {
            if (feed.length > 0) return;

            const response = await axios.get(`${API_BASE}/feed`, {
                withCredentials: true,
            });
            dispatch(setFeed(response.data.data));
        } catch (error) {
            console.error("Error fetching feed:", error);
        }
    };
    useEffect(() => {
        getFeed();
    }, []);
    if (!feed || feed.length === 0) {
        return (
            <div className="flex justify-center min-h-screen my-6">
                <h1 className="text-3xl font-semibold text-gray-500">
                    No Feed Available
                </h1>
            </div>
        );
    }
    return (
        <div>
            {feed.length > 0 && <FeedCard user={feed[0]} />}
        </div>
    );
};

export default Feed;
