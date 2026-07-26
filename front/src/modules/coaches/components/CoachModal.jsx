import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Award, Banknote } from "lucide-react";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import { LanguageContext } from "../../shared/context/LanguageContext";
import Select from "../../shared/components/Select";
import { useGetUsersQuery } from "../../users/userSlice";
import AppModal from "../../shared/components/AppModal";

const CoachModal = ({ isOpen, onClose, onSubmit, initialData, isLoading, title }) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const { t } = useContext(LanguageContext);

  const { data: response } = useGetUsersQuery();
  const usersList = Array.isArray(response) ? response : response?.data || response?.users || [];
  const filteredUsers = usersList.filter((user) => user.role === "coach");

  useEffect(() => {
    if (initialData) {
      reset({ userId: initialData.userId || initialData.user_id || "", speciality: initialData.speciality || initialData.specialty || "", salary: initialData.salary || "" });
    } else {
      reset({ userId: "", speciality: "", salary: "" });
    }
  }, [initialData, reset, isOpen]);

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={t(title)} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Select label="select_user" name="userId" register={register} setValue={setValue} watch={watch} errors={errors} options={[{ value: "", label: t("select_user_placeholder") || "Select User" }, ...filteredUsers.map((user) => ({ value: user.id, label: `${user.full_name}` }))]} />
          </div>
          <div className="relative">
            <Input label="specialty" placeholder="e.g. Bodybuilding, Yoga, Crossfit" name="speciality" register={register} errors={errors} />
            <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400"><Award size={18} /></div>
          </div>
          <div className="relative">
            <Input label="salary" type="number" placeholder="e.g. 5000" name="salary" register={register} errors={errors} />
            <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400"><Banknote size={18} /></div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Button title={isLoading ? "Processing..." : initialData ? t("update") : t("add")} className="w-full bg-orange hover:bg-orange/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-lg dark:shadow-[0_0_30px_rgba(255,95,31,0.2)]" />
          <Button onClick={onClose} title={t("cancel")} className="w-full text-gray-500 dark:text-gray-600 font-black text-[10px] tracking-[0.3em] uppercase hover:text-gray-900 dark:hover:text-white transition-colors" />
        </div>
      </form>
    </AppModal>
  );
};

export default CoachModal;
