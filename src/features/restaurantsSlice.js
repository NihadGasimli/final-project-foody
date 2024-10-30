import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const fetchRestaurant = async () => {
    try {
        const response = await axios.get('/api/restuarants')
        const dataRestuarant = response.data.result.data
        return dataRestuarant
    } catch (err) {
        console.error(err)
    }
}
const initialState = {
    data: fetchRestaurant(),
}

export const restaurantSlice = createSlice({
    name: 'restuarant',
    initialState,
    reducers: {
        deleteRestuarant: (state, action) => {
            const id = action.payload;
            fetch(`/api/restuarants/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    id
                })
            });
            state.data = fetchRestaurant();
        },
        addRestaurant: (state, action) => {
            const name = action.payload.name;
            const category_id = action.payload.category_id;
            const img_url = action.payload.img_url;
            const cuisine = action.payload.cuisine;
            const address = action.payload.address;
            const delivery_min = action.payload.delivery_min;
            const delivery_price = action.payload.delivery_price;

            fetch(`/api/restuarants`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    name,
                    category_id,
                    img_url,
                    cuisine,
                    address,
                    delivery_min,
                    delivery_price
                })
            });
            state.data = fetchRestaurant();
        },
        editRestaurant: (state, action) => {
            const name = action.payload.name;
            const category_id = action.payload.category_id;
            const img_url = action.payload.img_url;
            const cuisine = action.payload.cuisine;
            const address = action.payload.address;
            const delivery_min = action.payload.delivery_min;
            const delivery_price = action.payload.delivery_price;

            fetch(`/api/restuarants/${action.payload.id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    name,
                    category_id,
                    img_url,
                    cuisine,
                    address,
                    delivery_min,
                    delivery_price
                })
            });
            state.data = fetchRestaurant();
        }
    }
})
export const { deleteRestuarant, addRestaurant, editRestaurant } = restaurantSlice.actions
export default restaurantSlice.reducer




