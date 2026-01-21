import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: "connections",
    initialState: [],
    reducers: {
        setConnections: (state, action) => action.payload,
        clearConnections: () => [],
    },
});

export const { setConnections, clearConnections } = connectionSlice.actions;
export default connectionSlice.reducer;
