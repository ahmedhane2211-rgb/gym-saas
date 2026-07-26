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
import { useGetEmployeesQuery } from "../services/EmployeeSlice";
import { useGetProfileQuery } from "../../auth/services/AuthSlice";
import {
  useGetMonthlyBonusDeductionsQuery,
  useAddBonusDeductionMutation,
  useDeleteBonusDeductionMutation,
} from "../services/EmployeeBonusDeductionSlice";
import { useGetEmployeeWithdrawalsQuery } from "../../financial/services/EmployeeWithdrawalsSlice";
import {
  usePaySalaryMutation,
  useGetAllPaymentsQuery,
} from "../services/SalaryPaymentSlice";
import EmployeeBonusDeductionModal from "../components/EmployeeBonusDeductionModal";
import SalariesDetailsModal from "../components/SalariesDetailsModal";
import SectionTitle from "../../shared/components/SectionTitle";

const Salaries = () => {
  const { t } = useContext(LanguageContext);
  const { data: profileResponse } = useGetProfileQuery();
  const userProfile = profileResponse?.data;

  // User creation date
  const createdDate = userProfile?.created_at
    ? new Date(userProfile.created_at)
    : new Date();
  const startYear = createdDate.getFullYear() || new Date().getFullYear();
  const startMonth = createdDate.getMonth() + 1 || 1;

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // If selectedYear matches startYear, ensure selectedMonth doesn't fall below startMonth
  useEffect(() => {
    if (selectedYear === startYear && selectedMonth < startMonth) {
      setSelectedMonth(startMonth);
    }
  }, [selectedYear, startYear, startMonth, selectedMonth]);

  // List of years from user creation year to current year
  const years = [];
  for (let y = startYear; y <= currentYear; y++) {
    years.push(y);
  }

  // List of months (1-12), filtered to start from startMonth if selectedYear is startYear
  const months = Array.from({ length: 12 }, (_, i) => i + 1).filter((m) => {
    if (selectedYear === startYear) {
      return m >= startMonth;
    }
    return true;
  });

  const { data: empResponse, isLoading: empLoading } = useGetEmployeesQuery();
  const { data: bonusResponse, isLoading: bonusLoading } =
    useGetMonthlyBonusDeductionsQuery({
      month: selectedMonth,
      year: selectedYear,
    });
  const { data: withdrawalsResponse, isLoading: withdrawalsLoading } =
    useGetEmployeeWithdrawalsQuery();
  const { data: paymentsResponse, isLoading: paymentsLoading } =
    useGetAllPaymentsQuery();

  const [addBonusDeduction, { isLoading: isAddingBonus }] =
    useAddBonusDeductionMutation();
  const [paySalary, { isLoading: isPaying }] = usePaySalaryMutation();

  // const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const employees = Array.isArray(empResponse)
    ? empResponse
    : empResponse?.data || [];
  const bonuses = Array.isArray(bonusResponse)
    ? bonusResponse
    : bonusResponse?.data || [];
  const withdrawals = Array.isArray(withdrawalsResponse)
    ? withdrawalsResponse
    : withdrawalsResponse?.data || [];
  const payments = Array.isArray(paymentsResponse)
    ? paymentsResponse
    : paymentsResponse?.data || [];

  const filteredEmployees = useFilter(employees, searchTerm, [
    "name",
    "job_number",
  ]);

  const handleAddBonusDeduction = async (data) => {
    try {
      await addBonusDeduction(data).unwrap();
      toast.success(t("add_success"));
      setIsBonusModalOpen(false);
    } catch (err) {
      toast.error(err.data?.message || "Failed");
    }
  };

  const handlePaySalary = async (employee) => {
    if (
      window.confirm(
        t("confirm_pay_salary", { name: employee.name }) ||
          `هل تريد دفع راتب ${employee.name} للشهر الحالي؟`,
      )
    ) {
      try {
        await paySalary({
          employee_id: employee.id,
          month: selectedMonth,
          year: selectedYear,
        }).unwrap();
        toast.success(t("payment_success") || "تم دفع الراتب بنجاح");
      } catch (err) {
        toast.error(err.data?.message || "Failed");
      }
    }
  };

  const calculateNetSalary = (employee) => {
    const empBonuses = bonuses.filter((b) => b.employee_id === employee.id);
    const empWithdrawals = withdrawals.filter(
      (w) => w.employee_id === employee.id,
    );

    const totalBonuses = empBonuses
      .filter((b) => b.type === "bonus")
      .reduce((acc, b) => acc + Number(b.value), 0);
    const totalDeductions = empBonuses
      .filter((b) => b.type === "deduction")
      .reduce((acc, b) => acc + Number(b.value), 0);
    const totalWithdrawals = empWithdrawals.reduce(
      (acc, w) => acc + Number(w.value),
      0,
    );

    return (
      Number(employee.basic_salary) +
      totalBonuses -
      totalDeductions -
      totalWithdrawals
    );
  };

  const isPaidThisMonth = (employeeId) => {
    return payments.some(
      (p) =>
        p.employee_id === employeeId &&
        Number(p.month) === selectedMonth &&
        Number(p.year) === selectedYear,
    );
  };

  const columns = [
    {
      header: "employee_details",
      render: (employee) => (
        <div>
          <p className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight ">
            {employee.name}
          </p>
          <p className="text-gray-500 dark:text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            {employee.job_number || `EMP-${employee.id}`}
          </p>
        </div>
      ),
    },
    {
      header: "basic_salary",
      render: (employee) => (
        <span className="text-gray-900 dark:text-white text-xs font-bold">
          {Number(employee.basic_salary).toLocaleString()}
        </span>
      ),
    },
    {
      header: "net_salary",
      render: (employee) => (
        <div className="flex items-center gap-2 text-gray-900 dark:text-white text-[11px] font-black uppercase tracking-widest">
          <Banknote size={14} className="text-green-500" />
          {calculateNetSalary(employee).toLocaleString()}
        </div>
      ),
    },
    {
      header: "status",
      render: (employee) => {
        const paid = isPaidThisMonth(employee.id);
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
      render: (employee) => {
        const paid = isPaidThisMonth(employee.id);
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedEmployee(employee);
                setIsDetailsModalOpen(true);
              }}
              className="p-2 text-gray-400 hover:text-blue transition-colors"
              title={t("view_details")}
            >
              <Eye size={16} />
            </button>
            {!paid && (
              <button
                onClick={() => handlePaySalary(employee)}
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
        <SectionTitle title="salaries" description="manage_salaries_desc" t={t} />
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
        data={filteredEmployees}
        isLoading={
          empLoading || bonusLoading || withdrawalsLoading || paymentsLoading
        }
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
