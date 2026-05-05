import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const subscribeApi = createApi({
    reducerPath: "subscribeApi",
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
    tagTypes: ['Subscribe'],
    endpoints: (build) => ({
        getSubscribe: build.query({
            query: () => "subscribe",
            providesTags: ['Subscribe']
        }),
        addSubscribe: build.mutation({
            query: (data) => ({
                url: "subscribe",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Subscribe']
        }),
        updateSubscribe: build.mutation({
            query: ({ id, ...data }) => ({
                url: `subscribe/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['subscribe']
        }),
        deleteSubscribe: build.mutation({
            query: (id) => ({
                url: `subscribe/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['subscribe']
        })
    })
});

export const { 
    useGetSubscribeQuery, 
    useAddSubscribeMutation, 
    useUpdateSubscribeMutation, 
    useDeleteSubscribeMutation 
} = subscribeApi;
