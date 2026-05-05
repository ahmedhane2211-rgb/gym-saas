import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const invoiceApi = createApi({
    reducerPath: "invoiceApi",
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
    tagTypes: ['Invoice'],
    endpoints: (build) => ({
        getInvoices: build.query({
            query: () => "invoices",
            providesTags: ['Invoice']
        }),
        addInvoice: build.mutation({
            query: (data) => ({
                url: "invoices",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Invoice']
        }),
        addRefund: build.mutation({
            query: (data) => ({
                url: "refunds",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Invoice']
        }),
    })
});

export const {
    useGetInvoicesQuery,
    useAddInvoiceMutation,
    useAddRefundMutation,
} = invoiceApi;
