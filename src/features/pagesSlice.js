import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    page: "",
    admin: { username: "admin", password: "admin" }
}

export const pagesSlice = createSlice({
    name: "pages",
    initialState,
    reducers: {
        settingPage: (state, action) => {
            state.page = action.payload;
        }
    }
})

export const { settingPage } = pagesSlice.actions;
export default pagesSlice.reducer;