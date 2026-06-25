import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const employeeWithdrawalsApi = createApi({
    reducerPath: "employeeWithdrawalsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_END_POINT}`,
        prepareHeaders: (headers) => {
            const token = Cookies.get("token");
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["EmployeeWithdrawals"],
    endpoints: (build) => ({
        getEmployeeWithdrawals: build.query({
            query: () => ({ url: "employee-withdrawals", method: "GET" }),
            providesTags: ["EmployeeWithdrawals"],
        }),
        getEmployeeWithdrawalById: build.query({
            query: (id) => ({ url: `employee-withdrawals/${id}`, method: "GET" }),
            providesTags: (result, error, id) => [{ type: "EmployeeWithdrawals", id }],
        }),
        addEmployeeWithdrawal: build.mutation({
            query: (body) => ({ url: "employee-withdrawals", method: "POST", body }),
            invalidatesTags: ["EmployeeWithdrawals"],
        }),
        deleteEmployeeWithdrawal: build.mutation({
            query: (id) => ({ url: `employee-withdrawals/${id}`, method: "DELETE" }),
            invalidatesTags: ["EmployeeWithdrawals"],
        }),
    }),
});

export const {
    useGetEmployeeWithdrawalsQuery,
    useGetEmployeeWithdrawalByIdQuery,
    useAddEmployeeWithdrawalMutation,
    useDeleteEmployeeWithdrawalMutation,
} = employeeWithdrawalsApi;
