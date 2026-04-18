# Start Here

هذا الملف هو نقطة البداية لو أنت تايه أو راجع للمشروع بعد فترة.

## 1. المشروع فين الآن؟

المشروع حالياً عبارة عن `admin dashboard` لإدارة جيم، والفلو الأساسي الموجود في الكود هو:

1. صاحب الجيم يسجل حساب.
2. النظام ينشئ `tenant` و `default gym`.
3. المستخدم يعمل `login`.
4. يبدأ يدير الفروع والمستخدمين والأعضاء وباقات الاشتراك.

المهم هنا: المشروع ليس منتج SaaS مكتمل حتى الآن، بل `prototype / early MVP` فيه أجزاء موصولة فعلاً وأجزاء كثيرة ما زالت `mock`.

## 2. إيه الموجود فعلاً في الكود؟

| الموديول | الحالة | أين يوجد | ملاحظات |
| --- | --- | --- | --- |
| Authentication | جزئي لكنه موجود | `front/src/pages/auth` + `server/controllers/authController.js` | Login شغال من حيث الفكرة، لكن contract التسجيل غير متوافق 100% مع الـ frontend |
| Branches | شبه مكتمل | `BranchesPage` + `BranchesSlice` + `branchController` | CRUD موجودة ومحمية بالتوكن |
| Users | جزئي | `user.jsx` + modals + `UserSlice` + `userController` | موجود لكن فيه مشاكل response shape وتسمية حقول |
| Members | جزئي | `MembersPage` + modals + `MemberSlice` + `memberController` | الموديل الحالي يربط `member` مع `user` موجود مسبقاً |
| Subscription Plans | جزئي | `SubscriptionsPage` + `AddSubscriptionModal` + `subcriptionsController` | الإنشاء والقراءة موجودان، لكن التحديث والحذف موصلان خطأ في الراوت |
| Member Subscription Assignment | مسودة | `AddSubscriberModal` + `subscribeController` | الفورم موجودة لكن غير موصولة من الواجهة فعلياً |
| Attendance | Mock | `AttendancePage.jsx` | حالياً مجرد بحث محلي بالباركود داخل state |
| Dashboard | Mock | `DashboardPage.jsx` | أرقام ثابتة من `assets` |
| Payments | Mock | `PaymentsPage.jsx` | لا يوجد backend حقيقي |
| Reports | Mock | `ReportsPage.jsx` | لا يوجد backend حقيقي |
| Alerts | Mock | `AlertsPage.jsx` | لا يوجد backend حقيقي |
| Trainer / Coaches | Mock أو local state | `TrainerPage.jsx`, `CoachesPage.jsx`, `CoachSlice.jsx` | لا يوجد backend مستقل للكباتن |

## 3. ليه حاسس إن المشروع مشتت؟

الأسباب الرئيسية:

1. التوثيق القديم كان `target vision` أكثر من كونه وصفاً للحالة الفعلية.
2. المشروع يخلط بين صفحات حقيقية وصفحات `mock` داخل نفس الواجهة.
3. أسماء الحقول غير موحدة:
   - `gymid` و `gymId`
   - `fullname` و `fullName`
   - `isactive` و `isActive`
4. لا توجد `migrations` أو schema رسمي لقاعدة البيانات.
5. بعض الـ routes والـ controllers موصلين خطأ، فحتى الموديولات الموجودة ليست مستقرة بالكامل.

## 4. أهم نقاط الانسداد الحالية

هذه أهم المشاكل التي تستحق أن تبدأ بها قبل أي features جديدة:

4. `front/src/components/subscriptions/AddSubscriberModal.jsx`
   - الفورم لا ترسل أي action فعلياً.
5. `front/src/components/member/EditMemberModal.jsx`
   - التحديث لا يرسل payload كامل.
6. `front/src/components/member/AddMemberModal.jsx`
   - يوجد `dispatch(addMember(...))` مكرر مرتين.
7. `front/src/redux/slices/AuthSlice.jsx`
   - الـ frontend يتوقع أن `register` يرجع `token` و `user`، لكن الـ backend لا يفعل ذلك.
8. `front/src/redux/slices/UserSlice.jsx`
   - فحص نجاح إنشاء المستخدم يعتمد على `response.data.status !== 201` بينما الـ backend لا يرجعها بهذا الشكل.
10. `server/controllers/gymController.js`
    - `updateGym` لا يحفظ أي تعديل في قاعدة البيانات حتى الآن.

## 5. أفضل ترتيب للتكملة

لو عايز تكمل من غير ما تتوه، اشتغل بالترتيب ده:

### المرحلة 1: تثبيت الأساس

1. أصلح مشاكل التشغيل والـ route wiring.
2. وحّد شكل الـ API response في كل الـ controllers:
   - `status`
   - `message`
   - `data`
3. وحّد أسماء الحقول في المشروع كله.
4. أضف ملف schema أو `migrations` لقاعدة البيانات.

### المرحلة 2: إنهاء الـ core CRUD

1. ثبّت `Users CRUD`
2. ثبّت `Members CRUD`
3. ثبّت `Subscription Plans CRUD`
4. أكمل flow إسناد اشتراك لعضو

### المرحلة 3: حضور حقيقي

1. اعمل endpoint فعلي للـ attendance
2. اربط الباركود بعضو
3. تحقق من صلاحية الاشتراك قبل تسجيل الدخول
4. أظهر سجل حضور اليوم

### المرحلة 4: ما بعد الـ MVP

1. Payments
2. Reports
3. Alerts / WhatsApp
4. Trainer module الحقيقي

## 6. إيه اللي تتجاهله الآن؟

لا تبدأ بهذه الأجزاء قبل إنهاء الأساس:

- Dashboard analytics
- Payments
- Reports
- Alerts
- Trainer dashboard
- أي توسعات SaaS كبيرة مثل mobile apps أو super admin معقد

## 7. ما هو الـ MVP الحقيقي للمشروع؟

لو أنهيت النقاط التالية فأنت عندك MVP واضح وقابل للتجربة:

1. Admin يقدر يسجل ويعمل login.
2. Admin يقدر يضيف فرع.
3. Admin يقدر يضيف مستخدمين.
4. Admin يقدر يضيف عضو بباركود.
5. Admin يقدر ينشئ باقة اشتراك.
6. Admin يقدر يربط العضو باشتراك.
7. الاستقبال يقدر يعمل scan للباركود.
8. النظام يمنع العضو المنتهي اشتراكه من الدخول.

## 8. لو عندك يوم شغل واحد فقط

أفضل مهمة واحدة تبدأ بها الآن:

1. تثبيت عقود البيانات بين `frontend` و `backend`
2. ثم إنهاء `subscription assignment`

السبب: بدون هاتين الخطوتين، أي feature بعدها ستدخل في نفس دوامة التشتت.

## 9. قاعدة شغل بسيطة علشان متتوهش مرة ثانية

كل feature جديدة لازم تعدي على الـ checklist دي:

1. جدول أو schema واضح في الداتا
2. route في الـ backend
3. controller واضح
4. Redux slice أو API client
5. page أو modal موصولة فعلياً
6. تحديث بسيط في التوثيق

لو اشتغلت بهذه الطريقة، المشروع هيتحول من prototype مبعثر إلى MVP واضح خطوة بخطوة.
