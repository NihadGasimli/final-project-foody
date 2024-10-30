import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const fetchOrders = async () => {
    const token = JSON.parse(localStorage.getItem("access_token"));
    try {
        const response = await axios.get('/api/order', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const dataOrders = response.data.result.data
        console.log("orders", dataOrders)
        return dataOrders
    } catch (err) {
        console.error(err)
    }
}
const initialState = {
    data: fetchOrders(),
}

export const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {


    }
})
export const { } = ordersSlice.actions
export default ordersSlice.reducer