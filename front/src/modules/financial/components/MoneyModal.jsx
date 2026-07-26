import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import { LanguageContext } from "../../shared/context/LanguageContext";
import AppModal from "../../shared/components/AppModal";

const MoneyModal = ({ isOpen, onClose, onSubmit, isLoading, title }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    if (isOpen) reset({ value: "", date: new Date().toISOString().split("T")[0], notes: "" });
  }, [isOpen, reset]);

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={t(title)} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input label="amount" type="number" placeholder="0.00" name="value" register={register} errors={errors} validation={{ required: t("confirm_delete") || "Required", min: { value: 0.01, message: "Must be positive" } }} />
        <Input label="date" type="date" name="date" register={register} errors={errors} validation={{ required: "Required" }} />
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 dark:text-gray-light/50 tracking-[0.2em] uppercase">{t("note")}</label>
          <textarea {...register("notes")} placeholder="..." className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-orange/50 transition-all font-bold resize-none h-24" />
        </div>
        <div className="flex flex-col gap-4">
          <Button title={isLoading ? "..." : t("add")} className="w-full bg-orange hover:bg-orange/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-[0_0_30px_rgba(255,95,31,0.2)]" />
          <Button onClick={onClose} title={t("cancel")} className="w-full text-gray-600 font-black text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors flex items-center justify-center gap-2" />
        </div>
      </form>
    </AppModal>
  );
};

export default MoneyModal;
