import { createSlice } from "@reduxjs/toolkit"
import { subscriptionPlans } from "../../assets/assets";

const initialState = {
    subscriptions: subscriptionPlans || [],
    loading: false,
    error: null,
}


const subscriptionSlice = createSlice({
    name: "subscriptions",
    initialState,
    reducers: {
        addSubscriptions: (state, action) => {
            state.subscriptions.push(action.payload);
            console.log(JSON.stringify(state.subscriptions))
        },
        deleteSubscription: (state, action) => {
            state.subscriptions = state.subscriptions.filter(
                (subscription) => String(subscription.id) !== String(action.payload)
            );
        }
    },
});

export const { addSubscriptions, deleteSubscription} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;