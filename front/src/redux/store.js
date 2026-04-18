import { configureStore } from "@reduxjs/toolkit";

import planReducer from "./slices/PlanSlice";
import memberReducer from "./slices/MemberSlice";
import attendanceReducer from "./slices/AttendanceSlice";
import coachReducer from "./slices/CoachSlice";
import userReducer from "./slices/UserSlice";
import authReducer from "./slices/AuthSlice";
import gymReducer from "./slices/GymSlice";
import branchesReducer from "./slices/BranchesSlice";
import subscribeReducer from "./slices/SubscribeSlice";

export const store = configureStore({
    reducer: {
        members: memberReducer,
        coaches: coachReducer,
        plans: planReducer,
        attendance: attendanceReducer,
        users: userReducer,
        auth: authReducer,
        gyms: gymReducer,
        branches: branchesReducer,
        subscribes: subscribeReducer,
    },
});
