import React, { useContext } from "react";
import {
  Building2,
  User,
  Mail,
  Globe,
  Calendar,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import { LanguageContext } from "../../shared/context/LanguageContext";
import formattedDate from "../../shared/utils/formattedDate";
import AppModal from "../../shared/components/AppModal";

const TenantViewModal = ({ isOpen, onClose, tenant }) => {
  const { t } = useContext(LanguageContext);

  if (!isOpen || !tenant) return null;

  const DetailItem = ({ icon: Icon, label, value, color = "orange" }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
      <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          {t(label)}
        </p>
        <p className="text-gray-900 dark:text-white font-bold">
          {value || "---"}
        </p>
      </div>
    </div>
  );

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("subscription_details")}
      maxWidth="max-w-xl"
      showCloseFooter
      closeText={t("close")}
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-6 space-y-3">
          <div className="w-20 h-20 rounded-3xl bg-orange/10 flex items-center justify-center text-orange shadow-2xl shadow-orange/20">
            <Building2 size={40} />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase ">
              {tenant.gym_name}
            </h3>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full text-[9px] uppercase tracking-widest font-black border ${
                tenant.status === "active"
                  ? "bg-green-500/10 border-green-500/20 text-green-500"
                  : "bg-red-500/10 border-red-500/20 text-red-500"
              }`}
            >
              {tenant.status === "active" ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem
            icon={User}
            label="owner_name"
            value={tenant.user?.full_name}
          />
          <DetailItem
            icon={Mail}
            label="email"
            value={tenant.user?.email}
            color="blue"
          />
          <DetailItem
            icon={Calendar}
            label="start_date"
            value={formattedDate(tenant.start_date)}
            color="purple-500"
          />
          <DetailItem
            icon={Calendar}
            label="end_date"
            value={formattedDate(tenant.end_date)}
            color="green-500"
          />
          <DetailItem
            icon={BadgeCheck}
            label="paid"
            value={tenant.paid}
            color="yellow-500"
          />
          <DetailItem
            icon={Globe}
            label="phone"
            value={tenant.gym_phone}
            color="orange"
          />
        </div>

        <div className="p-6 rounded-2xl bg-orange/5 border border-orange/10 flex items-start gap-4">
          <ShieldCheck size={24} className="text-orange shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-black text-orange uppercase tracking-widest">
              System Access Verified
            </p>
            <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
              This gym is currently authorized to use the platform. All security
              protocols and feature limits are enforced based on the active
              tier.
            </p>
          </div>
        </div>
      </div>
    </AppModal>
  );
};

export default TenantViewModal;
