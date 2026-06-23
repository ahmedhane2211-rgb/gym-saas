import React, { cloneElement, useContext, useState } from "react";
import { BriefcaseBusiness, Plus, Activity, Banknote, User } from "lucide-react";
import toast from "react-hot-toast";
import { LanguageContext } from "../../shared/context/LanguageContext";
import DataTable from "../../shared/components/DataTable";
import SearchFilter from "../../shared/components/SearchFilter";
import useFilter from "../../shared/hooks/useFilter";
import formattedDate from "../../shared/utils/formattedDate";
import EmployeeModal from "../components/EmployeeModal";
import EmployeeViewModal from "../components/EmployeeViewModal";
import Button from "../../shared/components/Button";
import {
    useAddEmployeeMutation,
    useDeleteEmployeeMutation,
    useGetEmployeesQuery,
    useUpdateEmployeeMutation
} from "../services/EmployeeSlice";

const Employee = () => {
    const { t } = useContext(LanguageContext);
    const { data: response, isLoading } = useGetEmployeesQuery();
    const employees = Array.isArray(response) ? response : (response?.data || response?.employees || []);
    const [addEmployee, { isLoading: isAdding }] = useAddEmployeeMutation();
    const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
    const [deleteEmployee] = useDeleteEmployeeMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [viewingEmployee, setViewingEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeStatus, setActiveStatus] = useState("active");

    const statusEmployees = employees.filter((employee) => activeStatus === "active" ? employee.active : !employee.active);
    const filteredEmployees = useFilter(statusEmployees, searchTerm, ["user.full_name", "job_number", "email", "phone", "national_id"]);

    const handleSubmit = async (data) => {
        const body = {
            ...data,
            name: data.name || data.full_name || data.email || `EMP-${Date.now()}`
        };
        try {
            if (editingEmployee) {
                await updateEmployee({ id: editingEmployee.id, body }).unwrap();
                toast.success(t("update_success"));
            } else {
                await addEmployee(body).unwrap();
                toast.success(t("add_success"));
            }
            setIsModalOpen(false);
            setEditingEmployee(null);
        } catch (err) {
            toast.error(err.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t("confirm_delete"))) {
            try {
                await deleteEmployee(id).unwrap();
                toast.success(t("delete_success"));
            } catch (err) {
                toast.error(err.data?.message || "Delete failed");
            }
        }
    };

    const columns = [
        {
            header: "employee_details",
            render: (employee) => {
                const name = employee.user?.full_name || employee.user?.name || employee.name || `EMP-${employee.id}`;
                return (
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight italic">{name}</p>
                            <p className="text-gray-500 dark:text-gray-600 text-[10px] font-bold uppercase tracking-widest">{employee.job_number || `EMP-${employee.id}`}</p>
                        </div>
                    </div>
                );
            }
        },
        {
            header: "phone",
            render: (employee) => (
                <span className="text-gray-900 dark:text-white text-xs font-bold">{employee.phone || employee.user?.phone || "N/A"}</span>
            )
        },
        {
            header: "date_of_joining",
            render: (employee) => (
                <span className="text-gray-600 dark:text-gray-400 text-xs font-bold">{formattedDate(employee.date_of_joining)}</span>
            )
        },
        {
            header: "total_salary",
            render: (employee) => (
                <div className="flex items-center gap-2 text-gray-900 dark:text-white text-[11px] font-black uppercase tracking-widest">
                    <Banknote size={14} className="text-green-500" />
                    {employee.total_salary || 0}
                </div>
            )
        }
    ];

    const exportColumns = [
        { header: "name", key: "name", render: (employee) => employee.name || employee.user?.full_name || employee.user?.name || "" },
        { header: "job_number", key: "job_number" },
        { header: "email", key: "email", render: (employee) => employee.email || employee.user?.email || "" },
        { header: "phone", key: "phone", render: (employee) => employee.phone || employee.user?.phone || "" },
        { header: "gender", key: "gender" },
        { header: "national_id", key: "national_id" },
        { header: "nationality", key: "nationality" },
        { header: "marital_status", key: "marital_status" },
        { header: "qualification", key: "qualification" },
        { header: "address", key: "address" },
        { header: "date_of_joining", key: "date_of_joining", render: (employee) => formattedDate(employee.date_of_joining) },
        { header: "basic_salary", key: "basic_salary" },
        { header: "additional_salary", key: "additional_salary" },
        { header: "allowances", key: "allowances" },
        { header: "health_insurance", key: "health_insurance" },
        { header: "social_insurance", key: "social_insurance" },
        { header: "tax", key: "tax" },
        { header: "pending_debt", key: "pending_debt" },
        { header: "total_salary", key: "total_salary" },
        { header: "description", key: "description" },
        { header: "created_at", key: "created_at", render: (employee) => formattedDate(employee.created_at) },
        { header: "user_id", key: "user_id", render: (employee) => employee.user_id || employee.user?.id || "" },
        { header: "id", key: "id" }
    ];

    const stats = [
        { label: t("total_employees"), value: employees.length || 0, icon: <BriefcaseBusiness className="text-orange" />, color: "orange" },
        { label: t("active_employees"), value: employees.filter((employee) => employee.user?.is_active).length || 0, icon: <Activity className="text-blue" />, color: "blue" }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest italic uppercase">{t("employees")}</h1>
                    <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed">
                        {t("manage_employees_desc")}
                    </p>
                </div>

                <div className="flex gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="glass-card p-6 min-w-[200px] flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ltr:translate-x-2 ltr:-translate-y-2 rtl:-translate-x-2 rtl:-translate-y-2">
                                {cloneElement(stat.icon, { size: 64 })}
                            </div>
                            <p className="text-gray-600 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                            <p className={`text-4xl font-black ${stat.color === "orange" ? "text-orange" : "text-blue"}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-white/[0.03] p-1 rounded-2xl max-w-md">
                <button
                    type="button"
                    onClick={() => setActiveStatus("active")}
                    className={`py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeStatus === "active" ? "bg-orange text-black shadow-lg" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
                >
                    {t("active")}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveStatus("inactive")}
                    className={`py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeStatus === "inactive" ? "bg-orange text-black shadow-lg" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
                >
                    {t("inactive")}
                </button>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <SearchFilter onSearch={setSearchTerm} placeholder={t("search_employees")} />
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button
                        onClick={() => { setEditingEmployee(null); setIsModalOpen(true); }}
                        className="btn-orange h-14 px-8 shadow-[0_0_30px_rgba(255,95,31,0.1)] !w-auto"
                        title={t("add_new")}
                        icon={<Plus size={18} />}
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredEmployees}
                isLoading={isLoading}
                onEdit={(employee) => { setEditingEmployee(employee); setIsModalOpen(true); }}
                onDelete={handleDelete}
                onView={(employee) => { setViewingEmployee(employee); setIsViewModalOpen(true); }}
                title={t("employees")}
                exportColumns={exportColumns}
            />

            <EmployeeModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingEmployee(null); }}
                onSubmit={handleSubmit}
                initialData={editingEmployee}
                isLoading={isAdding || isUpdating}
                title={editingEmployee ? "update_employee" : "add_employee"}
            />

            <EmployeeViewModal
                isOpen={isViewModalOpen}
                onClose={() => { setIsViewModalOpen(false); setViewingEmployee(null); }}
                employee={viewingEmployee}
            />
        </div>
    );
};

export default Employee;
