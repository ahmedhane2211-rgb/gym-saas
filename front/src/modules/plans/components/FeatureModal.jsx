import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Sparkles } from "lucide-react";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import { LanguageContext } from "../../shared/context/LanguageContext";
import AppModal from "../../shared/components/AppModal";

const FeatureModal = ({ isOpen, onClose, onSubmit, initialData, isLoading, title }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    if (isOpen) reset(initialData || { name: "" });
  }, [isOpen, initialData, reset]);

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={t(title)} maxWidth="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input label={t("feature_name") || "Feature Name"} name="name" register={register} errors={errors} validation={{ required: "Name is required" }} icon={<Sparkles size={18} />} />
        <div className="flex flex-col gap-4 pt-4">
          <Button title={isLoading ? "Processing..." : t(initialData ? "update" : "add")} className="w-full bg-blue hover:bg-blue/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-lg" />
          <Button onClick={onClose} title={t("cancel")} className="w-full text-gray-500 font-black text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors" />
        </div>
      </form>
    </AppModal>
  );
};

export default FeatureModal;
