import React, { useContext, useState, cloneElement } from "react";
import {
  useGetCoachesQuery,
  useAddCoachMutation,
  useUpdateCoachMutation,
  useDeleteCoachMutation,
} from "../services/CoachSlice";
import {
  Users as UsersIcon,
  Activity,
  Search,
  Filter,
  Plus,
  Award,
  DollarSign,
} from "lucide-react";
import toast from "react-hot-toast";
import { LanguageContext } from "../../shared/context/LanguageContext";
import formattedDate from "../../shared/utils/formattedDate";
import CoachModal from "../components/CoachModal";
import CoachViewModal from "../components/CoachViewModal";
import DataTable from "../../shared/components/DataTable";
import SearchFilter from "../../shared/components/SearchFilter";
import useFilter from "../../shared/hooks/useFilter";
import Button from "../../shared/components/Button";
import StatsCard from "../../shared/components/StatsCard";
import SectionTitle from "../../shared/components/SectionTitle";

const Coach = () => {
  const { t } = useContext(LanguageContext);
  const { data: response, error, isLoading } = useGetCoachesQuery();
  const coaches = Array.isArray(response)
    ? response
    : response?.data || response?.coaches || [];
  const [addCoach, { isLoading: isAdding }] = useAddCoachMutation();
  const [updateCoach, { isLoading: isUpdating }] = useUpdateCoachMutation();
  const [deleteCoach] = useDeleteCoachMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState(null);
  const [viewingCoach, setViewingCoach] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCoaches = useFilter(coaches, searchTerm, [
    "user.full_name",
    "specialty",
    "speciality",
  ]);

  const handleOpenAdd = () => {
    setEditingCoach(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coach) => {
    setEditingCoach(coach);
    setIsModalOpen(true);
  };

  const handleOpenView = (coach) => {
    setViewingCoach(coach);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoach(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingCoach(null);
  };

  const handleSubmitCoach = async (data) => {
    try {
      if (editingCoach) {
        await updateCoach({ id: editingCoach.id, ...data }).unwrap();
        toast.success(t("update_success") || "Coach updated successfully");
      } else {
        await addCoach(data).unwrap();
        toast.success(t("add_success") || "Coach added successfully");
      }
      handleCloseModal();
    } catch (err) {
      toast.error(
        err.data?.message || t("operation_failed") || "Operation failed",
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(t("confirm_delete") || "Are you sure you want to delete?")
    ) {
      try {
        await deleteCoach(id).unwrap();
        toast.success(t("delete_success") || "Coach deleted successfully");
      } catch (err) {
        toast.error(err.data?.message || t("delete_failed") || "Delete failed");
      }
    }
  };

  const columns = [
    {
      header: "coach_details",
      render: (coach) => (
        <div className="flex items-center gap-4">
          <div className="w-12 print:hidden h-12 rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden bg-gray-100 dark:bg-gray-dark relative">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${coach.user?.full_name}`}
              alt=""
              className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all font-main"
            />
          </div>
          <div>
            <p className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight ">
              {coach.user?.full_name}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "specialty",
      render: (coach) => (
        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
          <Award size={14} className="text-orange" />
          {coach.speciality || coach.specialty}
        </div>
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
      header: "salary",
      render: (coach) => (
        <div className="flex items-center gap-1 text-gray-900 dark:text-white">
          <DollarSign size={14} className="text-green-500" />
          {coach.salary}
        </div>
      ),
    },
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
        <SectionTitle title={t("coaches")} description={t("manage_coaches_desc")} t={t}/>
        <div className="flex gap-4">
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

        <Button
          onClick={handleOpenAdd}
          className="btn-orange h-14 px-8 shadow-[0_0_30px_rgba(255,95,31,0.1)] !w-auto"
          title={t("add_new")}
          icon={<Plus size={18} />}
        />
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredCoaches}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onView={handleOpenView}
      />

      {/* Coach Modal */}
      <CoachModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitCoach}
        initialData={editingCoach}
        isLoading={isAdding || isUpdating}
        title={editingCoach ? "update_coach" : "add_coach"}
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
