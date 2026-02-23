import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";


const initialState = {
    members: [],
    loading: false,
    error: null,
};

    export const getAllMembers = createAsyncThunk("members/getAll", async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_API_END_POINT + "/members");
            if(response.status !== 200){
                return toast.error("Failed to fetch members");
            }
            return response.data.data;
        } catch (error) {
            console.error(error);
            return toast.error("Failed to fetch members");
        }
    })

    export const addMember = createAsyncThunk("members/add", async (data) => {
        try {
            const response = await axios.post(import.meta.env.VITE_API_END_POINT + "/members", data);
            if(response.status !== 201){
                return toast.error("Failed to add member");
            }
            return response.data.data;   
        } catch (error) {
            console.error(error.response.message);
            return toast.error("Failed to add member");
        }
    })
    
    export const deleteMember = createAsyncThunk("members/delete", async (id,{dispatch}) => {
        try {
            const response = await axios.delete(import.meta.env.VITE_API_END_POINT + `/members/${id}`);
            if(response.status !== 200){
                return toast.error("Failed to delete member");
            }
            dispatch(getAllMembers());
            return response.data;   
        } catch (error) {
            console.error(error?.response?.data?.message);
            return toast.error("Failed to delete member");
        }
    })

    export const updateMember = createAsyncThunk("members/update", async ({id,...data},{dispatch}) => {
        try {
            const response = await axios.put(import.meta.env.VITE_API_END_POINT + `/members/${id}`, data);
            if(response.status !== 200){
                return toast.error("Failed to update member");
            }
            dispatch(getAllMembers());
            return response.data;   
        } catch (error) {
            console.error(error?.response?.data?.message);
            return toast.error("Failed to update member");
        }
    })
const memberSlice = createSlice({
    name: "member",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllMembers.fulfilled, (state, action) => {
                state.members = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAllMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })
            .addCase(addMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMember.fulfilled, (state, action) => {
                state.members.push(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(addMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })
            .addCase(deleteMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMember.fulfilled, (state, action) => {
                state.members = state.members.filter(member => member.id !== action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMember.fulfilled, (state, action) => {
                const index = state.members.findIndex(member => member.id === action.payload.id);
                if (index !== -1) {
                    state.members[index] = action.payload;
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(updateMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});


// export const { fetchMembers, deleteMember,addMember } = memberSlice.actions;
export default memberSlice.reducer;