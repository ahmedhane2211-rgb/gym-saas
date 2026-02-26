import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";

const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("token"),
};

export const loginUser = createAsyncThunk("auth/login", async (data) => {
    try {
        const response = await axios.post(import.meta.env.VITE_API_END_POINT + "/auth/login", data);
        if (response.status !== 200) {
            toast.error("Login failed");
            return null;
        }
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        toast.success("Login successful");
        return { token, user };
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Login failed");
        return null;
    }
});

export const registerUser = createAsyncThunk("auth/register", async (data) => {
    try {
        const response = await axios.post(import.meta.env.VITE_API_END_POINT + "/auth/register", data);
        if (response.status !== 201) {
            toast.error("Registration failed");
            return null;
        }
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        toast.success("Registration successful");
        return { token, user };
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Registration failed");
        return null;
    }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
    try {
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        return null;
    } catch (error) {
        console.error(error);
        toast.error("Logout failed");
        return null;
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                    state.isAuthenticated = true;
                }
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.isAuthenticated = false;
            })
            // Register cases
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                    state.isAuthenticated = true;
                }
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.isAuthenticated = false;
            })
            // Logout cases
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;
                state.loading = false;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
