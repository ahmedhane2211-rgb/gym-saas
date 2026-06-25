import React, { useContext, useEffect, useState } from "react";
import { User, Phone, Mail, Calendar, Banknote, BadgeInfo, FileText } from "lucide-react";
import { LanguageContext } from "../../shared/context/LanguageContext";
import DetailItem from "../../shared/components/DetailItem";
import formattedDate from "../../shared/utils/formattedDate";
import AppModal from "../../shared/components/AppModal";
import { useGetMonthlyBonusDeductionsQuery } from "../services/EmployeeBonusDeductionSlice";
import { useGetEmployeeWithdrawalsQuery } from "../../financial/services/EmployeeWithdrawalsSlice";

const SalariesDetailsModal = ({ isOpen, onClose, employee, selectedMonth, selectedYear }) => {
    const { t } = useContext(LanguageContext);
    const [activeTab, setActiveTab] = useState("withdrawals");

    // Default: first day of selected month to last day of selected month
    const getDefaultDates = () => {
        const year = selectedYear || new Date().getFullYear();
        const month = selectedMonth || (new Date().getMonth() + 1);
        const formatNum = (num) => String(num).padStart(2, '0');
        const lastDay = new Date(year, month, 0).getDate();
        
        return {
            start: `${year}-${formatNum(month)}-01`,
            end: `${year}-${formatNum(month)}-${formatNum(lastDay)}`
        };
    };

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        if (isOpen) {
            const defaults = getDefaultDates();
            setStartDate(defaults.start);
            setEndDate(defaults.end);
        }
    }, [isOpen, selectedMonth, selectedYear]);

    const { data: bonusResponse, isLoading: bonusLoading } = useGetMonthlyBonusDeductionsQuery(
        { month: selectedMonth, year: selectedYear },
        { skip: !isOpen || !employee }
    );
    const { data: withdrawalsResponse, isLoading: withdrawalsLoading } = useGetEmployeeWithdrawalsQuery(
        undefined,
        { skip: !isOpen || !employee }
    );

    if (!isOpen || !employee) return null;

    const bonuses = Array.isArray(bonusResponse) ? bonusResponse : (bonusResponse?.data || []);
    const withdrawals = Array.isArray(withdrawalsResponse) ? withdrawalsResponse : (withdrawalsResponse?.data || []);

    const empWithdrawals = withdrawals.filter(w => w.employee_id === employee.id);
    
    // Filter bonuses/deductions of the employee within selected date range
    const empBonusesDeductions = bonuses.filter(b => {
        if (b.employee_id !== employee.id) return false;
        if (!b.date) return true;
        const bDate = b.date.slice(0, 10);
        if (startDate && bDate < startDate) return false;
        if (endDate && bDate > endDate) return false;
        return true;
    });

    const tabs = [
        { id: "withdrawals", label: t("employee_withdrawals") },
        { id: "bonuses_deductions", label: t("bonuses_deductions") }
    ];

    const userName = employee.user?.full_name || employee.user?.name || employee.name || `EMP-${employee.id}`;

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            headerContent={
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-orange/10 text-orange flex items-center justify-center">
                        <User size={28} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-widest">{userName}</h3>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">{t('basic_salary')}: {employee.basic_salary}</p>
                    </div>
                </div>
            }
            showCloseFooter
            closeText={t("close")}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-white/[0.03] p-1 rounded-2xl">
                     {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? "bg-orange text-black shadow-lg" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "bonuses_deductions" && (
                    <div className="flex flex-col md:flex-row items-center gap-3 bg-gray-50 dark:bg-white/[0.01] p-3 rounded-xl">
                        <div className="flex flex-col w-full">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{t("from_date") || "من تاريخ"}</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="h-10 px-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] text-gray-900 dark:text-white text-xs outline-none focus:border-orange transition-colors w-full"
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{t("to_date") || "إلى تاريخ"}</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="h-10 px-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] text-gray-900 dark:text-white text-xs outline-none focus:border-orange transition-colors w-full"
                            />
                        </div>
                    </div>
                )}

                {activeTab === "withdrawals" && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left rtl:text-right border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-100/50 dark:bg-white/[0.02]">
                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">{t("amount")}</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">{t("date")}</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">{t("note")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                                {withdrawalsLoading ? (
                                    <tr><td colSpan={3} className="text-center py-4 text-xs">{t("loading")}</td></tr>
                                ) : empWithdrawals.length === 0 ? (
                                    <tr><td colSpan={3} className="text-center py-4 text-xs text-gray-400">{t("no_data")}</td></tr>
                                ) : (
                                    empWithdrawals.map((w) => (
                                        <tr key={w.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.01]">
                                            <td className="px-4 py-3 text-xs font-bold text-gray-900 dark:text-white">{Number(w.value).toLocaleString()}</td>
                                            <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{w.date?.slice(0, 10)}</td>
                                            <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{w.notes || "—"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === "bonuses_deductions" && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left rtl:text-right border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-100/50 dark:bg-white/[0.02]">
                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">{t("type")}</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">{t("amount")}</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">{t("date")}</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">{t("note")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                                {bonusLoading ? (
                                    <tr><td colSpan={4} className="text-center py-4 text-xs">{t("loading")}</td></tr>
                                ) : empBonusesDeductions.length === 0 ? (
                                    <tr><td colSpan={4} className="text-center py-4 text-xs text-gray-400">{t("no_data")}</td></tr>
                                ) : (
                                    empBonusesDeductions.map((b) => (
                                        <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.01]">
                                            <td className="px-4 py-3 text-xs">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${b.type === 'bonus' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                     {b.type === 'bonus' ? t('bonus') : t('deduction')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs font-bold text-gray-900 dark:text-white">{Number(b.value).toLocaleString()}</td>
                                            <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{b.date?.slice(0, 10)}</td>
                                            <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{b.notes || "—"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppModal>
    );
};

export default SalariesDetailsModal;
