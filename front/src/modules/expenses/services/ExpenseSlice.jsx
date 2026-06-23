import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const expenseApi = createApi({
    reducerPath: "expenseApi",
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
    tagTypes: ['Expenses'],
    endpoints: (build) => ({
        getExpenses: build.query({
            query: () => ({
                url: "expenses",
                method: "GET"
            }),
            providesTags: ['Expenses']
        }),
        getExpenseById: build.query({
            query: (id) => ({
                url: `expenses/${id}`,
                method: "GET"
            }),
            providesTags: (result, error, id) => [{ type: 'Expenses', id }]
        }),
        addExpense: build.mutation({
            query: (data) => ({
                url: "expenses",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Expenses']
        }),
        updateExpense: build.mutation({
            query: ({ id, body }) => ({
                url: `expenses/${id}`,
                method: "PUT",
                body: body
            }),
            invalidatesTags: ['Expenses']
        }),
        deleteExpense: build.mutation({
            query: (id) => ({
                url: `expenses/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Expenses']
        })
    })
});

export const { 
    useGetExpensesQuery, 
    useGetExpenseByIdQuery, 
    useAddExpenseMutation,
    useUpdateExpenseMutation, 
    useDeleteExpenseMutation 
} = expenseApi;
