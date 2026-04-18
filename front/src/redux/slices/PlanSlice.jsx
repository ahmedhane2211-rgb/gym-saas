import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from 'js-cookie';

const initialState = {
    plans: [],
    planSelected: null,
    loading: false,
    error: null,
}

export const getPlans = createAsyncThunk("plans/get", async (params) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.get(import.meta.env.VITE_API_END_POINT + "/plans", { 
            params,
            headers: {
                Authorization: "Bearer " + token
            }
        });
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
export const getPlan = createAsyncThunk("plan/getOne", async (id) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.get(import.meta.env.VITE_API_END_POINT + `/plans/${id}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
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

export const createPlan = createAsyncThunk("createPlan/create", async (data) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.post(import.meta.env.VITE_API_END_POINT + "/plans", data, {
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

export const updatePlan = createAsyncThunk("updatePlan/update", async ({id, ...data}) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.put(import.meta.env.VITE_API_END_POINT + `/plans/${id}`, data, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        if (response.status !== 200) {
            toast.error("Update failed");
            return toast.error(response.data.message);
        }
        return response.data.data;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Update failed");
        return null;
    }
});

export const deletePlan = createAsyncThunk("deletePlan/delete", async (id) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.delete(import.meta.env.VITE_API_END_POINT + `/plans/${id}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        if (response.status !== 200) {
            toast.error("Delete failed");
            return toast.error(response.data.message);
        }
        return id;
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Delete failed");
        return null;
    }
});

const planSlice = createSlice({
    name: "plans",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPlans.fulfilled, (state, action) => {
                state.plans = Array.isArray(action.payload) ? action.payload : (action.payload?.plans || []);
                state.loading = false;
                state.error = null;
            })
            .addCase(getPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPlan.fulfilled, (state, action) => {
                state.planSelected = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPlan.fulfilled, (state, action) => {
                state.plans.push(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(createPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deletePlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePlan.fulfilled, (state, action) => {
                state.plans = state.plans.filter((Plan) => Plan.id !== action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(deletePlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updatePlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePlan.fulfilled, (state, action) => {
                const index = state.plans.findIndex(sub => sub.id === action.payload.id);
                if (index !== -1) {
                    state.plans[index] = action.payload;
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(updatePlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { addplans} = planSlice.actions;
export default planSlice.reducer;