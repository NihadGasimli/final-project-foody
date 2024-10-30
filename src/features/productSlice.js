import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const fetchProducts = async () => {
    try {
        const response = await axios.get('/api/products')
        const dataRestuarant = response.data.result.data
        return dataRestuarant
    } catch (err) {
        console.error(err)
    }
}
const initialState = {
    data: fetchProducts(),
}

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        addProduct: (state, action) => {
            const name = action.payload.name;
            const description = action.payload.description;
            const img_url = action.payload.img_url;
            const rest_id = action.payload.rest_id;
            const price = action.payload.price;

            fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    name,
                    description,
                    img_url,
                    rest_id,
                    price
                })
            })
            state.data = fetchProducts();

        }, editProduct: (state, action) => {
            const name = action.payload.name;
            const description = action.payload.description;
            const img_url = action.payload.img_url;
            const rest_id = action.payload.rest_id;
            const price = action.payload.price;

            fetch(`/api/products/${action.payload.id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    name,
                    description,
                    img_url,
                    rest_id,
                    price
                })
            });
            state.data = fetchProducts();
        },
        deleteProduct: (state, action) => {
            const id = action.payload;
            fetch(`/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    id
                })
            });
            state.data = fetchProducts();
        }
    }
})
export const { addProduct, editProduct, deleteProduct } = productSlice.actions
export default productSlice.reducer