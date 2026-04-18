import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from 'js-cookie';

const initialState = {
    subscribes: [],
    subscribeSelected: null,
    loading: false,
    error: null,
}

// export const getSubscriptions = createAsyncThunk("subscriptions/get", async (params) => {
//     try {
//         const token = Cookies.get("token");
//         const response = await axios.get(import.meta.env.VITE_API_END_POINT + "/subscriptions", { 
//             params,
//             headers: {
//                 Authorization: "Bearer " + token
//             }
//         });
//         if (response.status !== 200) {
//             toast.error("Fetch failed");
//             return toast.error(response.data.message);
//         }
//         return response.data.data;
//     } catch (error) {
//         console.error(error);
//         toast.error(error.response?.data?.message || "Registration failed");
//         return null;
//     }
// });
// export const getSubscription = createAsyncThunk("subscriptions/getOne", async (id) => {
//     try {
//         const token = Cookies.get("token");
//         const response = await axios.get(import.meta.env.VITE_API_END_POINT + `/subscriptions/${id}`, {
//             headers: {
//                 Authorization: "Bearer " + token
//             }
//         });
//         if (response.status !== 200) {
//             toast.error("Fetch failed");
//             return toast.error(response.data.message);
//         }
//         return response.data.data;
//     } catch (error) {
//         console.error(error);
//         toast.error(error.response?.data?.message || "Registration failed");
//         return null;
//     }
// });

export const createSubscribe = createAsyncThunk("subscriptions/create", async (data) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.post(import.meta.env.VITE_API_END_POINT + "/subscribe", data, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        if (response.status !== 201) {
            toast.error("Registration failed");
            return toast.error(response.data.message);
        }

        return response.data.data;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Registration failed");
        return null;
    }
});

// export const updateSubscription = createAsyncThunk("subscriptions/update", async ({id, ...data}) => {
//     try {
//         const token = Cookies.get("token");
//         const response = await axios.put(import.meta.env.VITE_API_END_POINT + `/subscriptions/${id}`, data, {
//             headers: {
//                 Authorization: "Bearer " + token
//             }
//         });
//         if (response.status !== 200) {
//             toast.error("Update failed");
//             return toast.error(response.data.message);
//         }
//         return response.data.data;
//     } catch (error) {
//         console.error(error);
//         toast.error(error.response?.data?.message || "Update failed");
//         return null;
//     }
// });

// export const deleteSubscription = createAsyncThunk("subscriptions/delete", async (id) => {
//     try {
//         const token = Cookies.get("token");
        
//     } catch (error) {
//         console.error(error);
//         toast.error(error.response?.data?.message || "Delete failed");
//         return null;
//     }
// });

const subscribeSlice = createSlice({
    name: "subscribes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createSubscribe.fulfilled, (state, action) => {
            state.subscribes.push(action.payload);
        });
        builder.addCase(createSubscribe.rejected, (state, action) => {
            state.error = action.payload;
        });
        builder.addCase(createSubscribe.pending, (state) => {
            state.loading = true;
        });
    },
});

export default subscribeSlice.reducer;