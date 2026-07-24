import React, { useContext, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import Select from "../../shared/components/Select";
import AppModal from "../../shared/components/AppModal";
import { LanguageContext } from "../../shared/context/LanguageContext";
import { useGetUsersQuery } from "../../users/userSlice";

const EmployeeModal = ({ isOpen, onClose, onSubmit, initialData, isLoading, title }) => {
    const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = useForm();
    const { t } = useContext(LanguageContext);
    const [activeTab, setActiveTab] = useState("personal");
    const { data: usersResponse } = useGetUsersQuery();
    const users = Array.isArray(usersResponse) ? usersResponse : (usersResponse?.data || usersResponse?.users || []);
    const employeeUsers = users.filter((user) => ["employee", "reception", "coach"].includes(String(user.role || "").toLowerCase()));
    const salaryValues = useWatch({
        control,
        name: ["basic_salary", "additional_salary", "allowances", "health_insurance", "social_insurance"]
    });
    const totalSalary = salaryValues.slice(0, 3).reduce((sum, value) => sum + Number(value || 0), 0)
        - salaryValues.slice(3).reduce((sum, value) => sum + Number(value || 0), 0);

    useEffect(() => {
        reset({
            name: initialData?.name || initialData?.user?.full_name || initialData?.user?.name || "",
            user_id: initialData?.user_id || initialData?.userId || initialData?.user?.id || "",
            job_number: initialData?.job_number || "",
            email: initialData?.email || initialData?.user?.email || "",
            phone: initialData?.phone || initialData?.user?.phone || "",
            plain_password: initialData?.plain_password || "",
            gender: initialData?.gender || "",
            national_id: initialData?.national_id || "",
            nationality: initialData?.nationality || "",
            marital_status: initialData?.marital_status || "",
            qualification: initialData?.qualification || "",
            address: initialData?.address || "",
            date_of_joining: initialData?.date_of_joining ? String(initialData.date_of_joining).slice(0, 10) : new Date().toISOString().split('T')[0],
            basic_salary: initialData?.basic_salary || "",
            additional_salary: initialData?.additional_salary || "",
            allowances: initialData?.allowances || "",
            health_insurance: initialData?.health_insurance || "",
            social_insurance: initialData?.social_insurance || "",
            tax: initialData?.tax || "",
            pending_debt: initialData?.pending_debt || "",
            total_salary: initialData?.total_salary || "",
            description: initialData?.description || "",
        });
        setActiveTab("personal");
    }, [initialData, reset, isOpen]);

    useEffect(() => {
        setValue("total_salary", totalSalary);
    }, [totalSalary, setValue]);

    if (!isOpen) return null;

    const tabs = [
        { id: "personal", label: "\u0628\u064a\u0627\u0646\u0627\u062a \u0634\u062e\u0635\u064a\u0629" },
        { id: "job", label: "\u0628\u064a\u0627\u0646\u0627\u062a \u0648\u0638\u064a\u0641\u064a\u0629" },
        { id: "financial", label: "\u0628\u064a\u0627\u0646\u0627\u062a \u0645\u0627\u0644\u064a\u0629" }
    ];

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title={t(title)}
            footer={
                <div className="flex flex-col gap-4">
                    <Button
                        title={isLoading ? "Processing..." : (initialData ? t("update") : t("add"))}
                        className="w-full bg-orange hover:bg-orange/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-lg"
                        onClick={handleSubmit(onSubmit)}
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full text-gray-500 dark:text-gray-600 font-black text-[10px] tracking-[0.3em] uppercase hover:text-gray-900 dark:hover:text-white transition-colors p-4 rounded-xl"
                    >
                        {t("cancel")}
                    </button>
                </div>
            }
        >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-3 gap-2 bg-gray-100 dark:bg-white/[0.03] p-1 rounded-2xl">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? "bg-orange text-black shadow-lg" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === "personal" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                        <Select
                            label="select_user"
                            name="user_id"
                            register={register}
                            setValue={setValue}
                            watch={watch}
                            errors={errors}
                            options={[
                                { value: "", label: t("select_user_placeholder") },
                                ...employeeUsers.map((user) => ({
                                    value: user.id,
                                    label: user.full_name || user.name || user.email
                                }))
                            ]}
                        />
                        <Input label="name" name="name" register={register} errors={errors} />
                        <Input label="email" type="email" name="email" register={register} errors={errors} />
                        <Input label="phone" name="phone" register={register} errors={errors} />
                        <Input label="password" type="password" name="plain_password" register={register} errors={errors} />
                        <Select
                            label="gender"
                            name="gender"
                            register={register}
                            setValue={setValue}
                            watch={watch}
                            errors={errors}
                            options={[
                                { value: "", label: t("select_gender") },
                                { value: "male", label: t("male") },
                                { value: "female", label: t("female") }
                            ]}
                        />
                        <Input label="national_id" name="national_id" register={register} errors={errors} />
                        <Input label="nationality" name="nationality" register={register} errors={errors} />
                        <Select
                            label="marital_status"
                            name="marital_status"
                            register={register}
                            setValue={setValue}
                            watch={watch}
                            errors={errors}
                            options={[
                                { value: "", label: t("select_option") },
                                { value: "married", label: t("married") },
                                { value: "divorced", label: t("divorced") },
                                { value: "widowed", label: t("widowed") },
                                { value: "single", label: t("single") }
                            ]}
                        />
                        <Input label="address" name="address" register={register} errors={errors} />
                    </div>
                    )}

                    {activeTab === "job" && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                            <Input label="job_number" name="job_number" register={register} errors={errors} />
                            <Input label="qualification" name="qualification" register={register} errors={errors} />
                            <Input label="date_of_joining" type="date" name="date_of_joining" register={register} errors={errors} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-light/50 tracking-[0.2em] uppercase px-1">
                                {t("description")}
                            </label>
                            <textarea
                                {...register("description")}
                                className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-orange/50 transition-all font-bold resize-none h-24"
                            />
                        </div>
                    </div>
                    )}

                    {activeTab === "financial" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                        <Input label="basic_salary" type="number" name="basic_salary" register={register} errors={errors} />
                        <Input label="additional_salary" type="number" name="additional_salary" register={register} errors={errors} />
                        <Input label="allowances" type="number" name="allowances" register={register} errors={errors} />
                        <Input label="health_insurance" type="number" name="health_insurance" register={register} errors={errors} />
                        <Input label="social_insurance" type="number" name="social_insurance" register={register} errors={errors} />
                        <Input label="total_salary" type="number" name="total_salary" register={register} errors={errors} value={totalSalary} readOnly />
                    </div>
                    )}

                </form>
        </AppModal>
    );
};

export default EmployeeModal;
