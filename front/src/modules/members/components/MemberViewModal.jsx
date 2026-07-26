import React, { useContext } from "react";
import {
  X,
  User,
  QrCode,
  CreditCard,
  Calendar,
  Activity,
  Shield,
  BadgeCheck,
  Clock,
  Sparkles,
  Snowflake,
} from "lucide-react";
import { LanguageContext } from "../../shared/context/LanguageContext";
import formattedDate from "../../shared/utils/formattedDate";
import DetailItem from "../../shared/components/DetailItem";
import { QRCodeCanvas } from "qrcode.react";
import toast from "react-hot-toast";
import { useUseFeatureMutation } from "../../plans/services/FeatureSlice";
import { useNavigate } from "react-router-dom";

const MemberViewModal = ({ isOpen, onClose, member }) => {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [useFeature, { isLoading: isUsingFeature }] = useUseFeatureMutation();

  const handleUseFeature = async (featureId) => {
    try {
      await useFeature({
        subscription_id: member?.subscription?.id,
        feature_id: featureId,
      }).unwrap();
      toast.success(t("feature_used_success") || "Feature usage recorded!");
    } catch (err) {
      toast.error(err.data?.message || "Failed to record usage");
    }
  };

  if (!isOpen || !member) return null;

  const memberQrValue = `MB-${member?.qr_code}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue to-blue/50 opacity-10" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 ltr:right-6 rtl:left-6 p-2 text-gray-400 hover:text-blue transition-colors z-10 bg-white/10 dark:bg-black/20 rounded-full backdrop-blur-md"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="relative pt-12 px-8 pb-8 space-y-8 max-h-[85vh] overflow-y-auto no-scrollbar">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-3xl border-4 border-white dark:border-gray-dark shadow-xl overflow-hidden bg-gray-100 dark:bg-gray-dark -mt-4">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member?.user?.full_name}`}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white  uppercase tracking-widest">
                {member?.user?.full_name}
              </h3>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black bg-blue/10 text-blue border border-blue/20 mt-2">
                ID: {memberQrValue}
              </span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-white/5 rounded-[32px] border border-dashed border-gray-200 dark:border-white/10 space-y-4">
            <div className="p-4 bg-white rounded-2xl text-center shadow-lg">
              <QRCodeCanvas
                value={memberQrValue}
                size={160}
                level={"H"}
                includeMargin={true}
                imageSettings={{
                  src: "/favicon.ico",
                  x: undefined,
                  y: undefined,
                  height: 24,
                  width: 24,
                  excavate: true,
                }}
              />
              {memberQrValue}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ">
              {t("scan_to_checkin") || "Scan this code to check-in"}
            </p>
          </div>

          {/* Subscription Highlight */}
          <div className="p-6 bg-blue/5 border border-blue/10 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {t("active_subscription") || "Active Subscription"}
                </span>
              </div>
              {member?.subscription ? (
                <div className="flex flex-col gap-1.5 text-right">
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                      {t("expires_at") || "Expires At"}
                    </p>
                    <p className="text-xs font-black text-blue uppercase tracking-tight">
                      {formattedDate(member?.subscription.end_date)}
                    </p>
                  </div>
                  {member?.subscription?.freeze_plan_id && (
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                        {t("remaining_freezes") || "التجميدات المتبقية"}
                      </p>
                      <p className="text-xs font-black text-orange uppercase tracking-tight">
                        {Math.max(
                          0,
                          (member?.subscription?.freeze_max_uses || 0) -
                            (member?.subscription?.pauses_count || 0),
                        )}{" "}
                        / {member?.subscription?.freeze_max_uses || 0}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs font-bold text-gray-400 text-center uppercase tracking-widest py-2 ">
                  {t("no_active_subscription") ||
                    "No active subscription found"}
                </p>
              )}
            </div>

            {/* Subscription Features List */}
            {member?.subscription?.features?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-blue/10 space-y-3">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  {t("manage_features") || "Manage Plan Features"}
                </p>
                <div className="space-y-2">
                  {member?.subscription.features.map((feat) => (
                    <div
                      key={feat.id}
                      className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-2xl border border-blue/5"
                    >
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200">
                          {feat.feature?.name || "Feature"}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-24 h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 rounded-full ${feat.used / feat.total > 0.8 ? "bg-orange" : "bg-blue"}`}
                              style={{
                                width: `${Math.min((feat.used / feat.total) * 100, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-[9px] font-black text-gray-400">
                            {feat.used} / {feat.total}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUseFeature(feat.featuresplan_id)}
                        disabled={isUsingFeature || feat.used >= feat.total}
                        className="px-4 py-2 bg-blue/10 hover:bg-blue text-blue hover:text-black font-black text-[9px] uppercase tracking-widest rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none"
                      >
                        {feat.used >= feat.total
                          ? t("limit_reached") || "Limit Reached"
                          : t("use") || "Use"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Subscription Pause Highlight */}
          {member?.subscription_pause?.status === "active" && (
            <div className="p-6 bg-orange/5 border border-orange/10 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Snowflake size={16} className="text-orange" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {t("paused_subscription") || "الاشتراك المجمد"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-black bg-orange/10 text-orange border border-orange/20">
                    {t("frozen") || "مجمد"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <DetailItem
                  icon={<Calendar size={14} className="text-orange" />}
                  label={t("from_date") || "من تاريخ"}
                  value={formattedDate(member?.subscription_pause?.from_date)}
                />
                <DetailItem
                  icon={<Calendar size={14} className="text-orange" />}
                  label={t("to_date") || "إلى تاريخ"}
                  value={formattedDate(member?.subscription_pause?.to_date)}
                />
              </div>
              <div className="flex justify-between items-center pt-2 text-[10px] font-bold text-gray-500">
                <span>
                  {t("freeze_days") || "أيام التجميد"}:{" "}
                  {member?.subscription_pause?.days} {t("days")}
                </span>
                <span>
                  {t("max_uses") || "الحد الأقصى"}:{" "}
                  {member?.subscription_pause?.max_uses}
                </span>
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <DetailItem
                icon={<CreditCard size={16} />}
                label={t("id_number")}
                value={member?.id_number || "N/A"}
              />
              <DetailItem
                icon={<Shield size={16} />}
                label={t("gender")}
                value={t(member?.user?.gender) || "N/A"}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DetailItem
                icon={<Activity size={16} />}
                label={t("status")}
                value={
                  <span
                    className={` ${
                      member?.user?.is_active &&
                      member?.subscription_pause?.status !== "active"
                        ? "text-blue"
                        : member?.user?.is_active &&
                            member?.subscription_pause?.status === "active"
                          ? "text-orange"
                          : "text-gray-500"
                    }`}
                  >
                    {member?.user?.is_active &&
                    member?.subscription_pause?.status === "active"
                      ? t("frozen")
                      : member?.user?.is_active
                        ? t("active")
                        : t("inactive")}
                  </span>
                }
              />
              <DetailItem
                icon={<Calendar size={16} />}
                label={t("created_at")}
                value={formattedDate(member?.created_at)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onClose();
                navigate(`/members/profile/${member.id}`);
              }}
              className="w-full py-5 bg-orange text-black font-black text-[12px] uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-[1.02] transition-all"
            >
              {t("view_profile") || "View Profile"}
            </button>
            <button
              onClick={onClose}
              className="w-full py-5 bg-gray-950 dark:bg-white text-white dark:text-black font-black text-[12px] uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-[1.02] transition-all"
            >
              {t("close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberViewModal;
