import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import toast from "react-hot-toast";

const initialState = {
    gyms: [],
    gymSelected: null,
    loading: false,
    error: null,
}

export const getGyms = createAsyncThunk("gyms/get", async () => {
    try {
        const response = await axios.get(import.meta.env.VITE_API_END_POINT + "/gym");
        if (response.status !== 200) {
            toast.error("Fetch failed");
            return toast.error(response.data.message);
        }
        return response.data.data;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to fetch gyms");
        return null;
    }
});

export const getGym = createAsyncThunk("gyms/getSingle", async (id) => {
    try {
        const response = await axios.get(import.meta.env.VITE_API_END_POINT + `/gym/${id}`);
        if (response.status !== 200) {
            toast.error("Fetch failed");
            return toast.error(response.data.message);
        }
        return response.data.data;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to fetch gym");
        return null;
    }
});

export const createGym = createAsyncThunk("gyms/create", async (data) => {
    try {
        const response = await axios.post(import.meta.env.VITE_API_END_POINT + "/gym", data);
        if (response.status !== 201) {
            toast.error("Creation failed");
            return toast.error(response.data.message);
        }
        toast.success("Gym created successfully");
        return response.data.data;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to create gym");
        return null;
    }
});

export const updateGym = createAsyncThunk("gyms/update", async ({id, ...data}) => {
    try {
        const response = await axios.put(import.meta.env.VITE_API_END_POINT + `/gym/${id}`, data);
        if (response.status !== 200) {
            toast.error("Update failed");
            return toast.error(response.data.message);
        }
        toast.success("Gym updated successfully");
        return response.data.data;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to update gym");
        return null;
    }
});

export const deleteGym = createAsyncThunk("gyms/delete", async (id) => {
    try {
        const response = await axios.delete(import.meta.env.VITE_API_END_POINT + `/gym/${id}`);
        if (response.status !== 200) {
            toast.error("Deletion failed");
            return toast.error(response.data.message);
        }
        toast.success("Gym deleted successfully");
        return id;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to delete gym");
        return null;
    }
});

const gymSlice = createSlice({
    name: "gyms",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get all gyms
            .addCase(getGyms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getGyms.fulfilled, (state, action) => {
                state.gyms = Array.isArray(action.payload) ? action.payload : (action.payload?.gyms || []);
                state.loading = false;
                state.error = null;
            })
            .addCase(getGyms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Get single gym
            .addCase(getGym.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getGym.fulfilled, (state, action) => {
                state.gymSelected = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getGym.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create gym
            .addCase(createGym.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGym.fulfilled, (state, action) => {
                if (action.payload) {
                    state.gyms.push(action.payload);
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(createGym.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update gym
            .addCase(updateGym.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGym.fulfilled, (state, action) => {
                if (action.payload) {
                    state.gyms = state.gyms.map(gym => gym.id === action.payload.id ? action.payload : gym);
                    if (state.gymSelected?.id === action.payload.id) {
                        state.gymSelected = action.payload;
                    }
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(updateGym.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete gym
            .addCase(deleteGym.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGym.fulfilled, (state, action) => {
                state.gyms = state.gyms.filter((gym) => gym.id !== action.payload);
                if (state.gymSelected?.id === action.payload) {
                    state.gymSelected = null;
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteGym.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default gymSlice.reducer;
