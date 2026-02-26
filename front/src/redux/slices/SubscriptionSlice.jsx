import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import toast from "react-hot-toast";

const initialState = {
    subscriptions: [],
    subscriptionSelected: null,
    loading: false,
    error: null,
}

export const getSubscriptions = createAsyncThunk("subscriptions/get", async (data) => {
    try {
        const response = await axios.get(import.meta.env.VITE_API_END_POINT + "/subscriptions", data);
        if (response.status !== 200) {
            toast.error("Fetch failed");
            return toast.error(response.data.message);
        }
        return response.data.data;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Registration failed");
        return null;
    }
});
export const getSubscription = createAsyncThunk("subscriptions/getOne", async (id) => {
    try {
        const response = await axios.get(import.meta.env.VITE_API_END_POINT + `/subscriptions/${id}`);
        if (response.status !== 200) {
            toast.error("Fetch failed");
            return toast.error(response.data.message);
        }
        return response.data.data;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Registration failed");
        return null;
    }
});

export const createSubscription = createAsyncThunk("subscriptions/create", async (data) => {
    try {
        const response = await axios.post(import.meta.env.VITE_API_END_POINT + "/subscriptions", data);
        if (response.status !== 201) {
            toast.error("Registration failed");
            return toast.error(response.data.message);
        }
        return response.data;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Registration failed");
        return null;
    }
});

export const deleteSubscription = createAsyncThunk("subscriptions/delete", async (id) => {
    try {
        const response = await axios.delete(import.meta.env.VITE_API_END_POINT + `/subscriptions/${id}`);
        if (response.status !== 200) {
            toast.error("Fetch failed");
            return toast.error(response.data.message);
        }
        return response.data.data;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Registration failed");
        return null;
    }
});

const subscriptionSlice = createSlice({
    name: "subscriptions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSubscriptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSubscriptions.fulfilled, (state, action) => {
                state.subscriptions = Array.isArray(action.payload) ? action.payload : (action.payload?.subscriptions || []);
                state.loading = false;
                state.error = null;
            })
            .addCase(getSubscriptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getSubscription.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSubscription.fulfilled, (state, action) => {
                state.subscriptionSelected = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getSubscription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createSubscription.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSubscription.fulfilled, (state, action) => {
                state.subscriptions.push(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(createSubscription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteSubscription.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSubscription.fulfilled, (state, action) => {
                state.subscriptions = state.subscriptions.filter((subscription) => subscription.id !== action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteSubscription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { addSubscriptions} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;