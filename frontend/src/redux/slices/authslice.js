import { createSlice } from "@reduxjs/toolkit";

 const authslice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isauthenticated: false
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isauthenticated = true
        },
        logout: (state) => {
            state.user = null;
            state.isauthenticated = false
        },
    },
});
export const { login, logout } = authslice.actions;
export default authslice.reducer