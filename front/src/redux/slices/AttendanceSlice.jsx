import { createSlice } from "@reduxjs/toolkit";
import { attendanceList } from "../../assets/assets";

const initialState = {
    attendance: attendanceList || [],
    loading: false,
    error: null,
};

const attendanceSlice = createSlice({
    name: "attendance",
    initialState,
    reducers: {
        fetchAttendance: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteAttendance: (state, action) => {
            state.attendance = state.attendance.filter(record => String(record.id) !== String(action.payload));
        },
        addAttendance: (state, action) => {
            state.attendance.push(action.payload);
        },
    },
});

export const { fetchAttendance, deleteAttendance, addAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
