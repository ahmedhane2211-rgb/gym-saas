import React, { useContext } from "react";
import {
  Award,
  Banknote,
  Calendar,
  Activity,
  Shield,
  Mail,
  Phone,
} from "lucide-react";
import { LanguageContext } from "../../shared/context/LanguageContext";
import formattedDate from "../../shared/utils/formattedDate";
import DetailItem from "../../shared/components/DetailItem";
import AppModal from "../../shared/components/AppModal";

const CoachViewModal = ({ isOpen, onClose, coach }) => {
  const { t } = useContext(LanguageContext);

  if (!isOpen || !coach) return null;

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      showCloseFooter
      closeText={t("close")}
      headerContent={<div />}
    >
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-orange to-orange/50 opacity-10" />
      <div className="relative space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-3xl border-4 border-white dark:border-gray-dark shadow-xl overflow-hidden bg-gray-100 dark:bg-gray-dark -mt-4">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${coach.user?.full_name}`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white  uppercase tracking-widest">
              {coach.user?.full_name}
            </h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black bg-orange/10 text-orange border border-orange/20 mt-2">
              {t("coach")}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <DetailItem
              icon={<Award size={16} />}
              label={t("specialty")}
              value={coach.speciality || coach.specialty || "N/A"}
            />
            <DetailItem
              icon={<Banknote size={16} />}
              label={t("salary")}
              value={`${coach.salary} EGP` || "N/A"}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DetailItem
              icon={<Shield size={16} />}
              label={t("gender")}
              value={t(coach.user?.gender) || "N/A"}
            />
            <DetailItem
              icon={<Activity size={16} />}
              label={t("status")}
              value={
                <span
                  className={
                    coach.user?.is_active ? "text-blue" : "text-gray-500"
                  }
                >
                  {coach.user?.is_active ? t("active") : t("inactive")}
                </span>
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DetailItem
              icon={<Mail size={16} />}
              label={t("email")}
              value={coach.user?.email || "N/A"}
            />
            <DetailItem
              icon={<Phone size={16} />}
              label={t("phone")}
              value={coach.user?.phone || "N/A"}
            />
          </div>
          <DetailItem
            icon={<Calendar size={16} />}
            label={t("created_at")}
            value={formattedDate(coach.created_at)}
          />
        </div>
      </div>
    </AppModal>
  );
};

export default CoachViewModal;
