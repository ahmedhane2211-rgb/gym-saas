import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const AuthProvider = () => {
    const token = Cookies.get("token")
    if (!token) {
        return <Navigate to="/login" />
    }
    return (
        <Outlet />
    )
}

export default AuthProvider