import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const fetchCategory = async () => {
    try {
        const response = await axios.get('/api/category')
        const dataCategory = response.data.result.data
        return dataCategory
    } catch (err) {
        console.error(err)
    }
}
const initialState = {
    data: fetchCategory(),
}

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        addCategory: (state, action) => {
            const name = action.payload.name;
            const slug = action.payload.slug;
            const img_url = action.payload.img_url;

            fetch(`/api/category`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    name: name,
                    slug: slug,
                    img_url: img_url
                })
            })
            state.data = fetchCategory();
        },
        editCategory: (state, action) => {
            const name = action.payload.name;
            const slug = action.payload.slug;
            const img_url = action.payload.img_url;

            fetch(`/api/category/${action.payload.id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    name: name,
                    slug: slug,
                    img_url: img_url
                })
            })
            state.data = fetchCategory();
        },
        deleteCategory: (state, action) => {
            const id = action.payload;
            fetch(`/api/category/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    id
                })
            });
            state.data = fetchCategory();
        }

    }
})
export const { addCategory, editCategory, deleteCategory } = categorySlice.actions
export default categorySlice.reducer