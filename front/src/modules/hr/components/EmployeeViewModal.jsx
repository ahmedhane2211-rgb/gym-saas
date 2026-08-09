import React, { useContext, useState } from "react";
import { User, Phone, Mail, Calendar, Banknote, BadgeInfo } from "lucide-react";
import { LanguageContext } from "../../shared/context/LanguageContext";
import DetailItem from "../../shared/components/DetailItem";
import formattedDate from "../../shared/utils/formattedDate";
import AppModal from "../../shared/components/AppModal";
import formatNum from "../../shared/utils/formatNum";

const EmployeeViewModal = ({ isOpen, onClose, employee }) => {
  const { t } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState("personal");

  if (!isOpen || !employee) return null;

  const value = (key) => employee?.[key] || "N/A";
  const userName =
    employee.user?.full_name ||
    employee.user?.name ||
    employee.name ||
    `EMP-${employee.id}`;
  const tabs = [
    {
      id: "personal",
      label:
        "\u0628\u064a\u0627\u0646\u0627\u062a \u0634\u062e\u0635\u064a\u0629",
    },
    {
      id: "job",
      label:
        "\u0628\u064a\u0627\u0646\u0627\u062a \u0648\u0638\u064a\u0641\u064a\u0629",
    },
    {
      id: "financial",
      label:
        "\u0628\u064a\u0627\u0646\u0627\u062a \u0645\u0627\u0644\u064a\u0629",
    },
  ];

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      headerContent={
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-orange/10 text-orange flex items-center justify-center">
            <User size={34} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white  uppercase tracking-widest">
              {userName}
            </h3>
            {/* <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">
              ID: EMP-{employee.id?.toString().padStart(3, "0")}
            </p> */}
          </div>
        </div>
      }
      showCloseFooter
      closeText={t("close")}
    >
      <div className="grid grid-cols-3 gap-2 bg-gray-100 dark:bg-white/[0.03] p-1 rounded-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? "bg-orange text-black shadow-lg" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "personal" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem
            icon={<Mail size={16} />}
            label={t("email")}
            value={employee.email || employee.user?.email || "N/A"}
          />
          <DetailItem
            icon={<Phone size={16} />}
            label={t("phone")}
            value={employee.phone || employee.user?.phone || "N/A"}
          />
          <DetailItem
            icon={<User size={16} />}
            label={t("gender")}
            value={t(employee.user?.gender) || "N/A"}
          />
          <DetailItem
            icon={<BadgeInfo size={16} />}
            label={t("national_id")}
            value={value("national_id")}
          />
          <DetailItem
            icon={<BadgeInfo size={16} />}
            label={t("nationality")}
            value={value("nationality")}
          />
          <DetailItem
            icon={<BadgeInfo size={16} />}
            label={t("marital_status")}
            value={t(employee.marital_status) || "N/A"}
          />
          <DetailItem
            icon={<BadgeInfo size={16} />}
            label={t("address")}
            value={employee.user?.address || "N/A"}
          />
        </div>
      )}

      {activeTab === "job" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem
            icon={<BadgeInfo size={16} />}
            label={t("job_number")}
            value={value("job_number")}
          />
          <DetailItem
            icon={<BadgeInfo size={16} />}
            label={t("qualification")}
            value={value("qualification")}
          />
          <DetailItem
            icon={<Calendar size={16} />}
            label={t("date_of_joining")}
            value={formattedDate(employee.date_of_joining)}
          />
          <DetailItem
            icon={<Calendar size={16} />}
            label={t("created_at")}
            value={formattedDate(employee.created_at)}
          />
          <DetailItem
            icon={<BadgeInfo size={16} />}
            label={t("description")}
            value={value("description")}
          />
        </div>
      )}

      {activeTab === "financial" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem
            icon={<Banknote size={16} />}
            label={t("basic_salary")}
            value={formatNum(value("basic_salary"))}
          />
          <DetailItem
            icon={<Banknote size={16} />}
            label={t("additional_salary")}
            value={formatNum(value("additional_salary"))}
          />
          <DetailItem
            icon={<Banknote size={16} />}
            label={t("allowances")}
            value={formatNum(value("allowances"))}
          />
          <DetailItem
            icon={<Banknote size={16} />}
            label={t("health_insurance")}
            value={formatNum(value("health_insurance"))}
          />
          <DetailItem
            icon={<Banknote size={16} />}
            label={t("social_insurance")}
            value={formatNum(value("social_insurance"))}
          />
          <DetailItem
            icon={<Banknote size={16} />}
            label={t("tax")}
            value={formatNum(value("tax"))}
          />
          <DetailItem
            icon={<Banknote size={16} />}
            label={t("pending_debt")}
            value={formatNum(value("pending_debt"))}
          />
          <DetailItem
            icon={<Banknote size={16} />}
            label={t("total_salary")}
            value={formatNum(value("total_salary"))}
          />
        </div>
      )}
    </AppModal>
  );
};

export default EmployeeViewModal;
