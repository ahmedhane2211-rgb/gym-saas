import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const voucherApi = createApi({
    reducerPath: "voucherApi",
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
    tagTypes: ['Vouchers'],
    endpoints: (build) => ({
        getVouchers: build.query({
            query: () => ({
                url: "vouchers",
                method: "GET"
            }),
            providesTags: ['Vouchers']
        }),
        getVoucherById: build.query({
            query: (id) => ({
                url: `vouchers/${id}`,
                method: "GET"
            }),
            providesTags: (result, error, id) => [{ type: 'Vouchers', id }]
        }),
        addVoucher: build.mutation({
            query: (data) => ({
                url: "vouchers",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Vouchers']
        }),
        updateVoucher: build.mutation({
            query: ({ id, body }) => ({
                url: `vouchers/${id}`,
                method: "PUT",
                body: body
            }),
            invalidatesTags: ['Vouchers']
        }),
        deleteVoucher: build.mutation({
            query: (id) => ({
                url: `vouchers/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Vouchers']
        })
    })
});

export const { 
    useGetVouchersQuery, 
    useGetVoucherByIdQuery, 
    useAddVoucherMutation,
    useUpdateVoucherMutation, 
    useDeleteVoucherMutation 
} = voucherApi;
