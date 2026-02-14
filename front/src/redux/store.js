import { configureStore } from "@reduxjs/toolkit";
import memberReducer from "./slices/MemberSlice";

export const store = configureStore({
    reducer: {
        members: memberReducer,
    },
});