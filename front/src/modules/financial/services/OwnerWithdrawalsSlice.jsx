import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const ownerWithdrawalsApi = createApi({
    reducerPath: "ownerWithdrawalsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_END_POINT}`,
        prepareHeaders: (headers) => {
            const token = Cookies.get("token");
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["OwnerWithdrawals"],
    endpoints: (build) => ({
        getOwnerWithdrawals: build.query({
            query: () => ({ url: "owner-withdrawals", method: "GET" }),
            providesTags: ["OwnerWithdrawals"],
        }),
        getOwnerWithdrawalById: build.query({
            query: (id) => ({ url: `owner-withdrawals/${id}`, method: "GET" }),
            providesTags: (result, error, id) => [{ type: "OwnerWithdrawals", id }],
        }),
        addOwnerWithdrawal: build.mutation({
            query: (body) => ({ url: "owner-withdrawals", method: "POST", body }),
            invalidatesTags: ["OwnerWithdrawals"],
        }),
        deleteOwnerWithdrawal: build.mutation({
            query: (id) => ({ url: `owner-withdrawals/${id}`, method: "DELETE" }),
            invalidatesTags: ["OwnerWithdrawals"],
        }),
    }),
});

export const {
    useGetOwnerWithdrawalsQuery,
    useGetOwnerWithdrawalByIdQuery,
    useAddOwnerWithdrawalMutation,
    useDeleteOwnerWithdrawalMutation,
} = ownerWithdrawalsApi;
