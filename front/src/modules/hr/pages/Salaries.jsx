import React, { useContext, useState, useEffect } from "react";
import {
  BriefcaseBusiness,
  Plus,
  Banknote,
  Eye,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { LanguageContext } from "../../shared/context/LanguageContext";
import DataTable from "../../shared/components/DataTable";
import SearchFilter from "../../shared/components/SearchFilter";
import useFilter from "../../shared/hooks/useFilter";
import Button from "../../shared/components/Button";
import { useGetProfileQuery } from "../../auth/services/AuthSlice";
import {
  usePaySalaryMutation,
  useGetMonthlyPaymentsQuery,
} from "../services/SalaryPaymentSlice";
import SalariesDetailsModal from "../components/SalariesDetailsModal";
import SectionTitle from "../../shared/components/SectionTitle";
import formatNum from "../../shared/utils/formatNum";

const Salaries = () => {
  const { t } = useContext(LanguageContext);
  const { data: profileResponse } = useGetProfileQuery();
  const userProfile = profileResponse?.data?.user || profileResponse?.data;

  // User creation date
  const createdDate = userProfile?.user?.created_at
    ? new Date(userProfile.user.created_at)
    : userProfile?.created_at
    ? new Date(userProfile.created_at)
    : new Date();
  const startYear = createdDate.getFullYear() || new Date().getFullYear();
  const startMonth = createdDate.getMonth() + 1 || 1;

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  useEffect(() => {
    if (selectedYear === startYear && selectedMonth < startMonth) {
      setSelectedMonth(startMonth);
    }
  }, [selectedYear, startYear, startMonth, selectedMonth]);

  const years = [];
  for (let y = startYear; y <= currentYear; y++) {
    years.push(y);
  }

  const months = Array.from({ length: 12 }, (_, i) => i + 1).filter((m) => {
    if (selectedYear === startYear) {
      return m >= startMonth;
    }
    return true;
  });

  const { data: monthlyResponse, isLoading } = useGetMonthlyPaymentsQuery({
    month: selectedMonth,
    year: selectedYear,
  });

  const [paySalary] = usePaySalaryMutation();

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const monthlyData = Array.isArray(monthlyResponse)
    ? monthlyResponse
    : monthlyResponse?.data || [];

  const filteredData = useFilter(
    monthlyData.map((row) => ({ ...row, _searchName: row.employees?.name || "", _searchJob: row.employees?.job_number || "" })),
    searchTerm,
    ["_searchName", "_searchJob"]
  );

  const handlePaySalary = async (row) => {
    const empName = row.employees?.name || "";
    if (window.confirm(`هل تريد دفع راتب ${empName} للشهر الحالي؟`)) {
      try {
        await paySalary({
          employee_id: row.employees?.id,
          month: selectedMonth,
          year: selectedYear,
        }).unwrap();
        toast.success(t("payment_success") || "تم دفع الراتب بنجاح");
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
          <p className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight">
            {row.employees?.name}
          </p>
          <p className="text-gray-500 dark:text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            {row.employees?.job_number || `EMP-${row.employees?.id}`}
          </p>
        </div>
      ),
    },
    {
      header: "basic_salary",
      render: (row) => (
        <span className="text-gray-900 dark:text-white text-xs font-bold">
          {formatNum(Number(row.basic_salary || 0))}
        </span>
      ),
    },
    {
      header: "net_salary",
      render: (row) => (
        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-black">
          <Banknote size={14} className="text-green-500" />
          {formatNum(Number(row.net_salary || 0))}
        </div>
      ),
    },
    {
      header: "status",
      render: (row) => {
        const paid = row.payment_status === "تم القبض";
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${paid ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}
          >
            {paid ? t("paid") : t("pending_payment")}
          </span>
        );
      },
    },
    {
      header: "actions",
      render: (row) => {
        const paid = row.payment_status === "تم القبض";
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedEmployee({
                  ...row.employees,
                  paymentRecord: paid ? row : null,
                  _withdrawals: row.withdrawals?.data || [],
                  _bonuses: row.rewards_discount_wastes?.rewards_discount || [],
                });
                setIsDetailsModalOpen(true);
              }}
              className="p-2 text-gray-400 hover:text-blue transition-colors"
              title={t("view_details")}
            >
              <Eye size={16} />
            </button>
            {!paid && (
              <button
                onClick={() => handlePaySalary(row)}
                className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                title={t("pay_salary")}
              >
                <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <SectionTitle
          title="salaries"
          description="manage_salaries_desc"
          t={t}
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <SearchFilter
            onSearch={setSearchTerm}
            placeholder={t("search_employees")}
          />
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="h-14 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider outline-none focus:border-orange transition-colors w-full md:w-32"
            >
              {years.map((y) => (
                <option
                  key={y}
                  value={y}
                  className="dark:bg-dark text-gray-900 dark:text-white"
                >
                  {y}
                </option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="h-14 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider outline-none focus:border-orange transition-colors w-full md:w-32"
            >
              {months.map((m) => (
                <option
                  key={m}
                  value={m}
                  className="dark:bg-dark text-gray-900 dark:text-white"
                >
                  {m < 10 ? `0${m}` : m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        actions={false}
        title={t("salaries")}
      />
      {/* 
            <EmployeeBonusDeductionModal
                isOpen={isBonusModalOpen}
                onClose={() => setIsBonusModalOpen(false)}
                onSubmit={handleAddBonusDeduction}
                isLoading={isAddingBonus}
            /> */}

      <SalariesDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
    </div>
  );
};

export default Salaries;
