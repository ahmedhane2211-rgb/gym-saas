import React, { useContext, useState, cloneElement } from "react";
import {
  useGetAdminsQuery,
  useAddAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} from "../services/AdminSlice";
import {
  Shield,
  Search,
  Filter,
  Plus,
  Phone,
  MapPin,
  Home,
} from "lucide-react";
import toast from "react-hot-toast";
import { LanguageContext } from "../../shared/context/LanguageContext";
import DataTable from "../../shared/components/DataTable";
import AdminModal from "../components/AdminModal";
import AdminViewModal from "../components/AdminViewModal";

const Admin = () => {
  const { t } = useContext(LanguageContext);
  const { data: response, error, isLoading } = useGetAdminsQuery();
  const admins = Array.isArray(response)
    ? response
    : response?.data || response?.admins || [];

  const [addAdmin, { isLoading: isAdding }] = useAddAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [viewingAdmin, setViewingAdmin] = useState(null);

  const handleOpenAdd = () => {
    setEditingAdmin(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (admin) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  const handleOpenView = (admin) => {
    setViewingAdmin(admin);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingAdmin(null);
  };

  const handleSubmitAdmin = async (data) => {
    try {
      if (editingAdmin) {
        await updateAdmin({ id: editingAdmin.id, ...data }).unwrap();
        toast.success("Admin updated successfully");
      } else {
        await addAdmin(data).unwrap();
        toast.success("Admin added successfully");
      }
      handleCloseModal();
    } catch (err) {
      toast.error(err.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this administrator?")) {
      try {
        await deleteAdmin(id).unwrap();
        toast.success("Admin removed");
      } catch (err) {
        toast.error(err.data?.message || "Delete failed");
      }
    }
  };

  const columns = [
    {
      header: "full_name",
      render: (admin) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden bg-gray-100 dark:bg-gray-dark relative">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${admin.name}`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight ">
              {admin.name}
            </p>
            <p className="text-gray-500 dark:text-gray-600 text-[9px] font-bold uppercase tracking-widest">
              ID: ADM-{admin.id}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "phone",
      render: (admin) => (
        <div className="flex items-center gap-2 text-gray-500 text-[11px] font-bold">
          <Phone size={14} className="text-orange" />
          {admin.phone}
        </div>
      ),
    },
    {
      header: "address",
      render: (admin) => (
        <div className="flex items-center gap-2 text-gray-500 text-[11px] font-bold truncate max-w-[200px]">
          <MapPin size={14} className="text-orange" />
          {admin.address}
        </div>
      ),
    },
    {
      header: "Gym ID",
      render: (admin) => (
        <div className="flex items-center gap-2 text-gray-900 dark:text-white text-[11px] font-black uppercase tracking-widest">
          <Home size={14} className="text-blue" />
          {admin.gym_id}
        </div>
      ),
    },
    {
      header: "status",
      render: (admin) => (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border ${
            admin.isActive
              ? "bg-orange/10 border-orange/20 text-orange"
              : "bg-gray-500/10 border-gray-500/20 text-gray-500"
          }`}
        >
          <div
            className={`w-1 h-1 rounded-full ${admin.isActive ? "bg-orange animate-pulse" : "bg-gray-500"}`}
          />
          {admin.isActive ? t("active") : t("inactive")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest  uppercase">
            Admins
          </h1>
          <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed">
            Manage system administrators and branch managers access.
          </p>
        </div>

        <div className="glass-card p-6 min-w-[240px] flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ltr:translate-x-2 ltr:-translate-y-2 rtl:-translate-x-2 rtl:-translate-y-2">
            <Shield size={64} className="text-orange" />
          </div>
          <p className="text-gray-600 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
            Total Admins
          </p>
          <p className="text-4xl font-black text-orange">{admins.length}</p>
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
            placeholder="Search admins..."
            className="w-full bg-gray-50 dark:bg-gray-dark/30 border border-gray-200 dark:border-white/5 rounded-xl py-4 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-orange/20 transition-all font-main"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-6 py-4 bg-gray-50 dark:bg-gray-dark/50 border border-gray-200 dark:border-white/5 rounded-xl text-gray-500 dark:text-gray-light font-black text-[12px] uppercase tracking-widest hover:text-orange dark:hover:text-white transition-all">
            <Filter size={16} />
            <span>{t("filters")}</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="btn-orange flex items-center gap-2 h-14 px-8 shadow-[0_0_30px_rgba(255,95,31,0.1)]"
          >
            <Plus size={18} />
            <span>{t("add_new")}</span>
          </button>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={admins}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onView={handleOpenView}
      />

      {/* Modals */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitAdmin}
        initialData={editingAdmin}
        isLoading={isAdding || isUpdating}
        title={editingAdmin ? "update_user" : "add_user"}
      />

      <AdminViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        admin={viewingUser}
      />
    </div>
  );
};

export default Admin;
