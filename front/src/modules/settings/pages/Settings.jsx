import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Building2, Save } from "lucide-react";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../services/SettingsSlice";
import { LanguageContext } from "../../shared/context/LanguageContext";
import toast from "react-hot-toast";
import InvoiceSection from "../components/InvoiceSection";
import AssetSection from "../components/AssetSection";
import CompanyInfoSection from "../components/CompanyInfoSection";
import Button from "../../shared/components/Button";

const Settings = () => {
  const { t } = useContext(LanguageContext);
  const { data: settingsData, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateSettingsMutation();

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      company_name: "",
      company_email: "",
      company_phone: "",
      whatsapp: "",
      website: "",
      tax_number: "",
      commercial_registry: "",
      bank_account: "",
      address: "",
      show_name_in_header: true,
      show_address_in_header: true,
      show_logo_in_header: true,
      show_tax_in_footer: true,
      show_whatsapp_in_footer: true,
      show_phone_in_footer: true,
      show_email_in_footer: true,
      show_website_in_footer: true,
      show_stamp_in_footer: true,
    },
  });

  const [logo, setLogo] = useState(null);
  const [stamp, setStamp] = useState(null);

  useEffect(() => {
    if (settingsData?.data) {
      reset(settingsData.data);
    }
  }, [settingsData, reset]);

  const onSubmit = async (formData) => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (logo) data.append("logo", logo);
    if (stamp) data.append("stamp", stamp);

    try {
      await updateSettings(data).unwrap();
      toast.success(
        t("settings_updated_success") || "Settings updated successfully",
      );
    } catch (err) {
      toast.error(err.data?.message || t("update_failed"));
    }
  };

  if (isLoading)
    return (
      <div className="p-8 animate-pulse text-gray-400 font-black uppercase tracking-widest">
        Loading Settings...
      </div>
    );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="space-y-2">
        <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest  uppercase">
          {t("settings")}
        </h1>
        <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed">
          {t("manage_settings_desc") ||
            "Configure your company details and invoice preferences."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        <CompanyInfoSection register={register} t={t} />

        <AssetSection
          logo={logo}
          stamp={stamp}
          setLogo={setLogo}
          setStamp={setStamp}
          settingsData={settingsData}
          t={t}
        />

        <InvoiceSection control={control} t={t} />

        <div className="flex justify-start pt-10">
          <div className="w-[200px]">
            <Button
              title={isUpdating ? t("saving") : t("save_settings")}
              icon={<Save size={18} />}
              onClick={handleSubmit(onSubmit)}
              disabled={isUpdating}
              className="btn-orange"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
