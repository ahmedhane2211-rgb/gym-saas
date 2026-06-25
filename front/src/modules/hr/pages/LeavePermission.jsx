import React, { cloneElement, useContext, useState } from "react";
import { Plus, Calendar, FileText, Check, X, Edit2, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { LanguageContext } from "../../shared/context/LanguageContext";
import DataTable from "../../shared/components/DataTable";
import SearchFilter from "../../shared/components/SearchFilter";
import useFilter from "../../shared/hooks/useFilter";
import formattedDate from "../../shared/utils/formattedDate";
import LeavePermissionModal from "../components/LeavePermissionModal";
import LeavePermissionViewModal from "../components/LeavePermissionViewModal";
import Button from "../../shared/components/Button";
import {
    useGetLeavesPermissionsQuery,
    useAddLeavePermissionMutation,
    useUpdateLeavePermissionMutation,
    useDeleteLeavePermissionMutation,
    useApproveLeavePermissionMutation,
    useRejectLeavePermissionMutation
} from "../services/LeavePermissionSlice";
import StatsCard from "../../shared/components/StatsCard";

const LeavePermission = () => {
    const { t } = useContext(LanguageContext);
    const { data: response, isLoading } = useGetLeavesPermissionsQuery();
    const requests = Array.isArray(response) ? response : (response?.data || response?.requests || []);
    
    const [addRequest, { isLoading: isAdding }] = useAddLeavePermissionMutation();
    const [updateRequest, { isLoading: isUpdating }] = useUpdateLeavePermissionMutation();
    const [deleteRequest] = useDeleteLeavePermissionMutation();
    const [approveRequest] = useApproveLeavePermissionMutation();
    const [rejectRequest] = useRejectLeavePermissionMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);
    const [viewingRequest, setViewingRequest] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const filteredByStatus = requests.filter((req) => {
        if (activeTab === "all") return true;
        return req.status === activeTab;
    });

    const filteredRequests = useFilter(filteredByStatus, searchTerm, ["employee_name", "leave_name"]);

    const handleSubmit = async (data) => {
        const body = {
            employee_id: data.employee_id, 
            leaves_id: data.leaves_id,
            from_date: data.from_date,
            to_date: data.to_date,
            from_time: data.from_time || null,
            to_time: data.to_time || null,
            requested_minutes: data.requested_minutes ? Number(data.requested_minutes) : null
        };
        try {
            if (editingRequest) {
                await updateRequest({ id: editingRequest.id, body }).unwrap();
                toast.success(t("update_success"));
            } else {
                await addRequest(body).unwrap();
                toast.success(t("add_success"));
            }
            setIsModalOpen(false);
            setEditingRequest(null);
        } catch (err) {
            toast.error(err.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t("confirm_delete"))) {
            try {
                await deleteRequest(id).unwrap();
                toast.success(t("delete_success"));
            } catch (err) {
                toast.error(err.data?.message || "Delete failed");
            }
        }
    };

    const handleApprove = async (id) => {
        if (window.confirm(t("confirm_approve") || "Are you sure you want to approve this request?")) {
            try {
                await approveRequest(id).unwrap();
                toast.success(t("approve_success") || "Request approved successfully");
            } catch (err) {
                toast.error(err.data?.message || "Approval failed");
            }
        }
    };

    const handleReject = async (id) => {
        if (window.confirm(t("confirm_reject") || "Are you sure you want to reject this request?")) {
            try {
                await rejectRequest(id).unwrap();
                toast.success(t("reject_success") || "Request rejected successfully");
            } catch (err) {
                toast.error(err.data?.message || "Rejection failed");
            }
        }
    };

    const columns = [
        {
            header: "employee_id",
            render: (req) => (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight italic">{req.employee?.name}</p>
                        <p className="text-gray-500 dark:text-gray-600 text-[10px] font-bold uppercase tracking-widest">{req.leave?.name}</p>
                    </div>
                </div>
            )
        },
        {
            header: "from_date",
            render: (req) => (
                <span className="text-gray-600 dark:text-gray-400 text-xs font-bold">{formattedDate(req.from_date)}</span>
            )
        },
        {
            header: "to_date",
            render: (req) => (
                <span className="text-gray-600 dark:text-gray-400 text-xs font-bold">{formattedDate(req.to_date)}</span>
            )
        },
        {
            header: "requested_days",
            render: (req) => (
                <span className="text-gray-900 dark:text-white text-xs font-bold">{req.requested_days || 0}</span>
            )
        },
        {
            header: "remaining_days",
            render: (req) => (
                <span className="text-gray-500 dark:text-gray-400 text-xs font-bold">{req.remaining_days || 0}</span>
            )
        },
        {
            header: "status",
            render: (req) => (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border ${req.status === 'approved'
                    ? 'bg-blue/10 border-blue/20 text-blue'
                    : req.status === 'pending'
                    ? 'bg-orange/10 border-orange/20 text-orange'
                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                    }`}>
                    <div className={`w-1 h-1 rounded-full ${req.status === 'pending' ? 'bg-orange animate-pulse' : req.status === 'approved' ? 'bg-blue animate-pulse' : 'bg-red-500'}`} />
                    {t(req.status)}
                </span>
            )
        },
        {
            header: "actions",
            render: (req) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewingRequest(req)}
                        className="p-2 text-gray-400 hover:text-blue transition-colors"
                        title={t("view")}
                    >
                        <Eye size={16} />
                    </button>
                    {req.status === "pending" && (
                        <>
                            <button
                                onClick={() => { setEditingRequest(req); setIsModalOpen(true); }}
                                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(req.id)}
                                className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                            <button
                                onClick={() => handleApprove(req.id)}
                                className="p-2 text-gray-400 hover:text-green-500 transition-colors font-bold text-base"
                                title={t("approve")}
                            >
                                <Check size={16} />
                            </button>
                            <button
                                onClick={() => handleReject(req.id)}
                                className="p-2 text-gray-400 hover:text-rose-500 transition-colors font-bold text-base"
                                title={t("reject")}
                            >
                                <X size={16} />
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    const exportColumns = [
        { header: "employee_name", key: "employee_name" },
        { header: "leave_name", key: "leave_name" },
        { header: "from_date", key: "from_date", render: (req) => formattedDate(req.from_date) },
        { header: "to_date", key: "to_date", render: (req) => formattedDate(req.to_date) },
        { header: "requested_days", key: "requested_days" },
        { header: "remaining_days", key: "remaining_days" },
        { header: "status", key: "status" }
    ];

    const stats = [
        { label: t("total_requests"), value: requests.length, icon: <FileText className="text-orange" />, color: "orange" },
        { label: t("pending_requests"), value: requests.filter(r => r.status === "pending").length, icon: <FileText className="text-blue" />, color: "blue" },
        { label: t("approved_requests"), value: requests.filter(r => r.status === "approved").length, icon: <FileText className="text-green-500" />, color: "green" },
        { label: t("rejected_requests"), value: requests.filter(r => r.status === "rejected").length, icon: <FileText className="text-red-500" />, color: "red" }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest italic uppercase">{t("leaves_permissions")}</h1>
                    <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed">
                        {t("manage_leaves_permissions_desc")}
                    </p>
                </div>

                <div className="flex gap-4 flex-wrap">
                    {stats.map((stat) => (
                        <div key={stat.label} className="glass-card p-6 min-w-[150px] flex flex-col justify-between h-32 relative overflow-hidden group">
                            <StatsCard stat={stat} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-xs">
                <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    style={{ fontSize: 'var(--font-size-sm)' }}
                    className="w-full min-h-14 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white focus:border-orange/50 focus:outline-none font-black tracking-widest"
                >
                    <option value="all">{t("all")}</option>
                    <option value="pending">{t("pending")}</option>
                    <option value="approved">{t("approved")}</option>
                    <option value="rejected">{t("rejected")}</option>
                </select>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <SearchFilter onSearch={setSearchTerm} placeholder={t("search_leaves_permissions")} />
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button
                        onClick={() => { setEditingRequest(null); setIsModalOpen(true); }}
                        className="btn-orange h-14 px-8 shadow-[0_0_30px_rgba(255,95,31,0.1)] !w-auto"
                        title={t("add_leave_permission")}
                        icon={<Plus size={18} />}
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredRequests}
                isLoading={isLoading}
                title={t("leaves_permissions")}
                exportColumns={exportColumns}
                actions={false}
            />

            <LeavePermissionModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingRequest(null); }}
                onSubmit={handleSubmit}
                initialData={editingRequest}
                isLoading={isAdding || isUpdating}
                title={editingRequest ? "update_leave_permission" : "add_leave_permission"}
            />

            <LeavePermissionViewModal
                isOpen={!!viewingRequest}
                onClose={() => setViewingRequest(null)}
                request={viewingRequest}
            />
        </div>
    );
};

export default LeavePermission;
