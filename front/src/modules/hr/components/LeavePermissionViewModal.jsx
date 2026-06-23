import React, { useContext } from "react";
import { User, Calendar, Clock, Hash, Tag, GitBranch, CheckCircle, XCircle, Timer } from "lucide-react";
import AppModal from "../../shared/components/AppModal";
import DetailItem from "../../shared/components/DetailItem";
import { LanguageContext } from "../../shared/context/LanguageContext";
import formattedDate from "../../shared/utils/formattedDate";

const statusConfig = {
    approved: { class: "bg-blue/10 border-blue/20 text-blue", dot: "bg-blue animate-pulse" },
    pending:  { class: "bg-orange/10 border-orange/20 text-orange", dot: "bg-orange animate-pulse" },
    rejected: { class: "bg-red-500/10 border-red-500/20 text-red-500", dot: "bg-red-500" },
};

const LeavePermissionViewModal = ({ isOpen, onClose, request }) => {
    const { t } = useContext(LanguageContext);
    if (!request) return null;

    const emp = request.employee || {};
    const user = emp.user || {};
    const leave = request.leave || {};
    const cfg = statusConfig[request.status] || statusConfig.pending;

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title={t("leave_permission_details")}
            showCloseFooter
            closeText={t("close")}
            maxWidth="max-w-[700px]"
        >
            <div className="space-y-6">
                {/* Employee card */}
                <div className="glass-card p-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-orange/10 text-orange flex items-center justify-center shrink-0">
                        <User size={26} />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{emp.name || "—"}</p>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{user.email || "—"}</p>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{user.phone || ""}</p>
                    </div>
                    <div className="ms-auto">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border ${cfg.class}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {t(request.status)}
                        </span>
                    </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <DetailItem
                        icon={<Tag size={16} />}
                        label={t("leaves")}
                        value={leave.name || "—"}
                    />
                    <DetailItem
                        icon={<Hash size={16} />}
                        label={t("remaining_days")}
                        value={leave.days ?? "—"}
                    />
                    <DetailItem
                        icon={<Calendar size={16} />}
                        label={t("from_date")}
                        value={formattedDate(request.from_date)}
                    />
                    <DetailItem
                        icon={<Calendar size={16} />}
                        label={t("to_date")}
                        value={formattedDate(request.to_date)}
                    />
                    {request.from_time && (
                        <DetailItem
                            icon={<Clock size={16} />}
                            label={t("from_time")}
                            value={request.from_time}
                        />
                    )}
                    {request.to_time && (
                        <DetailItem
                            icon={<Clock size={16} />}
                            label={t("to_time")}
                            value={request.to_time}
                        />
                    )}
                    <DetailItem
                        icon={<CheckCircle size={16} />}
                        label={t("requested_days")}
                        value={request.requested_days ?? "—"}
                    />
                    {request.requested_minutes != null && (
                        <DetailItem
                            icon={<Timer size={16} />}
                            label={t("requested_minutes")}
                            value={request.requested_minutes}
                        />
                    )}
                    <DetailItem
                        icon={<XCircle size={16} />}
                        label={t("created_at")}
                        value={formattedDate(request.created_at)}
                    />
                </div>
            </div>
        </AppModal>
    );
};

export default LeavePermissionViewModal;
