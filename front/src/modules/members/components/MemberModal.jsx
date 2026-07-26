import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  CreditCard,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import { LanguageContext } from "../../shared/context/LanguageContext";
import Select from "../../shared/components/Select";
import { useGetUsersQuery } from "../../users/userSlice";
import { useGetPlansQuery } from "../../plans/services/PlanSlice";
import AppModal from "../../shared/components/AppModal";

const MemberModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  title,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const { t } = useContext(LanguageContext);

  const { data: response } = useGetUsersQuery();
  const usersList = Array.isArray(response)
    ? response
    : response?.data || response?.users || [];
  const memberslist = usersList.filter((user) => user.role === "member");

  const { data: plansData } = useGetPlansQuery();
  const plans = Array.isArray(plansData) ? plansData : plansData?.data || [];

  const selectedPlanId = watch("plansId");
  const startDate = watch("startDate");

  useEffect(() => {
    if (selectedPlanId && startDate) {
      const plan = plans.find((p) => String(p.id) === String(selectedPlanId));
      if (plan && plan.duration) {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + parseInt(plan.duration));
        setValue("endDate", end.toISOString().split("T")[0]);
      }
    }
  }, [selectedPlanId, startDate, plans, setValue]);

  useEffect(() => {
    if (initialData) {
      reset({
        userId: initialData.user_id || "",
        idNumber: initialData.id_number || "",
        plansId: initialData.subscription?.plan_id || "",
        startDate: initialData.subscription?.start_date || "",
        endDate: initialData.subscription?.end_date || "",
      });
    } else {
      reset({
        userId: "",
        idNumber: "",
        plansId: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
      });
    }
  }, [initialData, reset, isOpen]);

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={t(title)} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Select
                label="select_user"
                name="userId"
                register={register}
                setValue={setValue}
                watch={watch}
                errors={errors}
                options={[
                  ...memberslist.map((member) => ({
                    value: member.id,
                    label: `${member.full_name}`,
                  })),
                ]}
              />
            </div>

            <div className="relative">
              <Input
                label="id_number"
                placeholder="National ID or Passport"
                name="idNumber"
                register={register}
                errors={errors}
              />
              <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
                <CreditCard size={18} />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-blue" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                {t("subscription_details") || "Subscription Details"}
              </h3>
            </div>

            <div className="space-y-2">
              <Select
                label="select_plan"
                name="plansId"
                register={register}
                setValue={setValue}
                watch={watch}
                errors={errors}
                options={plans.map((p) => ({
                  value: p.id,
                  label: `${p.name} - ${p.price} EGP`,
                }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Input
                  label="start_date"
                  type="date"
                  name="startDate"
                  register={register}
                  errors={errors}
                />
                <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
                  <Calendar size={18} />
                </div>
              </div>
              <div className="relative">
                <Input
                  label="end_date"
                  type="date"
                  name="endDate"
                  register={register}
                  errors={errors}
                />
                <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
                  <Clock size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            title={
              isLoading
                ? "Processing..."
                : initialData
                  ? t("update")
                  : t("add")
            }
            className="w-full bg-orange hover:bg-orange/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-lg dark:shadow-[0_0_30px_rgba(255,95,31,0.2)]"
          />
          <Button
            onClick={onClose}
            title={t("cancel")}
            className="w-full text-gray-500 dark:text-gray-600 font-black text-[10px] tracking-[0.3em] uppercase hover:text-gray-900 dark:hover:text-white transition-colors"
          />
        </div>
      </form>
    </AppModal>
  );
};

export default MemberModal;
