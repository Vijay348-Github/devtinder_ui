import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { setFeed } from "../utils/feedSlice.js";
import FeedCard from "./FeedCard.jsx";

const Feed = () => {
    const feed = useSelector((store) => store.feed);
    const dispatch = useDispatch();
    const getFeed = async () => {
        try {
            if (feed.length > 0) return;

            const response = await axios.get(`${BASE_URL}/feed`, {
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
    return (
        <div>
            {feed.length > 0 && <FeedCard user={feed[2]} />}
        </div>
    );
};

export default Feed;
