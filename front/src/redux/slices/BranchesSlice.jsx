import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from 'js-cookie'


const initialState = {
    branches: [],
    branchSelected: null,
    loading: false,
    error: null,
}

export const getBranches = createAsyncThunk("branches/get", async () => {
    try {
        const response = await axios.get(import.meta.env.VITE_API_END_POINT + "/branches",{
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get("token")}`,
            },
        });
        if (response.status !== 200) {
            toast.error("Fetch failed");
            return toast.error(response.data.message);
        }
        return response.data.data;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to fetch branches");
        return null;
    }
});

export const getBranch = createAsyncThunk("branches/getSingle", async (id) => {
    try {
        const response = await axios.get(import.meta.env.VITE_API_END_POINT + `/branches/${id}`,{
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get("token")}`,
            },
        });
        if (response.status !== 200) {
            toast.error("Fetch failed");
            return toast.error(response.data.message);
        }
        return response.data.data;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to fetch branch");
        return null;
    }
});

export const createBranch = createAsyncThunk("branches/create", async (data) => {
    try {
        const response = await axios.post(import.meta.env.VITE_API_END_POINT + "/branches", data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get("token")}`,
            },
        });
        if (response.status !== 201) {
            return toast.error(response.data.message);
        }
        toast.success("Branch created successfully");
        return response.data.data;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to create branch");
        return null;
    }
});

export const updateBranch = createAsyncThunk("branches/update", async ({id, data}) => {
    try {
        const response = await axios.put(import.meta.env.VITE_API_END_POINT + `/branches/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get("token")}`,
            },
        });
        if (response.status !== 200) {
            toast.error("Update failed");
            return toast.error(response.data.message);
        }
        toast.success("Branch updated successfully");
        return response.data.data;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to update branch");
        return null;
    }
});

export const deleteBranch = createAsyncThunk("branches/delete", async (id) => {
    try {
        const response = await axios.delete(import.meta.env.VITE_API_END_POINT + `/branches/${id}`,{
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get("token")}`,
            },
        });
        if (response.status !== 200) {
            toast.error("Deletion failed");
            return toast.error(response.data.message);
        }
        toast.success("Branch deleted successfully");
        return id;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to delete branch");
        return null;
    }
});

const branchSlice = createSlice({
    name: "branches",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get all branches
            .addCase(getBranches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBranches.fulfilled, (state, action) => {
                state.branches = Array.isArray(action.payload) ? action.payload : (action.payload?.branches || []);
                state.loading = false;
                state.error = null;
            })
            .addCase(getBranches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Get single branch
            .addCase(getBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBranch.fulfilled, (state, action) => {
                state.branchSelected = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create branch
            .addCase(createBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBranch.fulfilled, (state, action) => {
                if (action.payload) {
                    state.branches.push(action.payload);
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(createBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update branch
            .addCase(updateBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBranch.fulfilled, (state, action) => {
                if (action.payload) {
                    state.branches = state.branches.map(branch => branch.id === action.payload.id ? action.payload : branch);
                    if (state.branchSelected?.id === action.payload.id) {
                        state.branchSelected = action.payload;
                    }
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(updateBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete branch
            .addCase(deleteBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBranch.fulfilled, (state, action) => {
                state.branches = state.branches.filter((branch) => branch.id !== action.payload);
                if (state.branchSelected?.id === action.payload) {
                    state.branchSelected = null;
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default branchSlice.reducer;