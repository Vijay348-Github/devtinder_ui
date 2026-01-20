import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import feedReducer from "./feedSlice.js";

const store = configureStore({
    reducer: {
        user: userReducer,
        feed: feedReducer,
    },
});

export default store;
