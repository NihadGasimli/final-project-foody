import { configureStore } from "@reduxjs/toolkit";

import infoReducer from "src/features/infoSlice.js";

export const store = configureStore({
    reducer: {
        info: infoReducer
    }
});