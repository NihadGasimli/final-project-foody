import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"


const fetchBasket = async () => {
    const token = JSON.parse(localStorage.getItem("access_token"));
    try {
        const response = await axios.get('/api/basket', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const dataBasket = response.data.result.data
        localStorage.setItem("basket", JSON.stringify(response.data.result.data))
        return dataBasket
    } catch (err) {
        console.log("Error in fetching basket:", err)
    }
}

const initialState = {
    data: fetchBasket(),
}
    
export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        addToBasket: async (state, action) => {
            const token = JSON.parse(localStorage.getItem("access_token"));
            try {
                await axios.post('/api/basket/add', {
                    product_id: action.payload
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                state.data = fetchBasket()
            }
            catch (err) {
                console.log(err)
                if (err.response?.status === 401 && token) {
                    const refreshToken = JSON.parse(localStorage.getItem("refresh_token"));
                    axios.post("/api/auth/refresh", {
                        "refresh_token": refreshToken
                    })
                        .then(response => {
                            const newToken = response.data.access_token;
                            localStorage.setItem("access_token", JSON.stringify(newToken));

                            // Retry the original request after updating the token
                            return axios.delete('/api/basket/delete', {
                                product_id: action.payload
                            }, {
                                headers: {
                                    Authorization: `Bearer ${newToken}`
                                }
                            });
                        })
                        .then(() => {
                            state.data = fetchBasket();
                        })
                        .catch(error => {
                            console.error("Error after refreshing token:", error);
                        });
                }

            }
        },
        clearBasket: async (state, action) => {
            const token = JSON.parse(localStorage.getItem("access_token"));
            try {
                await axios.delete('/api/basket/clear', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        basket_id: action.payload
                    }
                });
                state.data = fetchBasket()

            }
            catch (err) {
                console.log(err)
                if (err.response?.status === 401 && token) {
                    const refreshToken = JSON.parse(localStorage.getItem("refresh_token"));
                    axios.post("/api/auth/refresh", {
                        "refresh_token": refreshToken
                    })
                        .then(response => {
                            const newToken = response.data.access_token;
                            localStorage.setItem("access_token", JSON.stringify(newToken));

                            // Retry the original request after updating the token
                            return axios.delete('/api/basket/clear', {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                },
                                data: {
                                    basket_id: action.payload
                                }
                            });
                        })
                        .then(() => {
                            state.data = fetchBasket();
                        })
                        .catch(error => {
                            console.error("Error after refreshing token:", error);
                        });
                }
            }
        },
        deleteFromBasket: async (state, action) => {
            const token = JSON.parse(localStorage.getItem("access_token"));
            try {
                await axios.delete('/api/basket/delete', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        product_id: action.payload
                    }
                });
                state.data = fetchBasket()
            }
            catch (err) {
                console.log(err)
                if (err.response?.status === 401 && token) {
                    const refreshToken = JSON.parse(localStorage.getItem("refresh_token"));
                    axios.post("/api/auth/refresh", {
                        "refresh_token": refreshToken
                    })
                        .then(response => {
                            const newToken = response.data.access_token;
                            localStorage.setItem("access_token", JSON.stringify(newToken));

                            // Retry the original request after updating the token
                            return axios.delete('/api/basket/delete', {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                },
                                data: {
                                    product_id: action.payload
                                }
                            });
                        })
                        .then(() => {
                            state.data = fetchBasket();
                        })
                        .catch(error => {
                            console.error("Error after refreshing token:", error);
                        });
                }
            }
        }

    }
})
export const { addToBasket, deleteFromBasket, clearBasket } = basketSlice.actions
export default basketSlice.reducer




