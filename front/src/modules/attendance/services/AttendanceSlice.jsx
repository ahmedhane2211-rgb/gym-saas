import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const attendanceApi = createApi({
    reducerPath: "attendanceApi",
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
    tagTypes: ['Attendance'],
    endpoints: (build) => ({
        getAttendance: build.query({
            query: ({ from, to }) => ({
                url: "attendance",
                method: "GET",
                params: { from, to }
            }),
            providesTags: ['Attendance']
        }),
        addAttendance: build.mutation({
            query: (data) => ({
                url: `attendance/${data.id}`,
                method: "GET",
            }),
            invalidatesTags: ['Attendance']
        })
    })
});

export const { useGetAttendanceQuery, useAddAttendanceMutation } = attendanceApi;
