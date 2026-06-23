import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { usersApi } from '../users/userSlice'
import { authApi } from '../auth/services/AuthSlice'
import { memberApi } from '../members/services/MemberSlice'
import { coachApi } from '../coaches/services/CoachSlice'
import { attendanceApi } from '../attendance/services/AttendanceSlice'
import { planApi } from '../plans/services/PlanSlice'
import { branchApi } from '../branches/services/BranchSlice'
import { featureApi } from '../plans/services/FeatureSlice'
import { subscribeApi } from '../members/services/SubscribeSlice'
import { productApi } from '../inventory/services/ProductSlice'
import { invoiceApi } from '../inventory/services/InvoiceSlice'
import { cashApi } from '../financial/services/CashSlice'
import { ownerApi } from '../owner/services/OwnerSlice'
import { dashboardApi } from '../dashboard/services/DashboardSlice'
import { settingsApi } from '../settings/services/SettingsSlice'
import { freezeApi } from '../freeze/services/FreezeSlice'
import { pauseApi } from '../freeze/services/PauseSlice'
import { expenseApi } from '../expenses/services/ExpenseSlice'
import { voucherApi } from '../vouchers/services/VoucherSlice'
import { employeeApi } from '../hr/services/EmployeeSlice'
import { leaveApi } from '../hr/services/LeaveSlice'
import { leavePermissionApi } from '../hr/services/LeavePermissionSlice'



import { isRejectedWithValue } from '@reduxjs/toolkit'


const rtkQueryErrorLogger = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    if (action.payload?.status === 500) {
      if (action.payload.data && typeof action.payload.data === 'object') {
        action.payload.data.message = 'خطأ في السيرفر';
      } else {
        action.payload.data = { message: 'خطأ في السيرفر' };
      }
    }
    if (action.payload.data?.subscriptionExpired) {
      // Get the state to check if the user is an owner
      const state = api.getState();
      const profileData = state.authApi?.queries['getProfile(undefined)']?.data;
      const user = profileData?.data;
      const role = (user?.role || user?.user?.role || '').trim().toLowerCase();

      // Only redirect if the user is NOT an owner
      if (role !== 'owner') {
        window.location.href = '/expired'
      }
    }
  }
  return next(action)
}


export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [memberApi.reducerPath]: memberApi.reducer,
    [coachApi.reducerPath]: coachApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [planApi.reducerPath]: planApi.reducer,
    [branchApi.reducerPath]: branchApi.reducer,
    [featureApi.reducerPath]: featureApi.reducer,
    [subscribeApi.reducerPath]: subscribeApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    [cashApi.reducerPath]: cashApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [ownerApi.reducerPath]: ownerApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [freezeApi.reducerPath]: freezeApi.reducer,
    [pauseApi.reducerPath]: pauseApi.reducer,
    [expenseApi.reducerPath]: expenseApi.reducer,
    [voucherApi.reducerPath]: voucherApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [leaveApi.reducerPath]: leaveApi.reducer,
    [leavePermissionApi.reducerPath]: leavePermissionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      rtkQueryErrorLogger,
      usersApi.middleware,
      authApi.middleware,
      memberApi.middleware,
      coachApi.middleware,
      attendanceApi.middleware,
      planApi.middleware,
      branchApi.middleware,
      featureApi.middleware,
      subscribeApi.middleware,
      productApi.middleware,
      invoiceApi.middleware,
      cashApi.middleware,
      dashboardApi.middleware,
      ownerApi.middleware,
      settingsApi.middleware,
      freezeApi.middleware,
      pauseApi.middleware,
      expenseApi.middleware,
      voucherApi.middleware,
      employeeApi.middleware,
      leaveApi.middleware,
      leavePermissionApi.middleware,
    ]),
})


setupListeners(store.dispatch)
