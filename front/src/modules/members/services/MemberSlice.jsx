import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const memberApi = createApi({
    reducerPath: "memberApi",
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
    tagTypes: ['Members','Freeze','Pause','Subscribe'],
    endpoints: (build) => ({
        getMembers: build.query({
            query: () => ({
                url: "members",
                method: "GET"
            }),
            providesTags: ['Members']
        }),
        getMemberById: build.query({
            query: (id) => ({
                url: `members/${id}`,
                method: "GET"
            }),
            providesTags: (result, error, id) => [{ type: 'Members', id }]
        }),
        addMember: build.mutation({
            query: (data) => ({
                url: "members",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Members']
        }),
        updateMember: build.mutation({
            query: (data) => ({
                url: `members/${data.id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['Members']
        }),
        deleteMember: build.mutation({
            query: (data) => ({
                url: `members/${data.id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Members']
        })
    })
});

export const { 
    useGetMembersQuery, 
    useGetMemberByIdQuery, 
    useAddMemberMutation,
    useUpdateMemberMutation, 
    useDeleteMemberMutation 
} = memberApi;