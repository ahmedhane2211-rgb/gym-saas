import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const salaryPaymentApi = createApi({
    reducerPath: "salaryPaymentApi",
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
    tagTypes: ["SalaryPayments"],
    endpoints: (build) => ({
        getAllPayments: build.query({
            query: () => ({
                url: "salary-payments",
                method: "GET"
            }),
            providesTags: ["SalaryPayments"]
        }),
        getMonthlyPayments: build.query({
            query: ({ month, year }) => ({
                url: `salary-payments/monthly?month=${month}&year=${year}`,
                method: "GET"
            }),
            providesTags: ["SalaryPayments"]
        }),
        getEmployeePayments: build.query({
            query: (employeeId) => ({
                url: `salary-payments/${employeeId}`,
                method: "GET"
            }),
            providesTags: ["SalaryPayments"]
        }),
        paySalary: build.mutation({
            query: (body) => ({
                url: "salary-payments",
                method: "POST",
                body
            }),
            invalidatesTags: ["SalaryPayments"]
        })
    })
});

export const {
    useGetAllPaymentsQuery,
    useGetMonthlyPaymentsQuery,
    useGetEmployeePaymentsQuery,
    usePaySalaryMutation
} = salaryPaymentApi;
