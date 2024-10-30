import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const fetchOffers = async () => {
    try {
        const response = await axios.get('/api/offer')
        const dataOffers = response.data.result.data
        return dataOffers
    } catch (err) {
        console.error(err)
    }
}
const initialState = {
    data: fetchOffers(),
}

export const offersSlice = createSlice({
    name: 'offers',
    initialState,
    reducers: {
        editOffer: (state, action) => {
            const id = action.payload.id;
            const name = action.payload.name;
            const description = action.payload.description;
            const img_url = action.payload.img_url;

            fetch(`/api/offer/${id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    name,
                    description,
                    img_url,
                })
            });
            state.data = fetchOffers();
        },
        deleteOffer: (state, action) => {
            const id = action.payload;
            fetch(`/api/offer/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    id
                })
            })

            state.data = fetchOffers();
        },
        addOffer: (state, action) => {
            const name = action.payload.name;
            const description = action.payload.description;
            const img_url = action.payload.img_url;

            fetch("/api/offer", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    name,
                    description,
                    img_url
                })
            })

            state.data = fetchOffers();
        }

    }
})
export const { editOffer, deleteOffer, addOffer } = offersSlice.actions
export default offersSlice.reducer