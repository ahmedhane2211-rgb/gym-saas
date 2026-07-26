import React, { useContext, useState, cloneElement } from "react";
import {
  useGetSubscriptionsQuery,
  useAddSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} from "../services/OwnerSlice";
import { Building2, Trash2, Edit3, Eye, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { LanguageContext } from "../../shared/context/LanguageContext";
import DataTable from "../../shared/components/DataTable";
import TenantModal from "../components/TenantModal";
import TenantViewModal from "../components/TenantViewModal";
import SearchFilter from "../../shared/components/SearchFilter";

const Subscriptions = () => {
  const { t } = useContext(LanguageContext);
  const { data: response, isLoading } = useGetSubscriptionsQuery();
  const subscriptions = Array.isArray(response)
    ? response
    : response?.data || [];

  const [addSubscription, { isLoading: isAdding }] =
    useAddSubscriptionMutation();
  const [updateSubscription, { isLoading: isUpdating }] =
    useUpdateSubscriptionMutation();
  const [deleteSubscription] = useDeleteSubscriptionMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [viewingSubscription, setViewingSubscription] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenEdit = (sub) => {
    setEditingSubscription(sub);
    setIsModalOpen(true);
  };

  const handleOpenView = (sub) => {
    setViewingSubscription(sub);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubscription(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingSubscription(null);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingSubscription) {
        if (editingSubscription.id) {
          await updateSubscription({
            id: editingSubscription.id,
            ...data,
          }).unwrap();
          toast.success(t("update_success") || "Subscription updated");
        } else {
          await addSubscription(data).unwrap();
          toast.success(t("add_success") || "Subscription created");
        }
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
      window.confirm(
        t("confirm_delete") || "Are you sure you want to delete this gym?",
      )
    ) {
      try {
        await deleteSubscription(id).unwrap();
        toast.success(t("delete_success") || "Gym deleted successfully");
      } catch (err) {
        toast.error(err.data?.message || t("delete_failed") || "Delete failed");
      }
    }
  };

  const filteredData = subscriptions.filter((sub) => {
    const search = searchTerm.toLowerCase();
    return (
      sub.gym_name?.toLowerCase().includes(search) ||
      sub.user?.full_name?.toLowerCase().includes(search) ||
      sub.user?.email?.toLowerCase().includes(search)
    );
  });

  const columns = [
    {
      header: "tenant_name",
      render: (sub) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center text-orange">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight ">
              {sub.gym_name}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "owner_name",
      render: (sub) => (
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          {sub.user?.full_name || t("no_owner")}
        </p>
      ),
    },
    {
      header: "email",
      render: (sub) => (
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          {sub.user?.email || "-"}
        </p>
      ),
    },
    {
      header: "status",
      render: (sub) => (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border ${
            sub.status === "active"
              ? "bg-green-500/10 border-green-500/20 text-green-500"
              : "bg-red-500/10 border-red-500/20 text-red-500"
          }`}
        >
          <div
            className={`w-1 h-1 rounded-full ${sub.status === "active" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
          />
          {sub.status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "actions",
      render: (sub) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenView(sub)}
            className="p-2 rounded-lg hover:bg-orange/10 text-gray-400 hover:text-orange transition-colors"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleOpenEdit(sub)}
            className="p-2 rounded-lg hover:bg-blue/10 text-gray-400 hover:text-blue transition-colors"
          >
            <Edit3 size={18} />
          </button>
          {sub.id && (
            <button
              onClick={() => handleDelete(sub.id)}
              className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const stats = [
    {
      label: t("total_invoices") || "Total Gyms",
      value: subscriptions.length,
      icon: <Building2 className="text-orange" />,
      color: "orange",
    },
    {
      label: t("active_subscriptions") || "Active Subscriptions",
      value: subscriptions.filter((s) => s.status === "active").length,
      icon: <ShieldCheck className="text-blue" />,
      color: "blue",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest  uppercase">
            {t("subscriptions_management")}
          </h1>
          <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed">
            {t("manage_tenants_desc")}
          </p>
        </div>

        <div className="flex gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card p-6 min-w-[200px] flex flex-col justify-between h-32 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ltr:translate-x-2 ltr:-translate-y-2 rtl:-translate-x-2 rtl:-translate-y-2">
                {cloneElement(stat.icon, { size: 64 })}
              </div>
              <p className="text-gray-600 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                {stat.label}
              </p>
              <p
                className={`text-4xl font-black ${stat.color === "orange" ? "text-orange" : "text-blue"}`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <SearchFilter onSearch={setSearchTerm} />
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        actions={false}
        title={t("subscriptions_management")}
      />

      <TenantModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingSubscription}
        isLoading={isAdding || isUpdating}
      />

      <TenantViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        tenant={viewingSubscription}
      />
    </div>
  );
};

export default Subscriptions;
