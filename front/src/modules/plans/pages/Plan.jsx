import React, { useContext, useState, cloneElement } from 'react';
import { useGetPlansQuery, useAddPlanMutation, useUpdatePlanMutation, useDeletePlanMutation } from '../services/PlanSlice';
import { useAddFeatureToPlanMutation, useRemoveFeatureFromPlanMutation } from '../services/FeatureSlice';
import { ScrollText, Activity, Plus, Search, Filter, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { LanguageContext } from '../../shared/context/LanguageContext';
import PlanModal from '../components/PlanModal';
import PlanViewModal from '../components/PlanViewModal';
import DataTable from '../../shared/components/DataTable';

const Plan = () => {
    const { t } = useContext(LanguageContext);
    const { data: response, isLoading } = useGetPlansQuery();
    const plans = Array.isArray(response) ? response : (response?.data || []);
    
    const [addPlan, { isLoading: isAdding }] = useAddPlanMutation();
    const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
    const [deletePlan] = useDeletePlanMutation();

    const [addFeatureToPlan] = useAddFeatureToPlanMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [viewingPlan, setViewingPlan] = useState(null);

    const handleSubmit = async (data) => {
        const { features, ...planData } = data;
        try {
            let planId;
            if (editingPlan) {
                await updatePlan({ id: editingPlan.id, ...planData }).unwrap();
                planId = editingPlan.id;
                toast.success(t('update_success'));
            } else {
                const res = await addPlan(planData).unwrap();
                planId = res.id;
                toast.success(t('add_success'));
            }

            // Link Features
            if (features && features.length > 0 && planId) {
                const featurePromises = features.map(f => 
                  addFeatureToPlan({ 
                    planId, 
                    featuresId: f.featuresId, 
                    value: f.value 
                  }).unwrap()
                );
                await Promise.all(featurePromises);
            }

            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('confirm_delete'))) {
            try {
                await deletePlan(id).unwrap();
                toast.success(t('delete_success'));
            } catch (err) {
                toast.error(err.data?.message || 'Delete failed');
            }
        }
    };

    const columns = [
        {
            header: 'plan_name',
            render: (plan) => (
                <div className="flex items-center gap-4 text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight italic">
                    <div className="p-2.5 rounded-xl bg-orange/10 text-orange">
                        <ScrollText size={18} />
                    </div>
                    {plan.name}
                </div>
            )
        },
        {
            header: 'price',
            render: (plan) => (
                <div className="flex items-baseline gap-1 text-gray-900 dark:text-white font-black">
                    <span className="text-lg">{plan.price}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">EGP</span>
                </div>
            )
        },
        {
            header: 'duration',
            render: (plan) => (
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {plan.duration} {t('days')}
                </div>
            )
        },
        {
            header: 'features',
            render: (plan) => (
                <div className="flex flex-wrap gap-2">
                    {plan.features?.map((f, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue/5 text-blue text-[8px] font-black uppercase rounded-lg border border-blue/10">
                            {f.name} ({f.value})
                        </span>
                    ))}
                    {(!plan.features || plan.features.length === 0) && <span className="text-[8px] text-gray-400 uppercase italic">No features</span>}
                </div>
            )
        },
        {
            header: 'status',
            render: (plan) => (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border ${plan.is_active
                    ? 'bg-orange/10 border-orange/20 text-orange'
                    : 'bg-gray-500/10 border-gray-500/20 text-gray-500'
                    }`}>
                    {plan.is_active ? t('active') : t('inactive')}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
             <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest italic uppercase">{t('plans')}</h1>
                    <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md लीडिंग-रिलैكسड">
                        {t('manage_plans_desc')}
                    </p>
                </div>
                <button onClick={() => { setEditingPlan(null); setIsModalOpen(true); }} className="btn-orange flex items-center gap-2 h-14 px-8 shadow-lg font-main">
                    <Plus size={18} />
                    <span>{t('add_new')}</span>
                </button>
            </div>

            <DataTable 
                columns={columns}
                data={plans}
                isLoading={isLoading}
                onEdit={(item) => { setEditingPlan(item); setIsModalOpen(true); }}
                onDelete={handleDelete}
                onView={(item) => { setViewingPlan(item); setIsViewModalOpen(true); }}
            />

            <PlanModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingPlan}
                isLoading={isAdding || isUpdating}
                title={editingPlan ? 'update_plan' : 'add_plan'}
            />

            <PlanViewModal 
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                plan={viewingPlan}
            />
        </div>
    );
};

export default Plan;
