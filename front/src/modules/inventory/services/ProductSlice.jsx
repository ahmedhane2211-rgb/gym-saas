import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const productApi = createApi({
    reducerPath: "productApi",
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
    tagTypes: ['Product'],
    endpoints: (build) => ({
        getProducts: build.query({
            query: () => "products",
            providesTags: ['Product']
        }),
        addProduct: build.mutation({
            query: (data) => ({
                url: "products",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Product']
        }),
        updateProduct: build.mutation({
            query: ({ id, body }) => ({
                url: `products/${id}`,
                method: "PUT",
                body: body
            }),
            invalidatesTags: ['Product']
        }),
        deleteProduct: build.mutation({
            query: (id) => ({
                url: `products/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Product']
        })
    })
});

export const {
    useGetProductsQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productApi;
