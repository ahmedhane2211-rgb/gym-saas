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
import Freeze from './modules/freeze/pages/Freeze';
import Product from './modules/inventory/pages/Product';
import SalesInvoice from './modules/inventory/pages/SalesInvoice';
import SalesReport from './modules/inventory/pages/SalesReport';
import RefundPage from './modules/inventory/pages/RefundPage';
import CashReport from './modules/financial/pages/CashReport';
import OwnerLayout from './modules/owner/components/OwnerLayout';
import OwnerDashboard from './modules/owner/pages/OwnerDashboard';
import Subscriptions from './modules/owner/pages/Subscriptions';
import Settings from './modules/settings/pages/Settings';
import Expense from './modules/expenses/pages/Expense';
import Voucher from './modules/vouchers/pages/Voucher';
import Employee from './modules/hr/pages/Employee';
import Leave from './modules/hr/pages/Leave';
import LeavePermission from './modules/hr/pages/LeavePermission';
import PumpingMoney from './modules/financial/pages/PumpingMoney';
import OwnerWithdrawals from './modules/financial/pages/OwnerWithdrawals';
import EmployeeWithdrawals from './modules/financial/pages/EmployeeWithdrawals';
import Salaries from './modules/hr/pages/Salaries';
import BonusesDeductions from './modules/hr/pages/BonusesDeductions';




import SubscriptionExpired from './modules/shared/pages/SubscriptionExpired';

function App() {

  return (
    <LanguageProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/expired" element={<SubscriptionExpired />} />
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
            <Route path="/freeze" element={<Freeze />} />
            <Route path="/products" element={<Product />} />
            <Route path="/sales-invoice" element={<SalesInvoice />} />
            <Route path="/sales-report" element={<SalesReport />} />
            <Route path="/sales-return-invoice" element={<RefundPage />} />
            <Route path="/expenses" element={<Expense />} />
            <Route path="/vouchers" element={<Voucher />} />
            <Route path="/employees" element={<Employee />} />
            <Route path="/salaries" element={<Salaries />} />
            <Route path="/bonuses-deductions" element={<BonusesDeductions />} />
            <Route path="/leaves" element={<Leave />} />
            <Route path="/leaves-permissions" element={<LeavePermission />} />
            <Route path="/pumping-money" element={<PumpingMoney />} />
            <Route path="/owner-withdrawals" element={<OwnerWithdrawals />} />
            <Route path="/employee-withdrawals" element={<EmployeeWithdrawals />} />


            <Route path="/cash-day" element={<CashReport />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="/help" element={<Plan />} />
          </Route>

          <Route element={<OwnerLayout />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/subscriptions" element={<Subscriptions />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;
