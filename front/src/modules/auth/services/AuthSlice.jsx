
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie'
// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${import.meta.env.VITE_API_END_POINT}/auth/`,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    register: build.mutation({
      query: (data) => ({
        url: `register`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['user']
    }),
    login: build.mutation({
      query: (data) => ({
        url: `login`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['user']
    }),
    googleLogin: build.mutation({
      query: (data) => ({
        url: `google`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['user']
    }),

    getProfile: build.query({
      query: () => ({
        url: `user`,
        method: 'GET',
      }),
      providesTags: ['user']
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useRegisterMutation,useLoginMutation,useGoogleLoginMutation,useGetProfileQuery } = authApi