import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const featureApi = createApi({
    reducerPath: "featureApi",
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
    tagTypes: ['Feature', 'PlanFeature'],
    endpoints: (build) => ({
        getFeatures: build.query({
            query: () => "features",
            providesTags: ['Feature']
        }),
        addFeature: build.mutation({
            query: (data) => ({
                url: "features",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Feature']
        }),
        updateFeature: build.mutation({
            query: ({ id, ...data }) => ({
                url: `features/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['Feature']
        }),
        deleteFeature: build.mutation({
            query: (id) => ({
                url: `features/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Feature']
        }),
        // Linked Features to Plans
        getPlanFeatures: build.query({
            query: (planId) => `features-plan/${planId}`,
            providesTags: ['PlanFeature']
        }),
        addFeatureToPlan: build.mutation({
            query: (data) => ({
                url: "features-plan",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['PlanFeature']
        }),
        removeFeatureFromPlan: build.mutation({
            query: (id) => ({
                url: `features-plan/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['PlanFeature']
        }),
        useFeature: build.mutation({
            query: (data) => ({
                url: "features-plan/use-feature",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['PlanFeature', 'Members']
        })
    })
});

export const { 
    useGetFeaturesQuery, 
    useAddFeatureMutation, 
    useUpdateFeatureMutation, 
    useDeleteFeatureMutation,
    useGetPlanFeaturesQuery,
    useAddFeatureToPlanMutation,
    useRemoveFeatureFromPlanMutation,
    useUseFeatureMutation
} = featureApi;
