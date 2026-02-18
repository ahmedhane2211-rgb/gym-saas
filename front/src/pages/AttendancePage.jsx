/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import { membersList } from "../assets/assets";
import { Badge } from "../components/ui/Badge";
import { SectionHeader } from "../components/ui/SectionHeader";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const AttendancePage = ({t,pageTitle}) => {
  const { attendance } = useSelector((state) => state.attendance);
  const [scannedMember, setScannedMember] = useState(null);
  const {members} = useSelector((state) => state.members);
  const inputRef = useRef(null);

  useEffect(() => {
  inputRef.current?.focus();
}, []);
  const handleScan = (e) => {
  if (e.key === "Enter") {
    const barcode = e.target.value;
    if (!barcode) return;
    const member = members.find(m => m.barcode === barcode);
    console.log(barcode,member)

    if (member) {
      setScannedMember(member);
    } else {
      setScannedMember(null);
      toast.error(t("attendance.memberNotFound"));
    }

    e.target.value = "";
  }
};


  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <div className="card space-y-4">
          <SectionHeader
            title={pageTitle("attendance")}
            description={t("attendance.description")}
            action={<input
  ref={inputRef}
  type="text"
  onKeyDown={handleScan}
  autoFocus
  className="w-full max-w-xs rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
  placeholder={t("attendance.scanPlaceholder")}
/>
}
          />
          <div className="relative flex h-56 items-center justify-center rounded-3xl border border-dashed border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20">
            <div className="absolute inset-x-8 top-10 h-1 rounded-full bg-emerald-300/60 dark:bg-emerald-400/40 motion-safe:animate-pulse" />
            <div className="text-center">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{t("attendance.readyToScan")}</p>
              <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">{t("attendance.scanSource")}</p>
            </div>
          </div>
          {scannedMember ? (
            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-white/70 dark:bg-slate-800/30 p-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t("attendance.memberInfo")}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-200 dark:bg-emerald-900/30" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{scannedMember.fullName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{scannedMember.barcode}</p>
                </div>
                <Badge tone="emerald">{scannedMember.isActive ? t("members.status.active") : t("members.status.inactive")}</Badge>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-white/70 dark:bg-slate-800/30 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("attendance.memberInfo")} - لا توجد عمليات دخول حالية</p>
            </div>
          )}
        </div>

        <div className="card space-y-4">
          <SectionHeader title={t("attendance.entryRules.title")} description={t("attendance.entryRules.description")} />
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 dark:bg-emerald-500" />
              {t("attendance.entryRules.blockExpired")}
            </p>
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 dark:bg-emerald-500" />
              {t("attendance.entryRules.preventDuplicate")}
            </p>
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 dark:bg-emerald-500" />
              {t("attendance.entryRules.autoCheckout")}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-white/70 dark:bg-slate-800/30 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t("attendance.todayLog")}</p>
              {/* <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{todayAttendance.length} عملية</span> */}
            </div>
            <div className="mt-3 space-y-3 max-h-64 overflow-y-auto">
              {/* {todayAttendance.length > 0 ? (
                todayAttendance.map((record) => {
                  const member = membersList.find(m => m.id === record.memberId);
                  return (
                    <div key={record.id} className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>{member?.fullName || 'عضو غير معروف'}</span>
                      <span>{formatTime(record.checkIn)}</span>
                      {record.checkOut === null && (
                        <Badge tone="emerald">موجود</Badge>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">لا توجد عمليات حضور اليوم</p>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AttendancePage;