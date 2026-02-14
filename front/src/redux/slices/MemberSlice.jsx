import { createSlice } from "@reduxjs/toolkit";
import { membersList } from "../../assets/assets";

const initialState = {
    members: membersList || [],
    loading: false,
    error: null,
};


const memberSlice = createSlice({
    name: "member",
    initialState,
    reducers: {
        fetchMembers: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteMember: (state, action) => {
            console.log(action.payload)
            state.members = state.members.filter(member => String(member.id) !== String(action.payload));
        },
        addMember: (state, action) => {
            state.members.push(action.payload);
        },
    },
});


export const { fetchMembers, deleteMember,addMember } = memberSlice.actions;
export default memberSlice.reducer;