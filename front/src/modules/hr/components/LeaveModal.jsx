import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import AppModal from "../../shared/components/AppModal";
import { LanguageContext } from "../../shared/context/LanguageContext";

const LeaveModal = ({ isOpen, onClose, onSubmit, initialData, isLoading, title }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { t } = useContext(LanguageContext);

    useEffect(() => {
        reset({
            name: initialData?.name || "",
            days: initialData?.days || "",
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
                <div className="grid grid-cols-1 gap-5">
                    <Input 
                        label="name" 
                        name="name" 
                        register={register} 
                        errors={errors} 
                        required 
                    />
                    <Input 
                        label="days" 
                        type="number" 
                        name="days" 
                        register={register} 
                        errors={errors} 
                        required 
                    />
                </div>
            </form>
        </AppModal>
    );
};

export default LeaveModal;
