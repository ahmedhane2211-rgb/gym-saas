import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const coachApi = createApi({
    reducerPath: "coachApi",
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
    tagTypes: ['Coaches'],
    endpoints: (build) => ({
        getCoaches: build.query({
            query: () => ({
                url: "coaches",
                method: "GET"
            }),
            providesTags: ['Coaches']
        }),
        getCoachById: build.query({
            query: (id) => ({
                url: `coaches/${id}`,
                method: "GET"
            }),
            providesTags: (result, error, id) => [{ type: 'Coaches', id }]
        }),
        addCoach: build.mutation({
            query: (data) => ({
                url: "coaches",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Coaches']
        }),
        updateCoach: build.mutation({
            query: (data) => ({
                url: `coaches/${data.id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['Coaches']
        }),
        deleteCoach: build.mutation({
            query: (id) => ({
                url: `coaches/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Coaches']
        })
    })
});

export const { 
    useGetCoachesQuery, 
    useGetCoachByIdQuery, 
    useAddCoachMutation,
    useUpdateCoachMutation, 
    useDeleteCoachMutation 
} = coachApi;
