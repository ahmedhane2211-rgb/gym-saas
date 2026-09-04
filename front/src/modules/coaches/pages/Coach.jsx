import React, { useContext, useState } from "react";
import { useGetEmployeesQuery } from "../../hr/services/EmployeeSlice";
import {
  Users as UsersIcon,
  Activity,
  User,
  Banknote,
} from "lucide-react";
import toast from "react-hot-toast";
import { LanguageContext } from "../../shared/context/LanguageContext";
import formattedDate from "../../shared/utils/formattedDate";
import CoachViewModal from "../components/CoachViewModal";
import DataTable from "../../shared/components/DataTable";
import SearchFilter from "../../shared/components/SearchFilter";
import useFilter from "../../shared/hooks/useFilter";
import StatsCard from "../../shared/components/StatsCard";
import SectionTitle from "../../shared/components/SectionTitle";
import formatNum from "../../shared/utils/formatNum";

const Coach = () => {
  const { t } = useContext(LanguageContext);
  const { data: response, error, isLoading } = useGetEmployeesQuery();
  const allEmployees = Array.isArray(response)
    ? response
    : response?.data || response?.employees || [];

  const coaches = allEmployees.filter(
    (emp) =>
      String(emp.user?.role || emp.role || "").toLowerCase() === "coach",
  );

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingCoach, setViewingCoach] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCoaches = useFilter(coaches, searchTerm, [
    "user.full_name",
    "name",
    "job_number",
    "user.phone",
    "phone",
    "user.email",
    "email",
  ]);

  const handleOpenView = (coach) => {
    setViewingCoach(coach);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingCoach(null);
  };

  const columns = [
    {
      header: "coach_details",
      render: (coach) => {
        const name =
          coach.user?.full_name ||
          coach.user?.name ||
          coach.name ||
          `COACH-${coach.id}`;
        return (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0">
              <User size={20} />
            </div>
            <div>
              <p className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight ">
                {name}
              </p>
              <p className="text-gray-500 dark:text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                {coach.job_number || `EMP-${coach.id}`}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: "phone",
      render: (coach) => (
        <span className="text-gray-900 dark:text-white text-xs font-bold">
          {coach.phone || coach.user?.phone || "N/A"}
        </span>
      ),
    },
    {
      header: "status",
      render: (coach) => (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${
            coach.user?.is_active
              ? "bg-blue/10 border-blue/20 text-blue"
              : "bg-gray-500/10 border-gray-500/20 text-gray-500"
          }`}
        >
          <div
            className={`w-1 h-1 rounded-full ${coach.user?.is_active ? "bg-blue animate-pulse" : "bg-gray-50"}`}
          />
          {coach.user?.is_active ? t("active") : t("inactive")}
        </span>
      ),
    },
    {
      header: "date_of_joining",
      render: (coach) => (
        <span className="text-gray-600 dark:text-gray-400 text-xs font-bold">
          {formattedDate(coach.date_of_joining)}
        </span>
      ),
    },
    {
      header: "total_salary",
      render: (coach) => (
        <div className="flex items-center gap-2 text-gray-900 dark:text-white text-[11px] font-black uppercase tracking-widest">
          <Banknote size={14} className="text-green-500" />
          {formatNum(coach.total_salary || 0)}
        </div>
      ),
    },
  ];

  const exportColumns = [
    {
      header: "name",
      key: "name",
      render: (coach) =>
        coach.name || coach.user?.full_name || coach.user?.name || "",
    },
    { header: "job_number", key: "job_number" },
    {
      header: "email",
      key: "email",
      render: (coach) => coach.email || coach.user?.email || "",
    },
    {
      header: "phone",
      key: "phone",
      render: (coach) => coach.phone || coach.user?.phone || "",
    },
    { header: "gender", key: "gender" },
    { header: "national_id", key: "national_id" },
    { header: "nationality", key: "nationality" },
    { header: "marital_status", key: "marital_status" },
    { header: "qualification", key: "qualification" },
    {
      header: "date_of_joining",
      key: "date_of_joining",
      render: (coach) => formattedDate(coach.date_of_joining),
    },
    { header: "total_salary", key: "total_salary" },
  ];

  const stats = [
    {
      label: t("total_coaches") || "Total Coaches",
      value: coaches?.length || 0,
      icon: <UsersIcon className="text-orange" />,
      color: "orange",
    },
    {
      label: t("active_coaches") || "Active Coaches",
      value: coaches?.filter((c) => c.user?.is_active).length || 0,
      icon: <Activity className="text-blue" />,
      color: "blue",
    },
  ];

  if (error) {
    toast.error(t("fetch_error") || "Failed to fetch coaches");
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <SectionTitle
          title={t("coaches")}
          description={t("manage_coaches_desc")}
          t={t}
        />
        <div className="flex flex-col sm:flex-row gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card p-6 min-w-[200px] flex flex-col justify-between h-32 relative overflow-hidden group"
            >
              <StatsCard stat={stat} />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <SearchFilter
          onSearch={setSearchTerm}
          placeholder={t("search_coaches") || "Search coaches..."}
        />
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredCoaches}
        isLoading={isLoading}
        onView={handleOpenView}
        title={t("coaches")}
        exportColumns={exportColumns}
      />

      {/* Coach View Modal */}
      <CoachViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        coach={viewingCoach}
      />
    </div>
  );
};

export default Coach;
