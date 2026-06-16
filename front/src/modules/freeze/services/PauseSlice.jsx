import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const pauseApi = createApi({
    reducerPath: "pauseApi",
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
    tagTypes: ['Pause'],
    endpoints: (build) => ({
        getPauses: build.query({
            query: (subscriptionId) => ({
                url: "subscription-pause",
                method: "GET",
                params: subscriptionId ? { subscription_id: subscriptionId } : {}
            }),
            providesTags: ['Pause']
        }),
        addPause: build.mutation({
            query: (data) => ({
                url: "subscription-pause",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Pause']
        }),
        deletePause: build.mutation({
            query: (id) => ({
                url: `subscription-pause/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Pause']
        })
    })
});

export const {
    useGetPausesQuery,
    useAddPauseMutation,
    useDeletePauseMutation
} = pauseApi;
