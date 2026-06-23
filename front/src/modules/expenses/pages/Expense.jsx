import React, { useContext, useRef, useState } from 'react';
import { useGetExpensesQuery, useAddExpenseMutation, useUpdateExpenseMutation, useDeleteExpenseMutation } from '../services/ExpenseSlice';
import { Receipt, Plus, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { LanguageContext } from '../../shared/context/LanguageContext';
import formattedDate from '../../shared/utils/formattedDate';
import ExpenseModal from '../components/ExpenseModal';
import ExpenseViewModal from '../components/ExpenseViewModal';
import DataTable from '../../shared/components/DataTable';
import SearchFilter from '../../shared/components/SearchFilter';
import useFilter from '../../shared/hooks/useFilter';
import Button from '../../shared/components/Button';

const Expense = () => {
    const { t } = useContext(LanguageContext);
    const searchInputRef = useRef(null);
    const { data: response, isLoading } = useGetExpensesQuery();
    const expenses = Array.isArray(response) ? response : (response?.data || []);

    const [addExpense, { isLoading: isAdding }] = useAddExpenseMutation();
    const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
    const [deleteExpense] = useDeleteExpenseMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [viewingExpense, setViewingExpense] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredExpenses = useFilter(expenses, searchTerm, ['name']);

    const handleSubmit = async (data) => {
        try {
            if (editingExpense) {
                await updateExpense({ 
                    id: editingExpense.id, 
                    body: data 
                }).unwrap();
                toast.success(t('update_success'));
            } else {
                await addExpense(data).unwrap();
                toast.success(t('add_success'));
            }
            setIsModalOpen(false);
            setEditingExpense(null);
        } catch (err) {
            toast.error(err.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('confirm_delete'))) {
            try {
                await deleteExpense(id).unwrap();
                toast.success(t('delete_success'));
            } catch (err) {
                toast.error(err.data?.message || 'Delete failed');
            }
        }
    };

    const columns = [
        {
            header: 'expense_name',
            key: 'name',
            render: (expense) => (
                <div className="flex items-center gap-4 text-gray-900 dark:text-white font-black text-sm">
                    <div className="w-12 h-12 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0">
                        <Receipt size={20} />
                    </div>
                    <div>
                        <p className="font-bold">{expense.name}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'note',
            render: (expense) => (
                <span className="text-gray-600 dark:text-gray-400 text-xs truncate max-w-xs">
                    {expense.note || '—'}
                </span>
            )
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white italic uppercase tracking-widest flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-orange/10 text-orange">
                            <Receipt size={28} />
                        </div>
                        {t('expenses')}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('manage_expenses')}</p>
                </div>
            </div>

            {/* Search and Add */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <SearchFilter 
                ref={searchInputRef}
                    searchTerm={searchTerm}
                    onSearch={setSearchTerm}
                    placeholder={t('search_expense')}
                />            
                    <Button
                        onClick={() => { setEditingExpense(null); setIsModalOpen(true); }}
                        className="btn-orange h-14 px-8 shadow-lg !w-auto"
                        title={t('add_new')}
                        icon={<Plus size={18} />}
                    />
                  </div>

            {/* DataTable */}
            <DataTable
                columns={columns}
                data={filteredExpenses}
                isLoading={isLoading}
                onEdit={(item) => { setEditingExpense(item); setIsModalOpen(true); }}
                onDelete={handleDelete}
                onView={(item) => { setViewingExpense(item); setIsViewModalOpen(true); }}
                title={t('expenses')}
            />

            {/* Modals */}
            <ExpenseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingExpense}
                isLoading={isAdding || isUpdating}
                title={editingExpense ? 'update_expense' : 'add_expense'}
            />

            <ExpenseViewModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                expense={viewingExpense}
            />
        </div>
    );
};

export default Expense;
