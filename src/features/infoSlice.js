"use client"

import { createSlice } from "@reduxjs/toolkit";
import { useParams } from "react-router";

const initialState = {
    page: ""
}

export const infoSlice = createSlice({
    name: "info",
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        }
    }
})

export const { setPage } = infoSlice.actions;
export default infoSlice.reducer;