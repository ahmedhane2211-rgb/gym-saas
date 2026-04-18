# Tech Stack

**Date:** 2026-03-26  
**Status:** Actual stack used in the current repository

هذا الملف يصف الـ stack الفعلي الموجود في المشروع الآن، وليس stack مستقبلي مقترح.

---

## 1. Frontend

المجلد: `front/`

### الأساس

- `React 19`
- `Vite 7`
- `React Router 7`
- `Redux Toolkit`
- `Tailwind CSS 4`

### المكتبات المساعدة

- `axios`
- `react-hook-form`
- `react-hot-toast`
- `i18next`
- `react-i18next`
- `i18next-http-backend`
- `i18next-browser-languagedetector`
- `js-cookie`
- `lucide-react`

### ماذا يعني هذا عملياً؟

- الواجهة SPA
- إدارة الحالة تتم عبر Redux slices
- النماذج عبر `react-hook-form`
- الاتصال مع الـ API عبر `axios`
- دعم عربي/إنجليزي موجود بالفعل

---

## 2. Backend

المجلد: `server/`

### الأساس

- `Node.js`
- `Express 5`
- `PostgreSQL` عبر `pg`

### Auth / Security

- `jsonwebtoken`
- `bcryptjs`

### Files / Media

- `multer`
- `cloudinary`
- `multer-storage-cloudinary`

### أدوات أخرى

- `cors`
- `dotenv`
- `uuid`
- `nodemon`

---

## 3. قاعدة البيانات

قاعدة البيانات المستخدمة حالياً هي:

- `PostgreSQL`

لكن توجد نقطة مهمة:

- لا يوجد schema رسمي أو migrations داخل المشروع حتى الآن.

لذلك فشكل قاعدة البيانات الحالي مستنتج من الـ queries داخل الـ controllers.

---

## 4. البنية الحالية

المشروع حالياً يتبع النمط التالي:

```text
React SPA
   |
Redux slices
   |
Axios
   |
Express REST API
   |
PostgreSQL
```

---

## 5. خدمات خارجية مستخدمة

### Cloudinary

تستخدم حالياً لرفع صور الجيم عبر `multerConfig.js`.

### JWT

يستخدم لحماية بعض الـ routes عبر `Authorization: Bearer <token>`.

---

## 6. ما الذي لا يستخدمه المشروع حالياً؟

المشروع لا يستخدم حالياً:

- `TypeScript`
- ORM مثل `Prisma` أو `Drizzle`
- validation library مثل `zod`
- test runner واضح
- migration tool واضح
- queue system
- cache layer

وهذا مهم لأن بعض التوثيق القديم كان يفترض وجود أدوات غير موجودة فعلياً.

---

## 7. الإضافات المقترحة لاحقاً

بعد تثبيت الـ core flow، الإضافات الأكثر فائدة هي:

1. `database migrations`
2. request validation
3. backend service layer
4. tests
5. توحيد naming conventions
6. API client أو abstraction layer في الـ frontend

---

## 8. القرار العملي الآن

لا تحتاج لتغيير الـ stack حالياً كي تكمل المشروع.

الأولوية ليست تبديل التقنية، بل:

1. تثبيت الـ contracts
2. إنهاء الموديولات الأساسية
3. إزالة التضارب بين الـ docs والكود

بعد ذلك فقط يصبح التفكير في TypeScript أو ORM أو architecture أكبر قراراً منطقياً.
