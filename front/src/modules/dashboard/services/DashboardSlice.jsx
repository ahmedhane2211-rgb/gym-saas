import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
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
    tagTypes: ['Dashboard'],
    endpoints: (build) => ({
        getDashboardStats: build.query({
            query: () => ({
                url: "dashboard",
                method: "GET"
            }),
            providesTags: ['Dashboard']
        })
    })
});

export const { useGetDashboardStatsQuery } = dashboardApi;
