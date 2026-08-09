import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import AppModal from "../../shared/components/AppModal";
import { LanguageContext } from "../../shared/context/LanguageContext";
import { useGetEmployeesQuery } from "../services/EmployeeSlice";
import { useGetLeavesQuery } from "../services/LeaveSlice";

const LeavePermissionModal = ({ isOpen, onClose, onSubmit, initialData, isLoading, title }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { t } = useContext(LanguageContext);

    const { data: employeesResponse } = useGetEmployeesQuery();
    const { data: leavesResponse } = useGetLeavesQuery();

    const employees = (Array.isArray(employeesResponse) ? employeesResponse : (employeesResponse?.data || employeesResponse?.employees || [])).filter(e => e.active);
    const leaves = Array.isArray(leavesResponse) ? leavesResponse : (leavesResponse?.data || leavesResponse?.leaves || []);

    useEffect(() => {
        reset({
            employee_id: initialData?.employee_id || "",
            leaves_id: initialData?.leaves_id || "",
            from_date: initialData?.from_date ? String(initialData.from_date).slice(0, 10) : new Date().toISOString().split('T')[0],
            to_date: initialData?.to_date ? String(initialData.to_date).slice(0, 10) : new Date().toISOString().split('T')[0],
            from_time: initialData?.from_time || "",
            to_time: initialData?.to_time || "",
            requested_minutes: initialData?.requested_minutes || ""
        });
    }, [initialData, reset, isOpen]);

    if (!isOpen) return null;

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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-light/50 tracking-[0.2em] uppercase px-1">
                            {t("select_employee")}
                        </label>
                        <select
                            {...register("employee_id", { required: true })}
                            className="w-full min-h-14 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white focus:border-orange/50 focus:outline-none"
                        >
                            <option value="">{t("select_option")}</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.user?.full_name || emp.name || emp.user?.name}
                                </option>
                            ))}
                        </select>
                        {errors.employee_id && <span className="text-red-500 text-xs">Required</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-light/50 tracking-[0.2em] uppercase px-1">
                            {t("select_leave")}
                        </label>
                        <select
                            {...register("leaves_id", { required: true })}
                            className="w-full min-h-14 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white focus:border-orange/50 focus:outline-none"
                        >
                            <option value="">{t("select_option")}</option>
                            {leaves.map((lv) => (
                                <option key={lv.id} value={lv.id}>
                                    {lv.name}
                                </option>
                            ))}
                        </select>
                        {errors.leaves_id && <span className="text-red-500 text-xs">Required</span>}
                    </div>

                    <Input
                        label="from_date"
                        type="date"
                        name="from_date"
                        register={register}
                        errors={errors}
                        required
                    />

                    <Input
                        label="to_date"
                        type="date"
                        name="to_date"
                        register={register}
                        errors={errors}
                        required
                    />

                    <Input
                        label="from_time"
                        type="time"
                        name="from_time"
                        register={register}
                        errors={errors}
                    />

                    <Input
                        label="to_time"
                        type="time"
                        name="to_time"
                        register={register}
                        errors={errors}
                    />

                    <Input
                        label="requested_minutes"
                        type="number"
                        name="requested_minutes"
                        register={register}
                        errors={errors}
                    />
                </div>
            </form>
        </AppModal>
    );
};

export default LeavePermissionModal;
