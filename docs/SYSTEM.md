# System Overview

**Date:** 2026-03-26  
**Status:** Current Implementation Overview

هذا الملف يصف النظام كما هو موجود فعلياً في الريبو الآن.

---

## 1. هيكل المشروع

```text
gym-saas/
├─ front/     React dashboard
├─ server/    Express API
└─ docs/      Product + system documentation
```

---

## 2. الـ Frontend الحالي

الواجهة مبنية على:

- `React`
- `React Router`
- `Redux Toolkit`
- `react-hook-form`
- `i18next`
- `Tailwind CSS`

### الصفحات الرئيسية

الراوتس الحالية في `front/src/App.jsx`:

- `/login`
- `/register`
- `/`
- `/gyms`
- `/users`
- `/members`
- `/coaches`
- `/subscriptions`
- `/attendance`
- `/payments`
- `/reports`
- `/trainers`
- `/settings`
- `/alerts`

### حالة الصفحات

| الصفحة | الحالة | المصدر |
| --- | --- | --- |
| Login / Register | موصولة جزئياً | `AuthSlice` + `/api/auth` |
| Branches | موصولة | `BranchesSlice` |
| Users | موصولة جزئياً | `UserSlice` |
| Members | موصولة جزئياً | `MemberSlice` |
| Subscriptions | موصولة جزئياً | `SubscriptionSlice` |
| Attendance | Mock | local state |
| Dashboard | Mock | `assets` |
| Payments | Mock | `assets` |
| Reports | Mock | `assets` |
| Alerts | Mock | `assets` |
| Trainer | Mock | `assets` |
| Coaches | local slice فقط | `CoachSlice` |

### الـ Redux slices الحالية

- `AuthSlice`
- `BranchesSlice`
- `GymSlice`
- `UserSlice`
- `MemberSlice`
- `SubscriptionSlice`
- `AttendanceSlice` (mock)
- `CoachSlice` (mock)

---

## 3. الـ Backend الحالي

الـ backend مبني على:

- `Express`
- `pg`
- `jsonwebtoken`
- `bcryptjs`
- `multer`
- `cloudinary`

### الطبقات الموجودة

- `server/app.js`: bootstrap + route mounting
- `server/routes/*`: تعريف الـ endpoints
- `server/controllers/*`: منطق الطلبات
- `server/models/db.js`: اتصال PostgreSQL
- `server/middlewares/authUser.js`: حماية JWT
- `server/middlewares/multerConfig.js`: رفع الصور إلى Cloudinary

---

## 4. الـ API الحالية

## Authentication

| Method | Route | Auth | الحالة |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | لا | موجود |
| `POST` | `/api/auth/login` | لا | موجود |
| `GET` | `/api/auth/user` | نعم | موجود |

## Gym

| Method | Route | Auth | الحالة |
| --- | --- | --- | --- |
| `GET` | `/api/gym` | لا | موجود |
| `GET` | `/api/gym/:id` | لا | موجود |
| `POST` | `/api/gym` | لا | موجود |
| `PUT` | `/api/gym/:id` | لا | موجود شكلياً فقط |
| `DELETE` | `/api/gym/:id` | لا | موجود |

## Branches

| Method | Route | Auth | الحالة |
| --- | --- | --- | --- |
| `GET` | `/api/branches` | نعم | موجود |
| `GET` | `/api/branches/:id` | نعم | موجود |
| `POST` | `/api/branches` | نعم | موجود |
| `PUT` | `/api/branches/:id` | نعم | موجود |
| `DELETE` | `/api/branches/:id` | نعم | موجود |

## Users

| Method | Route | Auth | الحالة |
| --- | --- | --- | --- |
| `GET` | `/api/users` | نعم | موجود |
| `GET` | `/api/users/:id` | نعم | موجود |
| `POST` | `/api/users` | نعم | موجود |
| `PUT` | `/api/users/:id` | نعم | موجود |
| `DELETE` | `/api/users/:id` | نعم | موجود |

## Members

| Method | Route | Auth | الحالة |
| --- | --- | --- | --- |
| `GET` | `/api/members` | نعم | موجود |
| `GET` | `/api/members/:id` | نعم | موجود |
| `POST` | `/api/members` | نعم | موجود |
| `PUT` | `/api/members/:id` | نعم | موجود |
| `DELETE` | `/api/members/:id` | نعم | موجود لكن به خطأ SQL |

## Subscription Plans

| Method | Route | Auth | الحالة |
| --- | --- | --- | --- |
| `GET` | `/api/subscriptions` | لا | موجود |
| `GET` | `/api/subscriptions/:id` | لا | موجود |
| `POST` | `/api/subscriptions` | لا | موجود |
| `DELETE` | `/api/subscriptions/:id` | لا | موصل خطأ على `updateSubscription` |
| `PUT` | `/api/subscriptions/:id` | لا | موصل خطأ على `deleteSubscription` |

## Member Subscription Assignment

| Method | Route | Auth | الحالة |
| --- | --- | --- | --- |
| `POST` | `/api/subscribe` | لا | موجود كمسودة |

## Endpoint غير موثوق حالياً

| Method | Route | ملاحظة |
| --- | --- | --- |
| `*` | `/api/coaches` | موصول على `userRouter` وليس backend حقيقي للكباتن |

---

## 5. نموذج البيانات الحالي من الكود

الجداول التي يشير إليها الكود حالياً:

- `tenant`
- `gym`
- `branches`
- `users`
- `members`
- `subscription_plans`
- `subscription`

## ملاحظات مهمة على البيانات

1. لا يوجد ملف schema رسمي داخل الريبو.
2. أسماء الحقول غير موحدة بين الطبقات.
3. بعض الاستعلامات تستخدم:
   - `gymId`
   - `gymid`
   - `branchId`
   - `branch_id`
4. هذا يعني أن أول خطوة هندسية صحيحة هي تثبيت schema واضح قبل التوسع.

---

## 6. أهم الديون التقنية الحالية

1. لا توجد `migrations`.
2. لا توجد اختبارات `backend` أو `frontend`.
3. لا يوجد validation layer موحد للطلبات.
4. شكل الـ API responses غير موحد.
5. بعض الـ pages تعتمد على بيانات `assets` ثابتة.
6. هناك خلط بين `mock pages` و `production pages` في نفس التنقل.

---

## 7. التسمية الموصى بها من الآن

لكي لا يستمر التشتت، الأفضل اعتماد القاعدة التالية:

### في قاعدة البيانات

- استخدم `snake_case`
- أمثلة:
  - `gym_id`
  - `branch_id`
  - `created_at`
  - `is_active`

### في الـ API والـ frontend

- استخدم `camelCase`
- أمثلة:
  - `gymId`
  - `branchId`
  - `createdAt`
  - `isActive`

### أين يتم التحويل؟

داخل طبقة الـ controller أو service فقط، وليس داخل كل component.

---

## 8. القاعدة الصحيحة لاعتبار أي موديول “مكتمل”

أي feature لا تعتبر منتهية إلا إذا كان لها:

1. schema واضح
2. route واضح
3. controller سليم
4. state management أو API client واضح
5. UI موصول فعلياً
6. توثيق مختصر

---

## 9. أولويات الاستقرار

الترتيب التقني المقترح:

1. إصلاح التشغيل وroute wiring
2. تثبيت auth contract
3. توحيد أسماء الحقول
4. تثبيت schema
5. إنهاء users / members / subscriptions
6. إنهاء attendance

هذا هو الترتيب الذي سيعطي المشروع شكل منتج قابل للتطوير بدل أن يظل prototype كبير لكن غير ثابت.
