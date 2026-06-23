import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const leavePermissionApi = createApi({
    reducerPath: "leavePermissionApi",
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
    tagTypes: ["LeavesPermissions"],
    endpoints: (build) => ({
        getLeavesPermissions: build.query({
            query: () => ({
                url: "leaves-permissions",
                method: "GET"
            }),
            providesTags: ["LeavesPermissions"]
        }),
        addLeavePermission: build.mutation({
            query: (body) => ({
                url: "leaves-permissions",
                method: "POST",
                body
            }),
            invalidatesTags: ["LeavesPermissions"]
        }),
        updateLeavePermission: build.mutation({
            query: ({ id, body }) => ({
                url: `leaves-permissions/${id}`,
                method: "PUT",
                body
            }),
            invalidatesTags: ["LeavesPermissions"]
        }),
        deleteLeavePermission: build.mutation({
            query: (id) => ({
                url: `leaves-permissions/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["LeavesPermissions"]
        }),
        approveLeavePermission: build.mutation({
            query: (id) => ({
                url: `leaves-permissions/${id}/approve`,
                method: "PUT"
            }),
            invalidatesTags: ["LeavesPermissions"]
        }),
        rejectLeavePermission: build.mutation({
            query: (id) => ({
                url: `leaves-permissions/${id}/reject`,
                method: "PUT"
            }),
            invalidatesTags: ["LeavesPermissions"]
        })
    })
});

export const {
    useGetLeavesPermissionsQuery,
    useAddLeavePermissionMutation,
    useUpdateLeavePermissionMutation,
    useDeleteLeavePermissionMutation,
    useApproveLeavePermissionMutation,
    useRejectLeavePermissionMutation
} = leavePermissionApi;
