import React, { useContext, useState } from 'react';
import { ArrowDownCircle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { LanguageContext } from '../../shared/context/LanguageContext';
import DataTable from '../../shared/components/DataTable';
import Button from '../../shared/components/Button';
import MoneyModal from '../components/MoneyModal';
import { useGetOwnerWithdrawalsQuery, useAddOwnerWithdrawalMutation, useDeleteOwnerWithdrawalMutation } from '../services/OwnerWithdrawalsSlice';

const OwnerWithdrawals = () => {
    const { t } = useContext(LanguageContext);
    const { data: response, isLoading } = useGetOwnerWithdrawalsQuery();
    const records = Array.isArray(response) ? response : (response?.data || []);
    const [addOwnerWithdrawal, { isLoading: isAdding }] = useAddOwnerWithdrawalMutation();
    const [deleteOwnerWithdrawal] = useDeleteOwnerWithdrawalMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (data) => {
        try {
            await addOwnerWithdrawal(data).unwrap();
            toast.success(t('add_success'));
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.data?.message || 'Failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('confirm_delete'))) {
            try {
                await deleteOwnerWithdrawal(id).unwrap();
                toast.success(t('delete_success'));
            } catch (err) {
                toast.error(err.data?.message || 'Delete failed');
            }
        }
    };

    const columns = [
        {
            header: 'amount',
            render: (row) => (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                        <ArrowDownCircle size={20} />
                    </div>
                    <span className="text-gray-900 dark:text-white font-black text-sm">{Number(row.value).toLocaleString()}</span>
                </div>
            ),
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
                        <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
                            <ArrowDownCircle size={28} />
                        </div>
                        {t('owner_withdrawals')}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('manage_owner_withdrawals')}</p>
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
                title={t('owner_withdrawals')}
            />

            <MoneyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                isLoading={isAdding}
                title="add_owner_withdrawal"
            />
        </div>
    );
};

export default OwnerWithdrawals;
