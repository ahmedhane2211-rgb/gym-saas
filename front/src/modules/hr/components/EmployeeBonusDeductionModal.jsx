import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import Select from "../../shared/components/Select";
import { LanguageContext } from "../../shared/context/LanguageContext";
import { useGetEmployeesQuery } from "../../hr/services/EmployeeSlice";
import AppModal from "../../shared/components/AppModal";

const EmployeeBonusDeductionModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm();
  const { t } = useContext(LanguageContext);
  const { data: empResponse } = useGetEmployeesQuery();
  const employees = Array.isArray(empResponse) ? empResponse : empResponse?.data || [];

  const employeeOptions = employees.map((e) => ({ value: e.id, label: e.name })).filter((e) => e.active );
  const typeOptions = [
    { value: "bonus", label: t("bonus") || "مكافأة" },
    { value: "deduction", label: t("deduction") || "خصم" },
  ];

  useEffect(() => {
    if (isOpen) reset({ employee_id: "", type: "bonus", value: "", date: new Date().toISOString().split("T")[0], notes: "" });
  }, [isOpen, reset]);

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={t("add_bonus_deduction") || "إضافة مكافأة / خصم"} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Select label="select_employee" name="employee_id" options={employeeOptions} register={register} errors={errors} setValue={setValue} watch={watch} placeholder="select_employee" validation={{ required: "Required" }} />
        <Select label="type" name="type" options={typeOptions} register={register} errors={errors} setValue={setValue} watch={watch} placeholder="type" validation={{ required: "Required" }} />
        <Input label="amount" type="number" placeholder="0.00" name="value" register={register} errors={errors} validation={{ required: "Required", min: { value: 0.01, message: "Must be positive" } }} />
        <Input label="date" type="date" name="date" register={register} errors={errors} validation={{ required: "Required" }} />
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 dark:text-gray-light/50 tracking-[0.2em] uppercase">{t("note")}</label>
          <textarea {...register("notes")} placeholder="..." className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-orange/50 transition-all font-bold resize-none h-20" />
        </div>
        <div className="flex flex-col gap-4">
          <Button title={isLoading ? "..." : t("add")} className="w-full bg-orange hover:bg-orange/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-[0_0_30px_rgba(255,95,31,0.2)]" />
          <Button onClick={onClose} title={t("cancel")} className="w-full text-gray-600 font-black text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors flex items-center justify-center gap-2" />
        </div>
      </form>
    </AppModal>
  );
};

export default EmployeeBonusDeductionModal;
