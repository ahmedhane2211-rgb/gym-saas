import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Calendar, Snowflake } from "lucide-react";
import { LanguageContext } from "../../shared/context/LanguageContext";
import Button from "../../shared/components/Button";
import { useGetFreezePlansQuery } from "../services/FreezeSlice";
import Input from "../../shared/components/Input";
import Select from "../../shared/components/Select";
import AppModal from "../../shared/components/AppModal";

const PauseSubscriptionModal = ({ isOpen, onClose, onSubmit, member, isLoading }) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const { t } = useContext(LanguageContext);
  const { data: freezePlansResponse } = useGetFreezePlansQuery();
  const freezePlans = Array.isArray(freezePlansResponse) ? freezePlansResponse : freezePlansResponse?.data || [];

  const subscription = member?.subscription;
  const allowedFreezePlanId = subscription?.freeze_plan_id;
  const pausesCount = subscription?.pauses_count || 0;

  const filteredFreezePlans = allowedFreezePlanId ? freezePlans.filter((plan) => plan.id === allowedFreezePlanId) : [];
  const selectedFreezePlan = filteredFreezePlans[0];
  const isLimitReached = selectedFreezePlan && pausesCount >= selectedFreezePlan.max_uses;

  useEffect(() => {
    if (isOpen) reset({ freeze_id: allowedFreezePlanId || "", from_date: new Date().toISOString().split("T")[0], to_date: "" });
  }, [isOpen, reset, allowedFreezePlanId]);

  if (!member) return null;

  const subscriptionId = member?.subscription?.id;

  const handleFormSubmit = (data) => {
    onSubmit({ subscription_id: subscriptionId || member?.subscription?.id, freeze_id: data.freeze_id || allowedFreezePlanId, from_date: data.from_date, to_date: data.to_date });
  };

  const headerContent = (
    <div className="space-y-1">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest">{t("freeze_subscription") || "تجميد الاشتراك"}</h2>
      <p className="text-xs font-bold text-gray-500 uppercase">{member?.user?.full_name}</p>
      <div className="w-12 h-1 bg-orange rounded-full" />
    </div>
  );

  return (
    <AppModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg" headerContent={headerContent}>
      {subscriptionId ? (
        !allowedFreezePlanId ? (
          <div className="text-center space-y-6">
            <p className="text-red-500 font-bold">{t("freeze_not_supported") || "هذه الباقة لا تدعم التجميد"}</p>
            <Button onClick={onClose} title={t("close") || "إغلاق"} className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-xl" />
          </div>
        ) : isLimitReached ? (
          <div className="text-center space-y-6">
            <p className="text-red-500 font-bold">{t("freeze_limit_reached") || "تم الوصول للحد الأقصى للتجميد في هذا الاشتراك"} ({pausesCount} / {selectedFreezePlan.max_uses})</p>
            <Button onClick={onClose} title={t("close") || "إغلاق"} className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-xl" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-light/50 tracking-[0.2em] uppercase">{t("selected_freeze_plan") || "الباقة المحددة للتجميد"}</p>
              <p className="text-sm font-black text-gray-900 dark:text-white mt-1 uppercase tracking-tight">{selectedFreezePlan?.name} ({selectedFreezePlan?.days} {t("days")} - {t("max_uses")}: {selectedFreezePlan?.max_uses})</p>
              <p className="text-[10px] font-bold text-orange mt-1">{t("used_times") || "مرات الاستخدام"}: {pausesCount} / {selectedFreezePlan?.max_uses}</p>
            </div>
            <input type="hidden" {...register("freeze_id")} value={allowedFreezePlanId} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input type="date" register={register} name="from_date" error={errors.from_date} placeholder={t("from_date") || "من تاريخ"} label={t("from_date")} />
              <Input type="date" register={register} name="to_date" error={errors.to_date} placeholder={t("to_date") || "إلى تاريخ"} label={t("to_date")} />
            </div>
            <div className="flex flex-col gap-4">
              <Button title={isLoading ? "Processing..." : t("submit")} className="w-full bg-orange hover:bg-orange/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-lg dark:shadow-[0_0_30px_rgba(255,95,31,0.2)]" />
              <Button onClick={onClose} title={t("cancel")} className="w-full text-gray-500 dark:text-gray-600 font-black text-[10px] tracking-[0.3em] uppercase hover:text-gray-900 dark:hover:text-white transition-colors" />
            </div>
          </form>
        )
      ) : (
        <div className="text-center space-y-6">
          <p className="text-red-500 font-bold">{t("no_active_subscription") || "لا يوجد اشتراك نشط للعضو"}</p>
          <Button onClick={onClose} title={t("close")} className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-xl" />
        </div>
      )}
    </AppModal>
  );
};

export default PauseSubscriptionModal;
