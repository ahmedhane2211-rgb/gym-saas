import React, { useContext, useState } from 'react';
import { UserMinus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { LanguageContext } from '../../shared/context/LanguageContext';
import DataTable from '../../shared/components/DataTable';
import Button from '../../shared/components/Button';
import EmployeeWithdrawalModal from '../components/EmployeeWithdrawalModal';
import { useGetEmployeeWithdrawalsQuery, useAddEmployeeWithdrawalMutation, useDeleteEmployeeWithdrawalMutation } from '../services/EmployeeWithdrawalsSlice';

const EmployeeWithdrawals = () => {
    const { t } = useContext(LanguageContext);
    const { data: response, isLoading } = useGetEmployeeWithdrawalsQuery();
    const records = Array.isArray(response) ? response : (response?.data || []);
    const [addEmployeeWithdrawal, { isLoading: isAdding }] = useAddEmployeeWithdrawalMutation();
    const [deleteEmployeeWithdrawal] = useDeleteEmployeeWithdrawalMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (data) => {
        try {
            await addEmployeeWithdrawal(data).unwrap();
            toast.success(t('add_success'));
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.data?.message || 'Failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('confirm_delete'))) {
            try {
                await deleteEmployeeWithdrawal(id).unwrap();
                toast.success(t('delete_success'));
            } catch (err) {
                toast.error(err.data?.message || 'Delete failed');
            }
        }
    };

    const columns = [
        {
            header: 'employees',
            render: (row) => (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0">
                        <UserMinus size={20} />
                    </div>
                    <div>
                        <p className="text-gray-900 dark:text-white font-black text-sm">{row.employee_name}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{t('basic_salary')}: {Number(row.basic_salary).toLocaleString()}</p>
                    </div>
                </div>
            ),
        },
        {
            header: 'amount',
            render: (row) => <span className="text-gray-900 dark:text-white font-bold text-sm">{Number(row.value).toLocaleString()}</span>,
        },
        {
            header: 'date',
            render: (row) => <span className="text-gray-600 dark:text-gray-400 text-xs">{row.date?.slice(0, 10)}</span>,
        },
        {
            header: 'note',
            render: (row) => <span className="text-gray-500 dark:text-gray-400 text-xs truncate max-w-xs">{row.notes || '—'}</span>,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white italic uppercase tracking-widest flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-orange/10 text-orange">
                            <UserMinus size={28} />
                        </div>
                        {t('employee_withdrawals')}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('manage_employee_withdrawals')}</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-orange h-14 px-8 shadow-lg !w-auto"
                    title={t('add_new')}
                    icon={<Plus size={18} />}
                />
            </div>

            <DataTable
                columns={columns}
                data={records}
                isLoading={isLoading}
                onDelete={handleDelete}
                title={t('employee_withdrawals')}
            />

            <EmployeeWithdrawalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                isLoading={isAdding}
            />
        </div>
    );
};

export default EmployeeWithdrawals;
