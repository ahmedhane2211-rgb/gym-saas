import React, { useContext, useState } from "react";
import { Plus, Banknote, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { LanguageContext } from "../../shared/context/LanguageContext";
import DataTable from "../../shared/components/DataTable";
import SearchFilter from "../../shared/components/SearchFilter";
import useFilter from "../../shared/hooks/useFilter";
import Button from "../../shared/components/Button";
import { useGetMonthlyBonusDeductionsQuery, useAddBonusDeductionMutation, useDeleteBonusDeductionMutation } from "../services/EmployeeBonusDeductionSlice";
import EmployeeBonusDeductionModal from "../components/EmployeeBonusDeductionModal";

const BonusesDeductions = () => {
    const { t } = useContext(LanguageContext);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const { data: bonusResponse, isLoading } = useGetMonthlyBonusDeductionsQuery({ month: currentMonth, year: currentYear });
    const [addBonusDeduction, { isLoading: isAdding }] = useAddBonusDeductionMutation();
    const [deleteBonusDeduction] = useDeleteBonusDeductionMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const records = Array.isArray(bonusResponse) ? bonusResponse : (bonusResponse?.data || []);
    const filteredRecords = useFilter(records, searchTerm, ["employee_name", "notes"]);

    const handleSubmit = async (data) => {
        try {
            await addBonusDeduction(data).unwrap();
            toast.success(t("add_success"));
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.data?.message || "Failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t("confirm_delete"))) {
            try {
                await deleteBonusDeduction(id).unwrap();
                toast.success(t("delete_success"));
            } catch (err) {
                toast.error(err.data?.message || "Failed");
            }
        }
    };

    const columns = [
        {
            header: "employee_details",
            render: (row) => (
                <div>
                    <p className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight italic">{row.employee_name}</p>
                </div>
            )
        },
        {
            header: "type",
            render: (row) => (
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${row.type === 'bonus' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {row.type === 'bonus' ? t('bonus') : t('deduction')}
                </span>
            )
        },
        {
            header: "amount",
            render: (row) => <span className="text-gray-900 dark:text-white font-bold text-sm">{Number(row.value).toLocaleString()}</span>
        },
        {
            header: "date",
            render: (row) => <span className="text-gray-600 dark:text-gray-400 text-xs">{row.date?.slice(0, 10)}</span>
        },
        {
            header: "note",
            render: (row) => <span className="text-gray-500 dark:text-gray-400 text-xs truncate max-w-xs">{row.notes || "—"}</span>
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest italic uppercase">{t("bonuses_deductions")}</h1>
                    <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed">
                        {t("manage_bonuses_deductions_desc") || "إدارة المكافآت والخصومات للموظفين."}
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <SearchFilter onSearch={setSearchTerm} placeholder={t("search")} />
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-orange h-14 px-8 shadow-[0_0_30px_rgba(255,95,31,0.1)] !w-auto"
                        title={t("add_new")}
                        icon={<Plus size={18} />}
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredRecords}
                isLoading={isLoading}
                onDelete={handleDelete}
                title={t("bonuses_deductions")}
            />

            <EmployeeBonusDeductionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                isLoading={isAdding}
            />
        </div>
    );
};

export default BonusesDeductions;
