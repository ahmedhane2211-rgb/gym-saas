import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";


const initialState = {
    users: [],
    loading: false,
    error: null,
};

    export const getAllUsers = createAsyncThunk("users/getAll", async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_API_END_POINT + "/users");
            if(response.status !== 200){
                toast.error("Failed to fetch users");
                return [];
            }
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch users");
            return [];
        }
    })

    export const addUser = createAsyncThunk("users/add", async (data, {dispatch}) => {
        try {
            const response = await axios.post(import.meta.env.VITE_API_END_POINT + "/users", data);
            if(response.status !== 201){
                toast.error("Failed to add user");
                return null;
            }
            toast.success("User added successfully");
            dispatch(getAllUsers());
            return response.data;   
        } catch (error) {
            console.error(error.response?.data?.message);
            toast.error("Failed to add user");
            return null;
        }
    })
    
    export const deleteUser = createAsyncThunk("users/delete", async (id,{dispatch}) => {
        try {
            const response = await axios.delete(import.meta.env.VITE_API_END_POINT + `/users/${id}`);
            if(response.status !== 200){
                toast.error("Failed to delete user");
                return null;
            }
            toast.success("User deleted successfully");
            dispatch(getAllUsers());
            return id;   
        } catch (error) {
            console.error(error?.response?.data?.message);
            toast.error("Failed to delete user");
            return null;
        }
    })

    export const updateUser = createAsyncThunk("users/update", async ({id,...data},{dispatch}) => {
        try {
            const response = await axios.put(import.meta.env.VITE_API_END_POINT + `/users/${id}`, data);
            if(response.status !== 200){
                toast.error("Failed to update user");
                return null;
            }
            toast.success("User updated successfully");
            dispatch(getAllUsers());
            return response.data;   
        } catch (error) {
            console.error(error?.response?.data?.message);
            toast.error("Failed to update user");
            return null;
        }
    })

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.users = Array.isArray(action.payload) ? action.payload : [];
                state.loading = false;
                state.error = null;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
                state.users = [];
            })
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
                state.error = null;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(user => user.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.map(user => user.id === action.payload.id ? action.payload : user);
                state.error = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});


export default userSlice.reducer;
