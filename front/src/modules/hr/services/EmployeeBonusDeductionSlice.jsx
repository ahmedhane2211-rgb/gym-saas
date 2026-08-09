import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const employeeBonusDeductionApi = createApi({
    reducerPath: "employeeBonusDeductionApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_END_POINT}`,
        prepareHeaders: (headers) => {
            const token = Cookies.get("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["BonusDeductions"],
    endpoints: (build) => ({
        getMonthlyBonusDeductions: build.query({
            query: ({ month, year }) => ({
                url: `employee-bonus-deduction/monthly?month=${month}&year=${year}`,
                method: "GET"
            }),
            providesTags: ["BonusDeductions"]
        }),
        getEmployeeMonthlyBonusDeductions: build.query({
            query: ({ month, year, employee_id }) => ({
                url: `employee-bonus-deduction/${employee_id}/monthly?month=${month}&year=${year}`,
                method: "GET"
            }),
            providesTags: ["BonusDeductions"]
        }),
        getBonusDeductions: build.query({
            query: () => ({
                url: `employee-bonus-deduction`,
                method: "GET"
            }),
            providesTags: ["BonusDeductions"]
        }),
        addBonusDeduction: build.mutation({
            query: (body) => ({
                url: "employee-bonus-deduction",
                method: "POST",
                body
            }),
            invalidatesTags: ["BonusDeductions"]
        }),
        deleteBonusDeduction: build.mutation({
            query: (id) => ({
                url: `employee-bonus-deduction/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["BonusDeductions"]
        })
    })
});

export const {
    useGetMonthlyBonusDeductionsQuery,
    useGetEmployeeMonthlyBonusDeductionsQuery,
    useGetBonusDeductionsQuery,
    useAddBonusDeductionMutation,
    useDeleteBonusDeductionMutation
} = employeeBonusDeductionApi;
