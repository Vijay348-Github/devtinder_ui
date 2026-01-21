import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name: "requests",
    initialState: [],
    reducers: {
        setRequests: (state, action) => action.payload,
        clearRequest: (state, action) => {
            const newArray = state.filter(
                (request) => request._id !== action.payload,
            );
            return newArray;
        },
    },
});
export const { setRequests, clearRequest } = requestSlice.actions;
export default requestSlice.reducer;
