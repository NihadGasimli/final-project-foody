import { configureStore } from "@reduxjs/toolkit";
import { getDefaultMiddleware } from '@reduxjs/toolkit';

import restuarantReducer from '../../features/restaurantsSlice.js';
import productReducer from '../../features/productSlice.js';
import categoryReducer from "../../features/categorySlice.js";
import ordersReducer from "../../features/ordersSlice.js";
import offersReducer from "../../features/offersSlice.js";
import userInfoReducer from "../../features/userInfoSlice.js";
import pagesReducer from "../../features/pagesSlice.js"
import basketReducer from "../../features/basketSlice.js"
export const store = configureStore({
    reducer: {
        restuarant: restuarantReducer,
        product: productReducer,
        category: categoryReducer,
        orders: ordersReducer,
        offers: offersReducer,
        userInfo: userInfoReducer,
        inWhichPage: pagesReducer,
        basket: basketReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});