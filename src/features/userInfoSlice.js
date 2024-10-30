import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    user: {},
}

export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setInfo: (state, action) => {
            state.user = {
                id: action.payload.id,
                email: action.payload.email,
                access_token: action.payload.access_token,
                refresh_token: action.payload.refresh_token,
                username: action.payload.username,
                fullname: action.payload.fullname,
                phone: action.payload.phone,
                address: action.payload.address
            };
        },

    }
})
export const { setInfo } = userInfoSlice.actions
export default userInfoSlice.reducer