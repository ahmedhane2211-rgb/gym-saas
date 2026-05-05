import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const planApi = createApi({
    reducerPath: "planApi",
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
    tagTypes: ['Plans'],
    endpoints: (build) => ({
        getPlans: build.query({
            query: () => ({
                url: "plans",
                method: "GET"
            }),
            providesTags: ['Plans']
        }),
        getPlanById: build.query({
            query: (id) => ({
                url: `plans/${id}`,
                method: "GET"
            }),
            providesTags: (result, error, id) => [{ type: 'Plans', id }]
        }),
        addPlan: build.mutation({
            query: (data) => ({
                url: "plans",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Plans']
        }),
        updatePlan: build.mutation({
            query: (data) => ({
                url: `plans/${data.id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['Plans']
        }),
        deletePlan: build.mutation({
            query: (id) => ({
                url: `plans/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Plans']
        })
    })
});

export const { 
    useGetPlansQuery, 
    useGetPlanByIdQuery, 
    useAddPlanMutation, 
    useUpdatePlanMutation, 
    useDeletePlanMutation 
} = planApi;
