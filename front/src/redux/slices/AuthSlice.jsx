import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from 'js-cookie'

const initialState = {
    user: null,
    onlineUser:null,
    token: null,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk("auth/login", async (data) => {
    try {
        const response = await axios.post(import.meta.env.VITE_API_END_POINT + "/auth/login", data);
        if (response.status !== 201) {
            toast.error("Login failed");
            return null;
        }
        const { token, user } = response.data;
        Cookies.set("token", token, { expires: 7, secure: true, sameSite: "strict" });
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
        Cookies.set("token", token, { expires: 7, secure: true, sameSite: "strict" });
        toast.success("Registration successful");
        return { token, user };
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Registration failed");
        return null;
    }
});

export const getUser = createAsyncThunk("auth/getUser", async () => {
    try {
        const response = await axios.get(import.meta.env.VITE_API_END_POINT + "/auth/user", {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
        });
        if (response.status !== 200) {
            toast.error("Failed to get user");
            return null;
        }
        const user = response.data.data;
        return user;
    } catch (error) {
        console.error(error);
        toast.error("Failed to get user");
        return null;
    }
});

// export const logoutUser = createAsyncThunk("auth/logout", async () => {
//     try {
//         Cookies.remove("token");
//         toast.success("Logged out successfully");
//         return null;
//     } catch (error) {
//         console.error(error);
//         toast.error("Logout failed");
//         return null;
//     }
// });

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        logoutUser : (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            state.loading = false;
        }
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
                }
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
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
                }
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Get user cases
            .addCase(getUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.onlineUser = action.payload;
                state.error = null;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export const { clearError,logoutUser } = authSlice.actions;
export default authSlice.reducer;
