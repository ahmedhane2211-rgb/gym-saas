import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createGym } from "../../redux/slices/GymSlice";
import { registerUser } from "../../redux/slices/AuthSlice";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ children, className = "h-6 w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

// ─── Step Indicator ───────────────────────────────────────────────────────────
const StepIndicator = ({ step, label, active, done }) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
        done
          ? "border-emerald-500 bg-emerald-500 text-white"
          : active
          ? "border-emerald-500 bg-white text-emerald-600 shadow-lg shadow-emerald-100 dark:bg-slate-800 dark:shadow-emerald-900/30"
          : "border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500"
      }`}
    >
      {done ? (
        <Icon className="h-5 w-5">
          <polyline points="20 6 9 17 4 12" />
        </Icon>
      ) : (
        step
      )}
    </div>
    <span
      className={`text-xs font-medium transition-colors ${
        active
          ? "text-emerald-600 dark:text-emerald-400"
          : done
          ? "text-emerald-500"
          : "text-slate-400 dark:text-slate-500"
      }`}
    >
      {label}
    </span>
  </div>
);

// ─── Field ────────────────────────────────────────────────────────────────────
const Field = ({ label, children, error }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-slate-900 placeholder-slate-400 outline-none ring-0 transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-600 dark:bg-slate-700/80 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-emerald-900/40";

// ─── Main Component ───────────────────────────────────────────────────────────
const OnboardingPage = ({ t }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: gymLoading } = useSelector((s) => s.gyms);
  const { loading: authLoading } = useSelector((s) => s.auth);
  const loading = gymLoading || authLoading;

  const [currentStep, setCurrentStep] = useState(1);
  const [gymId, setGymId] = useState(null);
  const [direction, setDirection] = useState("forward");

  // Gym form state
  const [gymName, setGymName] = useState("");
  const [gymPhone, setGymPhone] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const logoRef = useRef(null);

  // Admin form state
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [address, setAddress] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Errors
  const [errors, setErrors] = useState({});

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validateStep1 = () => {
    const errs = {};
    if (!gymName.trim()) errs.gymName = "اسم الجيم مطلوب";
    if (!gymPhone.trim()) errs.gymPhone = "رقم التليفون مطلوب";
    if (!logoFile) errs.logo = "اللوجو مطلوب";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = "الاسم الكامل مطلوب";
    if (!email.trim()) errs.email = "الإيميل مطلوب";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
      errs.email = "إيميل غير صالح";
    if (!password) errs.password = "الباسورد مطلوب";
    else if (password.length < 6) errs.password = "الباسورد لازم يكون 6 أحرف على الأقل";
    if (password !== confirmPassword) errs.confirmPassword = "الباسورد مش متطابق";
    if (!address.trim()) errs.address = "العنوان مطلوب";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStep1Next = async () => {
    if (!validateStep1()) return;

    const formData = new FormData();
    formData.append("logo", logoFile);
    formData.append("name", gymName);
    formData.append("phone", gymPhone);
    formData.append("isActive", true);

    const result = await dispatch(createGym(formData));
    if (result.payload?.id) {
      // console.log("Gym created with ID:", result.payload.id);
      setGymId(result.payload.id);
    }
    setDirection("forward");
    setCurrentStep(2);
  };

  const handleStep2Finish = async () => {
    if (!validateStep2()) return;

    const result = await dispatch(
      registerUser({ 
        email, 
        password, 
        fullname: fullName, 
        role, 
        address, 
        gymid: gymId, 
        isActive: true 
      })
    );

    if (result.payload) {
      navigate("/login");
    }
  };

  const goBack = () => {
    setDirection("back");
    setCurrentStep(1);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-300 opacity-20 blur-3xl dark:opacity-10" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-blue-300 opacity-20 blur-3xl dark:opacity-10" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200 opacity-10 blur-3xl dark:opacity-5" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40">
              <Icon className="h-7 w-7 text-white">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </Icon>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t?.("app.name") || "GymSaaS"}
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            أنشئ جيمك في دقائق ✨
          </p>
        </div>

        {/* Step indicators */}
        <div className="mb-8 flex items-center justify-center gap-0">
          <StepIndicator
            step={1}
            label="إنشاء الجيم"
            active={currentStep === 1}
            done={currentStep > 1}
          />
          {/* Connector */}
          <div className="relative mx-3 mb-5 h-0.5 w-20 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: currentStep > 1 ? "100%" : "0%" }}
            />
          </div>
          <StepIndicator
            step={2}
            label="حساب الأدمن"
            active={currentStep === 2}
            done={false}
          />
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-2xl shadow-slate-200/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/70 dark:shadow-slate-900/60">
          {/* Progress bar */}
          <div className="h-1 w-full bg-slate-100 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
              style={{ width: currentStep === 1 ? "50%" : "100%" }}
            />
          </div>

          <div className="p-8">
            {/* ── STEP 1: Create Gym ── */}
            {currentStep === 1 && (
              <div
                style={{
                  animation: `${direction === "forward" ? "slideInRight" : "slideInLeft"} 0.35s ease`,
                }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    🏋️ إنشاء الجيم
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    أدخل بيانات جيمك الأساسية
                  </p>
                </div>

                <div className="space-y-4">
                  <Field label="اسم الجيم" error={errors.gymName}>
                    <input
                      id="gym-name"
                      className={inputCls}
                      placeholder="مثال: Elite Fitness"
                      value={gymName}
                      onChange={(e) => setGymName(e.target.value)}
                    />
                  </Field>

                  <Field label="رقم التليفون" error={errors.gymPhone}>
                    <input
                      id="gym-phone"
                      type="tel"
                      className={inputCls}
                      placeholder="01XXXXXXXXX"
                      value={gymPhone}
                      onChange={(e) => setGymPhone(e.target.value)}
                    />
                  </Field>

                  <Field label="لوجو الجيم" error={errors.logo}>
                    <div
                      className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 transition-all hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/20"
                      onClick={() => logoRef.current?.click()}
                    >
                      {logoPreview ? (
                        <div className="flex flex-col items-center gap-3">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="h-20 w-20 rounded-xl object-cover shadow-md"
                          />
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            ✓ تم رفع اللوجو — اضغط لتغييره
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-600">
                            <Icon className="h-6 w-6 text-slate-400">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </Icon>
                          </div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            اضغط لرفع اللوجو
                          </p>
                          <p className="text-xs text-slate-400">PNG, JPG حتى 5MB</p>
                        </>
                      )}
                      <input
                        ref={logoRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                    </div>
                  </Field>
                </div>

                <button
                  id="onboarding-step1-next"
                  onClick={handleStep1Next}
                  disabled={loading}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-300 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-emerald-900/40"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      جاري الإنشاء...
                    </span>
                  ) : (
                    "التالي ←"
                  )}
                </button>
              </div>
            )}

            {/* ── STEP 2: Admin Account ── */}
            {currentStep === 2 && (
              <div
                style={{
                  animation: `${direction === "forward" ? "slideInRight" : "slideInLeft"} 0.35s ease`,
                }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    👤 حساب الأدمن
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    أدخل بيانات الدخول الخاصة بك
                  </p>
                </div>

                <div className="space-y-4">
                  <Field label="الاسم الكامل" error={errors.fullName}>
                    <input
                      className={inputCls}
                      placeholder="اسم الأدمن الرئيسي"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="الإيميل" error={errors.email}>
                      <input
                        type="email"
                        className={inputCls}
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Field>

                    <Field label="الدور / الـ Role" error={errors.role}>
                      <select
                        className={inputCls}
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="admin">مدير (Admin)</option>
                        <option value="manager">مسؤول (Manager)</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="العنوان" error={errors.address}>
                    <input
                      className={inputCls}
                      placeholder="مثال: القاهرة، مصر"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="الباسورد" error={errors.password}>
                      <div className="relative">
                        <input
                          type={showPass ? "text" : "password"}
                          className={inputCls + " pr-11"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          <Icon className="h-4 w-4">
                            {showPass ? (
                              <>
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </>
                            ) : (
                              <>
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                              </>
                            )}
                          </Icon>
                        </button>
                      </div>
                    </Field>

                    <Field label="تأكيد الباسورد" error={errors.confirmPassword}>
                      <div className="relative">
                        <input
                          type={showConfirm ? "text" : "password"}
                          className={inputCls + " pr-11"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          <Icon className="h-4 w-4">
                            {showConfirm ? (
                              <>
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </>
                            ) : (
                              <>
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                              </>
                            )}
                          </Icon>
                        </button>
                      </div>
                    </Field>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    id="onboarding-back"
                    type="button"
                    onClick={goBack}
                    className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                  >
                    → رجوع
                  </button>
                  <button
                    id="onboarding-finish"
                    onClick={handleStep2Finish}
                    disabled={loading}
                    className="flex-[2] rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:from-emerald-600 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-emerald-900/40"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        جاري الإنشاء...
                      </span>
                    ) : (
                      "🎉 إنهاء الإعداد"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          عندك حساب بالفعل؟{" "}
          <a
            href="/login"
            className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            سجّل دخول
          </a>
        </p>
      </div>

      {/* Slide animations */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default OnboardingPage;
