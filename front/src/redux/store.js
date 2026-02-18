import { configureStore } from "@reduxjs/toolkit";

import memberReducer from "./slices/MemberSlice";
import subscriptionReducer from "./slices/SubscriptionSlice";
import attendanceReducer from "./slices/AttendanceSlice";
import coachReducer from "./slices/CoachSlice";

export const store = configureStore({
    reducer: {
        members: memberReducer,
        coaches: coachReducer,
        subscriptions: subscriptionReducer,
        attendance: attendanceReducer,
    },
});
