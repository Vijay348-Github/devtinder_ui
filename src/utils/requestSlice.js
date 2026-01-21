import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name: "requests",
    initialState: [],
    reducers: {
        setRequests: (state, action) => action.payload,
        clearRequests: () => [],
    },
});
export const { setRequests, clearRequests } = requestSlice.actions;
export default requestSlice.reducer;