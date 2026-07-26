import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import { LanguageContext } from "../../shared/context/LanguageContext";
import AppModal from "../../shared/components/AppModal";

const CheckInModal = ({ isOpen, onClose, onSubmit, member, isLoading }) => {
  const { register, handleSubmit } = useForm();
  const { t } = useContext(LanguageContext);

  if (!member) return null;

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={t("check_in")} maxWidth="max-w-md">
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5">
        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user?.full_name}`} alt="" />
        </div>
        <div>
          <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase">{member.user?.full_name}</h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: MB-{member.id?.toString().padStart(3, "0")}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
        <div className="flex flex-col gap-4">
          <Button title={isLoading ? "Processing..." : t("check_in")} className="w-full bg-blue hover:bg-blue/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-lg dark:shadow-[0_0_30px_rgba(0,127,255,0.2)]" />
          <Button onClick={onClose} title={t("cancel")} className="w-full text-gray-500 dark:text-gray-600 font-black text-[10px] tracking-[0.3em] uppercase hover:text-gray-900 dark:hover:text-white transition-colors" />
        </div>
      </form>
    </AppModal>
  );
};

export default CheckInModal;
