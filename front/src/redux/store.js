import { configureStore } from "@reduxjs/toolkit";

import memberReducer from "./slices/MemberSlice";
import subscriptionReducer from "./slices/SubscriptionSlice";
import attendanceReducer from "./slices/AttendanceSlice";
import coachReducer from "./slices/CoachSlice";
import userReducer from "./slices/UserSlice";
import authReducer from "./slices/AuthSlice";
import gymReducer from "./slices/GymSlice";
import branchesReducer from "./slices/BranchesSlice";

export const store = configureStore({
    reducer: {
        members: memberReducer,
        coaches: coachReducer,
        subscriptions: subscriptionReducer,
        attendance: attendanceReducer,
        users: userReducer,
        auth: authReducer,
        gyms: gymReducer,
        branches: branchesReducer,
    },
});
