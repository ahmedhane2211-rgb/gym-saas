import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useGetProfileQuery } from '../modules/auth/services/AuthSlice'

const AuthProvider = () => {
    const token = Cookies.get("token")
    const { data: profile, isLoading, isError } = useGetProfileQuery(undefined, {
        skip: !token
    })

    if (!token) {
        return <Navigate to="/login" />
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-dark flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    // If subscription is expired, redirect to /expired page
    // Unless the user is an owner (owners bypass subscription check)
    if (profile?.data) {
        const user = profile.data;
        // Check role from top level or nested user object
        const role = (user.role || user.user?.role || '').trim().toLowerCase();
        const sub = user.subscription;
        
        console.log("AuthProvider - User Role:", role);
        console.log("AuthProvider - Subscription:", sub);

        // Bypass for owners
        if (role === 'owner') {
            console.log("AuthProvider - Bypassing check for owner");
            return <Outlet />;
        }

        // Check for active subscription for non-owners
        const isExpired = !sub || sub.status !== 'active' || new Date(sub.end_date) < new Date();
        
        if (isExpired) {
            console.log("AuthProvider - Subscription expired/missing, redirecting...");
            return <Navigate to="/expired" />
        }
    }



    return (
        <Outlet />
    )
}

export default AuthProvider