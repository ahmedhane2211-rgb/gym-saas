import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const leaveApi = createApi({
    reducerPath: "leaveApi",
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
    tagTypes: ["Leaves"],
    endpoints: (build) => ({
        getLeaves: build.query({
            query: () => ({
                url: "leaves",
                method: "GET"
            }),
            providesTags: ["Leaves"]
        }),
        addLeave: build.mutation({
            query: (body) => ({
                url: "leaves",
                method: "POST",
                body
            }),
            invalidatesTags: ["Leaves"]
        }),
        updateLeave: build.mutation({
            query: ({ id, body }) => ({
                url: `leaves/${id}`,
                method: "PUT",
                body
            }),
            invalidatesTags: ["Leaves"]
        }),
        deleteLeave: build.mutation({
            query: (id) => ({
                url: `leaves/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Leaves"]
        })
    })
});

export const {
    useGetLeavesQuery,
    useAddLeaveMutation,
    useUpdateLeaveMutation,
    useDeleteLeaveMutation
} = leaveApi;
