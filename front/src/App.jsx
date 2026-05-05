import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './modules/auth/pages/Login';
import Register from './modules/auth/pages/Register';
import Users from './modules/users/pages/Users';
import AuthProvider from './providers/AuthProvider';
import Dashboard from './modules/dashboard/pages/Dashboard';
import MainLayout from './modules/shared/components/MainLayout';
import { LanguageProvider } from './modules/shared/context/LanguageContext';
import Member from './modules/members/pages/Member';
import Coach from './modules/coaches/pages/Coach';
import Attendance from './modules/attendance/pages/Attendance';
import Plan from './modules/plans/pages/Plan';
import Features from './modules/plans/pages/Features';
import Branch from './modules/branches/pages/Branch';
import Product from './modules/inventory/pages/Product';
import SalesInvoice from './modules/inventory/pages/SalesInvoice';
import SalesReport from './modules/inventory/pages/SalesReport';
import RefundPage from './modules/inventory/pages/RefundPage';
import CashReport from './modules/financial/pages/CashReport';

function App() {

  return (
    <LanguageProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<AuthProvider />}>
          <Route element={<MainLayout />}>
            <Route path="/users" element={<Users />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<Member />} />
            <Route path="/coaches" element={<Coach />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/plans" element={<Plan />} />
            <Route path="/features" element={<Features />} />
            <Route path="/branches" element={<Branch />} />
            <Route path="/products" element={<Product />} />
            <Route path="/sales-invoice" element={<SalesInvoice />} />
            <Route path="/sales-report" element={<SalesReport />} />
            <Route path="/sales-return-invoice" element={<RefundPage />} />
            <Route path="/expenses" element={<Plan />} />
            <Route path="/income" element={<Plan />} />
            <Route path="/cash-day" element={<CashReport />} />
            <Route path="/settings" element={<Plan />} />
            <Route path="/help" element={<Plan />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;
