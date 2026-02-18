import { createSlice } from "@reduxjs/toolkit";
import { coachesList } from "../../assets/assets";

const initialState = {
  coaches: coachesList || [],
  loading: false,
  error: null,
};

const coachSlice = createSlice({
  name: "coach",
  initialState,
  reducers: {
    deleteCoach: (state, action) => {
      state.coaches = state.coaches.filter((coach) => String(coach.id) !== String(action.payload));
    },
    addCoach: (state, action) => {
      state.coaches.push(action.payload);
    },
    updateCoach: (state, action) => {
      const index = state.coaches.findIndex((coach) => String(coach.id) === String(action.payload.id));
      if (index !== -1) state.coaches[index] = action.payload;
    },
  },
});

export const { deleteCoach, addCoach, updateCoach } = coachSlice.actions;
export default coachSlice.reducer;
