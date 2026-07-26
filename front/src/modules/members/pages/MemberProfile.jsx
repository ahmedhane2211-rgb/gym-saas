import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Dumbbell,
  Calendar,
  DollarSign,
  Activity,
  Sparkles,
  Clock,
  User,
  Mail,
  Phone,
  Shield,
  QrCode,
} from "lucide-react";
import { useGetMemberByIdQuery } from "../services/MemberSlice";
import { LanguageContext } from "../../shared/context/LanguageContext";
import formattedDate from "../../shared/utils/formattedDate";
import { QRCodeCanvas } from "qrcode.react";

const MemberProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const { data: response, isLoading, error } = useGetMemberByIdQuery(id);
  const member = response?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-gray-500 font-bold">
          {t("member_not_found") || "Member not found"}
        </p>
        <button
          onClick={() => navigate("/members")}
          className="flex items-center gap-2 text-orange font-black uppercase text-xs tracking-widest hover:underline"
        >
          <ArrowLeft size={16} />
          {t("back_to_members") || "Back to Members"}
        </button>
      </div>
    );
  }

  const memberQrValue = `MB-${member?.qr_code}`;
  const activeSub = member?.subscriptions?.find(
    (sub) => sub.status === "active",
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/members")}
          className="flex items-center gap-2 text-gray-500 hover:text-orange transition-colors font-black uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={18} />
          {t("back") || "Back"}
        </button>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-widest  uppercase">
          {t("member_profile") || "Member Profile"}
        </h1>
      </div>

      {/* Profile Overview Card */}
      <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 z-10">
          <div className="w-28 h-28 rounded-3xl border-4 border-orange/20 overflow-hidden bg-gray-100 dark:bg-gray-dark shadow-xl">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member?.user?.full_name}`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left rtl:md:text-right space-y-2">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white  uppercase tracking-wider">
              {member?.user?.full_name}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black bg-orange/10 text-orange border border-orange/20">
                ID: {memberQrValue}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border ${
                  activeSub
                    ? "bg-blue/10 border-blue/20 text-blue"
                    : "bg-gray-500/10 border-gray-500/20 text-gray-500"
                }`}
              >
                {activeSub ? t("active") : t("inactive")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white/5 dark:bg-black/20 border border-gray-100 dark:border-white/5 p-4 rounded-3xl">
          <div className="bg-white p-2 rounded-2xl shadow-md">
            <QRCodeCanvas
              value={memberQrValue}
              size={90}
              level="H"
              includeMargin={false}
            />
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              {t("scan_code") || "Scan QR"}
            </p>
            <p className="text-sm font-black text-gray-900 dark:text-white">
              {memberQrValue}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-black text-gray-900 dark:text-white  uppercase tracking-wider flex items-center gap-2">
              <User size={18} className="text-orange" />
              {t("personal_info") || "Personal Info"}
            </h3>
            <div className="w-12 h-1 bg-orange rounded-full -mt-2" />

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  {t("gender")}
                </span>
                <span className="text-xs font-black text-gray-900 dark:text-white uppercase">
                  {t(member?.user?.gender) || member?.user?.gender}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  {t("phone")}
                </span>
                <span className="text-xs font-black text-gray-900 dark:text-white">
                  {member?.user?.phone}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  {t("email")}
                </span>
                <span className="text-xs font-black text-gray-900 dark:text-white lowercase">
                  {member?.user?.email}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  {t("id_number")}
                </span>
                <span className="text-xs font-black text-gray-900 dark:text-white">
                  {member?.id_number}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  {t("join_date") || "Join Date"}
                </span>
                <span className="text-xs font-black text-gray-900 dark:text-white">
                  {formattedDate(member?.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Attendance Mini Card */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-black text-gray-900 dark:text-white  uppercase tracking-wider flex items-center gap-2">
              <Activity size={18} className="text-orange" />
              {t("recent_attendance") || "Recent Attendance"}
            </h3>
            <div className="w-12 h-1 bg-orange rounded-full -mt-2" />

            {member?.attendance && member.attendance.length > 0 ? (
              <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar">
                {member.attendance.slice(0, 5).map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-3 p-3 bg-white/5 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 dark:text-white">
                        {new Date(att.check_in).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        {formattedDate(att.check_in)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 font-bold">
                {t("no_attendance") || "No attendance records yet."}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Subscription History */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-black text-gray-900 dark:text-white  uppercase tracking-wider flex items-center gap-2">
              <Dumbbell size={18} className="text-orange" />
              {t("subscription_history") || "Subscription History"}
            </h3>
            <div className="w-12 h-1 bg-orange rounded-full -mt-2" />

            {member?.subscriptions && member.subscriptions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/5">
                      <th className="pb-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                        {t("plan") || "Plan"}
                      </th>
                      <th className="pb-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                        {t("start_date")}
                      </th>
                      <th className="pb-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                        {t("end_date")}
                      </th>
                      <th className="pb-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                        {t("paid") || "Paid"}
                      </th>
                      <th className="pb-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                        {t("status")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {member.subscriptions.map((sub) => (
                      <tr
                        key={sub.id}
                        className="border-b border-gray-50 dark:border-white/[0.02] last:border-0"
                      >
                        <td className="py-4 text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight ">
                          {sub.plan_name || "N/A"}
                        </td>
                        <td className="py-4 text-xs text-gray-500 font-bold uppercase">
                          {formattedDate(sub.start_date)}
                        </td>
                        <td className="py-4 text-xs text-gray-500 font-bold uppercase">
                          {formattedDate(sub.end_date)}
                        </td>
                        <td className="py-4 text-xs font-bold text-gray-900 dark:text-white">
                          {Number(sub.paid || 0).toLocaleString()}
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-black border ${
                              sub.status === "active"
                                ? "bg-blue/10 border-blue/20 text-blue"
                                : sub.status === "freezed"
                                  ? "bg-orange/10 border-orange/20 text-orange"
                                  : "bg-gray-500/10 border-gray-500/20 text-gray-500"
                            }`}
                          >
                            {sub.status === "freezed"
                              ? t("frozen")
                              : sub.status === "active"
                                ? t("active")
                                : t("inactive")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-gray-500 font-bold">
                {t("no_subscriptions") || "No subscriptions recorded."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
