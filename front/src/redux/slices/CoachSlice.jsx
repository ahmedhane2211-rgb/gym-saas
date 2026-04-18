import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from 'js-cookie';

const initialState = {
  coaches: [],
  loading: false,
  error: null,
};

export const getCoaches = createAsyncThunk("coaches/getAll", async () => {
    try {
        const token = Cookies.get("token");
        const response = await axios.get(import.meta.env.VITE_API_END_POINT + "/coaches", {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        if (response.status !== 200) {
            return toast.error("Failed to fetch coaches");
        }
        return response.data.data;
    } catch (error) {
        console.error(error);
        return toast.error("Failed to fetch coaches");
    }
});

export const addCoach = createAsyncThunk("coaches/add", async (data) => {
    try {
        const token = Cookies.get("token"); 
        const response = await axios.post(import.meta.env.VITE_API_END_POINT + "/coaches", data, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        if (response.status !== 201) {
            return toast.error("Failed to add coach");
        }
        return response.data.data;
    } catch (error) {
        console.error(error);
        return toast.error(error.response?.data?.message || "Failed to add coach");
    }
});

export const updateCoach = createAsyncThunk("coaches/update", async ({ id, data }, { dispatch }) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.put(import.meta.env.VITE_API_END_POINT + `/coaches/${id}`, data, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        if (response.status !== 200) {
            return toast.error("Failed to update coach");
        }
        dispatch(getCoaches());
        return response.data;
    } catch (error) {
        console.error(error);
        return toast.error("Failed to update coach");
    }
});

export const deleteCoach = createAsyncThunk("coaches/delete", async (id) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.delete(import.meta.env.VITE_API_END_POINT + `/coaches/${id}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        if (response.status !== 200) {
            return toast.error("Failed to delete coach");
        }
        return id;
    } catch (error) {
        console.error(error);
        return toast.error("Failed to delete coach");
    }
});

const coachSlice = createSlice({
  name: "coach",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(getCoaches.pending, (state) => {
            state.loading = true;
        })
        .addCase(getCoaches.fulfilled, (state, action) => {
            state.coaches = Array.isArray(action.payload) ? action.payload : [];
            state.loading = false;
        })
        .addCase(getCoaches.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(addCoach.fulfilled, (state, action) => {
            state.coaches.push(action.payload);
        })
        .addCase(deleteCoach.fulfilled, (state, action) => {
            state.coaches = state.coaches.filter(coach => coach.id !== action.payload);
        });
  }
});

export default coachSlice.reducer;
