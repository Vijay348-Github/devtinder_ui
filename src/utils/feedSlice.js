import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: [],
    reducers: {
        setFeed: (state, action) => action.payload,
        removeUserFromFeed: (state, action) => {
            const freshFeed = state.filter((user) => user._id !== action.payload);
            return freshFeed;
        },
    },
});
export const { setFeed, removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;
