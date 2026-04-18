# Gym SaaS

لو رجعت للمشروع بعد فترة ومش عارف تبدأ منين، اقرأ الملفات دي بالترتيب:

1. `docs/START-HERE.md`
2. `docs/PRD.md`
3. `docs/SYSTEM.md`
4. `docs/TECH-STACK.md`

## المشروع ده بيعمل إيه حالياً؟

تطبيق إدارة جيم مبني كـ `web dashboard` + `REST API`.

- `front/`: واجهة React + Vite
- `server/`: Backend بـ Express + PostgreSQL
- `docs/`: توثيق الحالة الحالية وخطة التكملة

## الحالة الحالية بسرعة

- شغال/متوصل جزئياً: `auth`, `branches`, `users`, `members`, `subscription plans`
- موجود كمسودة فقط: ربط العضو باشتراك فعلي
- ما زال `mock/static`: `dashboard`, `attendance`, `payments`, `alerts`, `reports`, `trainer`, `coaches`, جزء من `settings`

## التشغيل المحلي

### Backend

```bash
cd server
npm install
npm run dev
```

المشروع يحتاج ملف `.env` داخل `server/` يحتوي على المتغيرات التالية كما هي مستخدمة في الكود الحالي:

```env
user=
host=
database=
password=
DB_port=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend

```bash
cd front
npm install
npm run dev
```

المشروع يحتاج ملف `.env` داخل `front/` يحتوي على:

```env
VITE_API_END_POINT=http://localhost:3000/api
```

## ملاحظة مهمة

قاعدة البيانات الحالية مستنتجة من الكود لأن المشروع لا يحتوي حتى الآن على `migrations` أو ملف schema رسمي. قبل إضافة أي feature جديدة، الأفضل تثبيت عقود البيانات وتوحيد أسماء الحقول.
