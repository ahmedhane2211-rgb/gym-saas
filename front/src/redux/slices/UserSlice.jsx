import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [
        {
            id: 1,
            fullName: "أحمد محمد",
            email: "ahmed@example.com",
            phone: "01012345678",
            role: "admin",
            isActive: true,
            photoUrl: null,
        },
        {
            id: 2,
            fullName: "فاطمة علي",
            email: "fatima@example.com",
            phone: "01112345678",
            role: "manager",
            isActive: true,
            photoUrl: null,
        },
        {
            id: 3,
            fullName: "محمود حسن",
            email: "mahmoud@example.com",
            phone: "01212345678",
            role: "staff",
            isActive: false,
            photoUrl: null,
        },
    ],
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        fetchUsers: (state) => {
            state.loading = true;
            state.error = null;
        },
        addUser: (state, action) => {
            const newUser = {
                id: Math.max(...state.users.map(u => u.id), 0) + 1,
                ...action.payload,
                isActive: action.payload.isActive ?? true,
            };
            state.users.push(newUser);
        },
        updateUser: (state, action) => {
            const index = state.users.findIndex(u => u.id === action.payload.id);
            if (index !== -1) {
                state.users[index] = {
                    ...state.users[index],
                    ...action.payload,
                };
            }
        },
        deleteUser: (state, action) => {
            state.users = state.users.filter(u => u.id !== action.payload);
        },
    },
});

export const { fetchUsers, addUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
