import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const pumpingMoneyApi = createApi({
    reducerPath: "pumpingMoneyApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_END_POINT}`,
        prepareHeaders: (headers) => {
            const token = Cookies.get("token");
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["PumpingMoney"],
    endpoints: (build) => ({
        getPumpingMoney: build.query({
            query: () => ({ url: "pumping-money", method: "GET" }),
            providesTags: ["PumpingMoney"],
        }),
        getPumpingMoneyById: build.query({
            query: (id) => ({ url: `pumping-money/${id}`, method: "GET" }),
            providesTags: (result, error, id) => [{ type: "PumpingMoney", id }],
        }),
        addPumpingMoney: build.mutation({
            query: (body) => ({ url: "pumping-money", method: "POST", body }),
            invalidatesTags: ["PumpingMoney"],
        }),
        deletePumpingMoney: build.mutation({
            query: (id) => ({ url: `pumping-money/${id}`, method: "DELETE" }),
            invalidatesTags: ["PumpingMoney"],
        }),
    }),
});

export const {
    useGetPumpingMoneyQuery,
    useGetPumpingMoneyByIdQuery,
    useAddPumpingMoneyMutation,
    useDeletePumpingMoneyMutation,
} = pumpingMoneyApi;
