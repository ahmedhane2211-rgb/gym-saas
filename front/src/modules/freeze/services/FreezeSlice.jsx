import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const freezeApi = createApi({
    reducerPath: "freezeApi",
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
    tagTypes: ['Freeze'],
    endpoints: (build) => ({
        getFreezePlans: build.query({
            query: () => ({
                url: "subscription-freeze",
                method: "GET"
            }),
            providesTags: ['Freeze']
        }),
        getFreezePlanById: build.query({
            query: (id) => ({
                url: `subscription-freeze/${id}`,
                method: "GET"
            }),
            providesTags: (result, error, id) => [{ type: 'Freeze', id }]
        }),
        addFreezePlan: build.mutation({
            query: (data) => ({
                url: "subscription-freeze",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Freeze']
        }),
        updateFreezePlan: build.mutation({
            query: (data) => ({
                url: `subscription-freeze/${data.id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['Freeze']
        }),
        deleteFreezePlan: build.mutation({
            query: (id) => ({
                url: `subscription-freeze/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Freeze']
        })
    })
});

export const {
    useGetFreezePlansQuery,
    useGetFreezePlanByIdQuery,
    useAddFreezePlanMutation,
    useUpdateFreezePlanMutation,
    useDeleteFreezePlanMutation
} = freezeApi;
