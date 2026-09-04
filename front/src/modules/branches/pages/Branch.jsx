import React, { useContext, useState, cloneElement } from "react";
import {
  useGetBranchesQuery,
  useAddBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} from "../services/BranchSlice";
import {
  Building2,
  Activity,
  Search,
  Filter,
  Plus,
  MapPin,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";
import { LanguageContext } from "../../shared/context/LanguageContext";
import formattedDate from "../../shared/utils/formattedDate";
import BranchModal from "../components/BranchModal";
import BranchViewModal from "../components/BranchViewModal";
import DataTable from "../../shared/components/DataTable";
import Button from "../../shared/components/Button";
import StatsCard from "../../shared/components/StatsCard";

const Branch = () => {
  const { t } = useContext(LanguageContext);
  const { data: response, error, isLoading } = useGetBranchesQuery();
  const branches = Array.isArray(response)
    ? response
    : response?.data || response?.branches || [];
  const [addBranch, { isLoading: isAdding }] = useAddBranchMutation();
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [viewingBranch, setViewingBranch] = useState(null);

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (branch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const handleOpenView = (branch) => {
    setViewingBranch(branch);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingBranch(null);
  };

  const handleSubmitBranch = async (data) => {
    try {
      if (editingBranch) {
        await updateBranch({ id: editingBranch.id, ...data }).unwrap();
        toast.success(t("update_success") || "Branch updated successfully");
      } else {
        await addBranch(data).unwrap();
        toast.success(t("add_success") || "Branch added successfully");
      }
      handleCloseModal();
    } catch (err) {
      toast.error(
        err.data?.message || t("operation_failed") || "Operation failed",
      );
    }
  };

  const columns = [
    {
      header: "branch_name",
      render: (branch) => (
        <div className="flex items-center gap-4 text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight ">
          <div className="p-2.5 rounded-xl bg-orange/10 text-orange">
            <Building2 size={18} />
          </div>
          {branch.name}
        </div>
      ),
    },
    {
      header: "phone",
      render: (branch) => (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-widest">
          <Phone size={14} className="text-blue" />
          {branch.phone}
        </div>
      ),
    },
    {
      header: "address",
      render: (branch) => (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-widest truncate max-w-[200px]">
          <MapPin size={14} className="text-purple" />
          {branch.address}
        </div>
      ),
    },
    {
      header: "status",
      render: (branch) => (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border ${
            branch.is_active
              ? "bg-blue/10 border-blue/20 text-blue"
              : "bg-gray-500/10 border-gray-500/20 text-gray-500"
          }`}
        >
          <div
            className={`w-1 h-1 rounded-full ${branch.is_active ? "bg-blue animate-pulse" : "bg-gray-500"}`}
          />
          {branch.is_active ? t("active") : t("inactive")}
        </span>
      ),
    },
  ];

  const stats = [
    {
      label: t("total_branches") || "Total Branches",
      value: branches?.length || 0,
      icon: <Building2 className="text-orange" />,
      color: "orange",
    },
    {
      label: t("active_branches") || "Active Branches",
      value: branches?.filter((b) => b.is_active).length || 0,
      icon: <Activity className="text-blue" />,
      color: "blue",
    },
  ];

  if (error) {
    toast.error(t("fetch_error") || "Failed to fetch branches");
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest  uppercase">
            {t("branches")}
          </h1>
          <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed">
            {t("manage_branches_desc")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card p-6 min-w-[200px] flex flex-col justify-between h-32 relative overflow-hidden group font-main font-bold "
            >
              <StatsCard stat={stat} />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative group w-full md:w-96">
          <Search
            className="absolute inset-y-0 ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search branches..."
            className="w-full bg-gray-50 dark:bg-gray-dark/30 border border-gray-200 dark:border-white/5 rounded-xl py-4 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-orange/20 transition-all placeholder:text-gray-400 font-medium font-main"
          />
        </div>

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
        data={branches}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onView={handleOpenView}
      />

      {/* Branch Modal */}
      <BranchModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitBranch}
        initialData={editingBranch}
        isLoading={isAdding || isUpdating}
        title={editingBranch ? "update_branch" : "add_branch"}
      />

      {/* Branch View Modal */}
      <BranchViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        branch={viewingBranch}
      />
    </div>
  );
};

export default Branch;
