import React from "react";
import { Controller } from "react-hook-form";
import Toggle from "../../shared/components/Toggle";

const InvoiceSection = ({ control, t }) => {
  return (
    <section className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-black uppercase tracking-widest text-gray-400 ">
          {t("invoice_header")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Controller
            name="show_name_in_header"
            control={control}
            render={({ field }) => (
              <Toggle
                label={t("company_name")}
                enabled={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="show_address_in_header"
            control={control}
            render={({ field }) => (
              <Toggle
                label={t("address")}
                enabled={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="show_logo_in_header"
            control={control}
            render={({ field }) => (
              <Toggle
                label={t("company_logo")}
                enabled={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-black uppercase tracking-widest text-gray-400 ">
          {t("invoice_footer")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Controller
            name="show_tax_in_footer"
            control={control}
            render={({ field }) => (
              <Toggle
                label={t("tax_number")}
                enabled={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="show_whatsapp_in_footer"
            control={control}
            render={({ field }) => (
              <Toggle
                label={t("whatsapp")}
                enabled={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="show_phone_in_footer"
            control={control}
            render={({ field }) => (
              <Toggle
                label={t("company_phone")}
                enabled={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="show_email_in_footer"
            control={control}
            render={({ field }) => (
              <Toggle
                label={t("company_email")}
                enabled={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="show_website_in_footer"
            control={control}
            render={({ field }) => (
              <Toggle
                label={t("website")}
                enabled={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="show_stamp_in_footer"
            control={control}
            render={({ field }) => (
              <Toggle
                label={t("company_stamp")}
                enabled={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </section>
  );
};

export default InvoiceSection;
