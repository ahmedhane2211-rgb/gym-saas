import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const branchApi = createApi({
    reducerPath: "branchApi",
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
    tagTypes: ['Branch'],
    endpoints: (build) => ({
        getBranches: build.query({
            query: () => "branches",
            providesTags: ['Branch']
        }),
        getBranch: build.query({
            query: (id) => `branches/${id}`,
            providesTags: ['Branch']
        }),
        addBranch: build.mutation({
            query: (data) => ({
                url: "branches",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Branch']
        }),
        updateBranch: build.mutation({
            query: ({ id, ...data }) => ({
                url: `branches/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['Branch']
        }),
        deleteBranch: build.mutation({
            query: (id) => ({
                url: `branches/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Branch']
        })
    })
});

export const { 
    useGetBranchesQuery, 
    useGetBranchQuery, 
    useAddBranchMutation, 
    useUpdateBranchMutation, 
    useDeleteBranchMutation 
} = branchApi;
