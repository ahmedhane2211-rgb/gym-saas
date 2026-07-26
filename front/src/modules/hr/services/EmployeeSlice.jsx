import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const employeeApi = createApi({
    reducerPath: "employeeApi",
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
    tagTypes: ["Employees", "Users"],
    endpoints: (build) => ({
        getEmployees: build.query({
            query: () => ({
                url: "employees",
                method: "GET"
            }),
            providesTags: ["Employees"]
        }),
        addEmployee: build.mutation({
            query: (body) => ({
                url: "employees",
                method: "POST",
                body
            }),
            invalidatesTags: ["Employees"]
        }),
        updateEmployee: build.mutation({
            query: ({ id, body }) => ({
                url: `employees/${id}`,
                method: "PUT",
                body
            }),
            invalidatesTags: ["Employees"]
        }),
        deleteEmployee: build.mutation({
            query: (id) => ({
                url: `employees/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Employees"]
        })
    })
});

export const {
    useGetEmployeesQuery,
    useAddEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation
} = employeeApi;
