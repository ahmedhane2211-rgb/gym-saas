import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const cashApi = createApi({
    reducerPath: "cashApi",
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
    tagTypes: ['Cash-report', 'members','invoices','subscription'],
    endpoints: (build) => ({
        getCashReport: build.query({
            query: (params) => ({
                url: "cash-report",
                params: params,
            }),
            providesTags: ['Cash']
        }),
    })
});

export const {
    useGetCashReportQuery,
} = cashApi;
