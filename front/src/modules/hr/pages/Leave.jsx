import React, { cloneElement, useContext, useState } from "react";
import { Plus, Calendar, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { LanguageContext } from "../../shared/context/LanguageContext";
import DataTable from "../../shared/components/DataTable";
import SearchFilter from "../../shared/components/SearchFilter";
import useFilter from "../../shared/hooks/useFilter";
import formattedDate from "../../shared/utils/formattedDate";
import LeaveModal from "../components/LeaveModal";
import Button from "../../shared/components/Button";
import {
    useAddLeaveMutation,
    useDeleteLeaveMutation,
    useGetLeavesQuery,
    useUpdateLeaveMutation
} from "../services/LeaveSlice";
import StatsCard from "../../shared/components/StatsCard";

const Leave = () => {
    const { t } = useContext(LanguageContext);
    const { data: response, isLoading } = useGetLeavesQuery();
    const leaves = Array.isArray(response) ? response : (response?.data || response?.leaves || []);
    const [addLeave, { isLoading: isAdding }] = useAddLeaveMutation();
    const [updateLeave, { isLoading: isUpdating }] = useUpdateLeaveMutation();
    const [deleteLeave] = useDeleteLeaveMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLeave, setEditingLeave] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredLeaves = useFilter(leaves, searchTerm, ["name"]);

    const handleSubmit = async (data) => {
        const body = {
            name: data.name,
            days: Number(data.days)
        };
        try {
            if (editingLeave) {
                await updateLeave({ id: editingLeave.id, body }).unwrap();
                toast.success(t("update_success"));
            } else {
                await addLeave(body).unwrap();
                toast.success(t("add_success"));
            }
            setIsModalOpen(false);
            setEditingLeave(null);
        } catch (err) {
            toast.error(err.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t("confirm_delete"))) {
            try {
                await deleteLeave(id).unwrap();
                toast.success(t("delete_success"));
            } catch (err) {
                toast.error(err.data?.message || "Delete failed");
            }
        }
    };

    const columns = [
        {
            header: "name",
            render: (leave) => (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight italic">{leave.name}</p>
                    </div>
                </div>
            )
        },
        {
            header: "days",
            render: (leave) => (
                <span className="text-gray-900 dark:text-white text-xs font-bold">{leave.days}</span>
            )
        },
        {
            header: "created_at",
            render: (leave) => (
                <span className="text-gray-600 dark:text-gray-400 text-xs font-bold">{formattedDate(leave.created_at)}</span>
            )
        }
    ];

    const exportColumns = [
        { header: "name", key: "name" },
        { header: "days", key: "days" },
        { header: "created_at", key: "created_at", render: (leave) => formattedDate(leave.created_at) },
        { header: "id", key: "id" }
    ];

    const stats = [
        { label: t("total_leaves") || "إجمالي الإجازات", value: leaves.length || 0, icon: <Calendar className="text-orange" />, color: "orange" }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest italic uppercase">{t("leaves") || "الإجازات"}</h1>
                    <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed">
                        {t("manage_leaves_desc") || "إدارة أنواع إجازات الموظفين وتفاصيلها"}
                    </p>
                </div>

                <div className="flex gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="glass-card p-6 min-w-[200px] flex flex-col justify-between h-32 relative overflow-hidden group">
                            <StatsCard stat={stat} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <SearchFilter onSearch={setSearchTerm} placeholder={t("search_leaves") || "بحث في الإجازات"} />
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button
                        onClick={() => { setEditingLeave(null); setIsModalOpen(true); }}
                        className="btn-orange h-14 px-8 shadow-[0_0_30px_rgba(255,95,31,0.1)] !w-auto"
                        title={t("add_new")}
                        icon={<Plus size={18} />}
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredLeaves}
                isLoading={isLoading}
                onEdit={(leave) => { setEditingLeave(leave); setIsModalOpen(true); }}
                onDelete={handleDelete}
                title={t("leaves") || "الإجازات"}
                exportColumns={exportColumns}
            />

            <LeaveModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingLeave(null); }}
                onSubmit={handleSubmit}
                initialData={editingLeave}
                isLoading={isAdding || isUpdating}
                title={editingLeave ? (t("update_leave") || "تعديل إجازة") : (t("add_leave") || "إضافة إجازة")}
            />
        </div>
    );
};

export default Leave;
