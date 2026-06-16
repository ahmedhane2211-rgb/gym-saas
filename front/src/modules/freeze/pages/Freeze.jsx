import React, { useContext, useState, cloneElement } from 'react';
import { 
  useGetFreezePlansQuery, 
  useAddFreezePlanMutation, 
  useUpdateFreezePlanMutation, 
  useDeleteFreezePlanMutation 
} from '../services/FreezeSlice';
import { 
  Award, 
  Activity, 
  Search, 
  Plus, 
  Calendar,
  ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';
import { LanguageContext } from '../../shared/context/LanguageContext';
import FreezeModal from '../components/FreezeModal';
import FreezeViewModal from '../components/FreezeViewModal';
import DataTable from '../../shared/components/DataTable';
import useFilter from '../../shared/hooks/useFilter';

const Freeze = () => {
    const { t } = useContext(LanguageContext);
    const { data: response, error, isLoading } = useGetFreezePlansQuery();
    const freezePlans = Array.isArray(response) ? response : (response?.data || []);
    
    const [addFreezePlan, { isLoading: isAdding }] = useAddFreezePlanMutation();
    const [updateFreezePlan, { isLoading: isUpdating }] = useUpdateFreezePlanMutation();
    const [deleteFreezePlan] = useDeleteFreezePlanMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingFreezePlan, setEditingFreezePlan] = useState(null);
    const [viewingFreezePlan, setViewingFreezePlan] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFreezePlans = useFilter(freezePlans, searchTerm, ['name', 'days', 'max_uses']);

    const handleOpenAdd = () => {
        setEditingFreezePlan(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (plan) => {
        setEditingFreezePlan(plan);
        setIsModalOpen(true);
    };

    const handleOpenView = (plan) => {
        setViewingFreezePlan(plan);
        setIsViewModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingFreezePlan(null);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setViewingFreezePlan(null);
    };

    const handleSubmitFreezePlan = async (data) => {
        try {
            if (editingFreezePlan) {
                await updateFreezePlan({ id: editingFreezePlan.id, ...data }).unwrap();
                toast.success(t('update_success') || 'Freeze plan updated successfully');
            } else {
                await addFreezePlan(data).unwrap();
                toast.success(t('add_success') || 'Freeze plan added successfully');
            }
            handleCloseModal();
        } catch (err) {
            toast.error(err.data?.message || t('operation_failed') || 'Operation failed');
        }
    };

    const handleDeleteFreezePlan = async (id) => {
        if (window.confirm(t('confirm_delete') || 'Are you sure you want to delete this freeze plan?')) {
            try {
                await deleteFreezePlan(id).unwrap();
                toast.success(t('delete_success') || 'Deleted successfully');
            } catch (err) {
                toast.error(err.data?.message || t('delete_failed') || 'Delete failed');
            }
        }
    };

    const columns = [
        {
            header: 'name',
            render: (plan) => (
                <div className="flex items-center gap-4 text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight italic">
                    <div className="p-2.5 rounded-xl bg-orange/10 text-orange">
                        <Award size={18} />
                    </div>
                    {plan.name}
                </div>
            )
        },
        {
            header: 'days',
            render: (plan) => (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                    <Calendar size={14} className="text-blue" />
                    {plan.days} {t('days')}
                </div>
            )
        },
        {
            header: 'max_uses',
            render: (plan) => (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                    <ShieldAlert size={14} className="text-purple" />
                    {plan.max_uses}
                </div>
            )
        }
    ];

    const stats = [
        { label: t('total_freezes') || 'Total Freeze Plans', value: freezePlans?.length || 0, icon: <Award className="text-orange" />, color: 'orange' },
    ];

    if (error) {
        toast.error(t('fetch_error') || 'Failed to fetch freeze plans');
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header & Stats */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest italic uppercase">{t('freezes') || 'Freezes'}</h1>
                    <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed">
                        {t('manage_freezes_desc') || 'Manage subscription freeze packages, days and maximum uses.'}
                    </p>
                </div>

                <div className="flex gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="glass-card p-6 min-w-[200px] flex flex-col justify-between h-32 relative overflow-hidden group font-main font-bold italic">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ltr:translate-x-2 ltr:-translate-y-2 rtl:-translate-x-2 rtl:-translate-y-2">
                                {cloneElement(stat.icon, { size: 64 })}
                            </div>
                            <p className="text-gray-600 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                            <p className="text-4xl font-black text-orange">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative group w-full md:w-96">
                    <Search className="absolute inset-y-0 ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('search') || 'Search...'}
                        className="w-full bg-gray-50 dark:bg-gray-dark/30 border border-gray-200 dark:border-white/5 rounded-xl py-4 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-orange/20 transition-all placeholder:text-gray-400 font-medium font-main"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={handleOpenAdd}
                        className="btn-orange flex items-center gap-2 h-14 px-8 shadow-[0_0_30px_rgba(255,95,31,0.1)] font-main"
                    >
                        <Plus size={18} />
                        <span>{t('add_new')}</span>
                    </button>
                </div>
            </div>

            {/* DataTable */}
            <DataTable 
                columns={columns}
                data={filteredFreezePlans}
                isLoading={isLoading}
                onEdit={handleOpenEdit}
                onDelete={(item) => handleDeleteFreezePlan(item.id)}
                onView={handleOpenView}
            />

            {/* Freeze Modal */}
            <FreezeModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitFreezePlan}
                initialData={editingFreezePlan}
                isLoading={isAdding || isUpdating}
                title={editingFreezePlan ? 'update_freeze' : 'add_freeze'}
            />

            {/* Freeze View Modal */}
            <FreezeViewModal 
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
                freezePlan={viewingFreezePlan}
            />
        </div>
    );
};

export default Freeze;
