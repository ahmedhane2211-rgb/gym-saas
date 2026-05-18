import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie';

export const ownerApi = createApi({
  reducerPath: 'ownerApi',
  tagTypes: ['Subscription'],
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${import.meta.env.VITE_API_END_POINT}`,
    prepareHeaders: (headers) => {
      const token = Cookies.get('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    getSubscriptions: build.query({
      query: () => `tenants`,
      providesTags: ['Subscription'],
    }),
    addSubscription: build.mutation({
      query: (data) => ({
        url: `tenants`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),
    updateSubscription: build.mutation({
      query: ({ id, ...data }) => ({
        url: `tenants/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),
    deleteSubscription: build.mutation({
      query: (id) => ({
        url: `tenants/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subscription'],
    }),
  }),
})

export const { 
  useGetSubscriptionsQuery, 
  useAddSubscriptionMutation, 
  useUpdateSubscriptionMutation, 
  useDeleteSubscriptionMutation 
} = ownerApi
