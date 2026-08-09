import React, { useContext, useRef } from "react";
import { Printer, User } from "lucide-react";
import { LanguageContext } from "../../shared/context/LanguageContext";
import formattedDate from "../../shared/utils/formattedDate";
import AppModal from "../../shared/components/AppModal";

const SalariesDetailsModal = ({
  isOpen,
  onClose,
  employee,
  selectedMonth,
  selectedYear,
  bonusLoading = false,
  withdrawalsLoading = false,
}) => {
  const { t } = useContext(LanguageContext);
  const printAreaRef = useRef(null);

  if (!isOpen || !employee) return null;

  // Use pre-fetched data from parent (passed via _withdrawals and _bonuses)
  const empWithdrawals = employee._withdrawals || [];
  const empBonusesDeductions = (employee._bonuses || []).map((b) => ({
    ...b,
    type: b.type === 0 ? "bonus" : "deduction",
  }));

  const userName =
    employee.user?.full_name ||
    employee.user?.name ||
    employee.name ||
    `EMP-${employee.id}`;

  const paymentRecord = employee.paymentRecord;
  const isPaid = paymentRecord && paymentRecord.payment_status === "تم القبض";

  const totalSalary = isPaid
    ? Number(paymentRecord.basic_salary || 0)
    : Number(employee.total_salary || 0);

  const totalBonuses = isPaid
    ? Number(paymentRecord.total_rewards || 0)
    : empBonusesDeductions
        .filter((b) => b.type === "bonus")
        .reduce((acc, b) => acc + Number(b.value), 0);

  const totalDeductions = isPaid
    ? Number(paymentRecord.total_discounts || 0)
    : empBonusesDeductions
        .filter((b) => b.type === "deduction")
        .reduce((acc, b) => acc + Number(b.value), 0);

  const totalWithdrawals = isPaid
    ? Number(paymentRecord.withdrawals?.total || 0)
    : empWithdrawals.reduce((acc, w) => acc + Number(w.value), 0);

  const netSalary = isPaid
    ? Number(paymentRecord.net_salary || 0)
    : (() => {
        const calculated = totalSalary + totalBonuses - totalDeductions - totalWithdrawals - Number(employee.pending_debt || 0);
        return calculated < 0 ? 0 : calculated;
      })();

  const handlePrint = () => {
    const printContent = printAreaRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    // Create a style block for the print layout matching the dark dashboard view
    const printStyles = `
      <style>
        body {
          background-color: #0b1329 !important;
          color: #ffffff !important;
          font-family: system-ui, -apple-system, sans-serif;
          padding: 20px;
          direction: rtl;
        }
        .print-container {
          max-width: 800px;
          margin: 0 auto;
          background: #111b33;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        h2, h3 {
          text-align: center;
          margin-bottom: 20px;
          color: #ffffff;
        }
        .header-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 24px;
        }
        .info-item {
          font-size: 14px;
        }
        .info-item span {
          color: #38bdf8;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }
        th, td {
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 12px;
          text-align: right;
          font-size: 14px;
        }
        th {
          background-color: rgba(255,255,255,0.02);
          color: #94a3b8;
          font-weight: bold;
        }
        .text-orange {
          color: #f97316 !important;
        }
        .text-red {
          color: #ef4444 !important;
        }
        .text-green {
          color: #22c55e !important;
        }
        .no-data {
          text-align: center;
          color: #94a3b8;
          padding: 16px 0;
        }
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .print-container {
            background: #ffffff !important;
            border: none !important;
            color: #000000 !important;
          }
          h2, h3 {
            color: #000000 !important;
          }
          .header-info-grid {
            background: none !important;
            border: 1px solid #e2e8f0 !important;
            color: #000000 !important;
          }
          .info-item span {
            color: #0284c7 !important;
          }
          th {
            background-color: #f8fafc !important;
            color: #475569 !important;
            border-bottom: 2px solid #cbd5e1 !important;
          }
          td {
            border-bottom: 1px solid #e2e8f0 !important;
            color: #000000 !important;
          }
          .text-orange, .text-red, .text-green {
            color: #000000 !important;
          }
        }
      </style>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>مسيرات الراتب - ${userName}</title>
          ${printStyles}
        </head>
        <body>
          <div class="print-container">
            ${printContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const monthNamesAr = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  const displayMonth = selectedMonth ? monthNamesAr[selectedMonth - 1] : "";

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
      headerContent={
        <div className="flex items-center justify-between w-full pl-8 rtl:pl-0 rtl:pr-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0">
              <User size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              مسيرات الراتب - {userName}
            </h3>
          </div>
          <button
            onClick={handlePrint}
            className="p-3 bg-gray-100 dark:bg-white/[0.05] hover:bg-orange hover:text-black rounded-xl text-gray-600 dark:text-gray-300 transition-all flex items-center justify-center"
            title={t("print") || "طباعة"}
          >
            <Printer size={18} />
          </button>
        </div>
      }
      showCloseFooter
      closeText={t("close")}
    >
      <div
        ref={printAreaRef}
        className="space-y-8 text-right"
        style={{ direction: "rtl" }}
      >
        {/* Salary Sheet Header Info */}
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">
            الشهر : {displayMonth} - السنة : {selectedYear}
          </h3>
        </div>

        {/* Employee Profile Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-5 rounded-2xl">
          <div className="text-sm font-bold text-gray-600 dark:text-gray-400">
            الاسم :{" "}
            <span className="text-blue dark:text-sky-400 font-black">
              {userName}
            </span>
          </div>
          <div className="text-sm font-bold text-gray-600 dark:text-gray-400">
            الرقم الوظيفي :{" "}
            <span className="text-blue dark:text-sky-400 font-black">
              {employee.job_number || "—"}
            </span>
          </div>
          <div className="text-sm font-bold text-gray-600 dark:text-gray-400">
            الجوال :{" "}
            <span className="text-blue dark:text-sky-400 font-black">
              {employee.phone || employee.user?.phone || "—"}
            </span>
          </div>
          <div className="text-sm font-bold text-gray-600 dark:text-gray-400">
            الحالة الاجتماعية :{" "}
            <span className="text-blue dark:text-sky-400 font-black">
              {t(employee.marital_status) || "—"}
            </span>
          </div>
          <div className="text-sm font-bold text-gray-600 dark:text-gray-400 col-span-2">
            رقم الهوية :{" "}
            <span className="text-blue dark:text-sky-400 font-black">
              {employee.national_id || "—"}
            </span>
          </div>
        </div>

        {/* Bonuses and Deductions Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-2">
            المكافآت والخصومات
          </h4>
          <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-white/5">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-100/50 dark:bg-white/[0.02]">
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                    النوع
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                    القيمة
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                    التاريخ
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                    ملاحظة
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {bonusLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-4 text-xs text-gray-400"
                    >
                      جاري التحميل...
                    </td>
                  </tr>
                ) : empBonusesDeductions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-4 text-xs text-blue dark:text-sky-400 font-bold"
                    >
                      لا يوجد
                    </td>
                  </tr>
                ) : (
                  empBonusesDeductions.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01]"
                    >
                      <td className="px-4 py-3 text-xs font-bold">
                        <span
                          className={
                            b.type === "bonus"
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {b.type === "bonus" ? "مكافأة" : "خصم"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-gray-900 dark:text-white">
                        {Number(b.value).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                        {b.date?.slice(0, 10)}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {b.notes || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdrawals Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-2">
            مسحوبات
          </h4>
          <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-white/5">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-100/50 dark:bg-white/[0.02]">
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                    التاريخ
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                    القيمة
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                    ملاحظة
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {withdrawalsLoading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-4 text-xs text-gray-400"
                    >
                      جاري التحميل...
                    </td>
                  </tr>
                ) : empWithdrawals.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-4 text-xs text-blue dark:text-sky-400 font-bold"
                    >
                      لا يوجد
                    </td>
                  </tr>
                ) : (
                  empWithdrawals.map((w) => (
                    <tr
                      key={w.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01]"
                    >
                      <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                        {w.date?.slice(0, 10)}
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-gray-900 dark:text-white">
                        {Number(w.value).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {w.notes || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Salary Summary Totals */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-white/5">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gray-100/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                  الراتب الأساسي
                </th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                  عموله
                </th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                  خصم
                </th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                  الراتب الاجمالي
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-4 text-sm font-bold text-gray-900 dark:text-white">
                  {totalSalary.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-sm font-bold text-gray-900 dark:text-white">
                  {totalBonuses.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-sm font-bold text-gray-900 dark:text-white">
                  {(totalDeductions + totalWithdrawals).toLocaleString()}
                </td>
                <td className="px-4 py-4 text-sm font-bold text-orange">
                  {netSalary.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppModal>
  );
};

export default SalariesDetailsModal;
