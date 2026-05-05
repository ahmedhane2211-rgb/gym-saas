import React, { useContext, useState } from 'react';
import { useGetFeaturesQuery, useAddFeatureMutation, useUpdateFeatureMutation, useDeleteFeatureMutation } from '../services/FeatureSlice';
import { Sparkles, Plus, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { LanguageContext } from '../../shared/context/LanguageContext';
import DataTable from '../../shared/components/DataTable';
import FeatureModal from '../components/FeatureModal';

const Features = () => {
    const { t } = useContext(LanguageContext);
    const { data: response, isLoading } = useGetFeaturesQuery();
    const features = Array.isArray(response) ? response : (response?.data || []);
    const [addFeature, { isLoading: isAdding }] = useAddFeatureMutation();
    const [updateFeature, { isLoading: isUpdating }] = useUpdateFeatureMutation();
    const [deleteFeature] = useDeleteFeatureMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState(null);

    const columns = [
        {
            header: 'feature_name',
            render: (item) => (
                <div className="flex items-center gap-4 text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight italic">
                    <div className="p-2.5 rounded-xl bg-blue/10 text-blue">
                        <Sparkles size={18} />
                    </div>
                    {item.name}
                </div>
            )
        }
    ];

    const handleSubmit = async (data) => {
        try {
            if (editingFeature) {
                await updateFeature({ id: editingFeature.id, ...data }).unwrap();
                toast.success(t('update_success'));
            } else {
                await addFeature(data).unwrap();
                toast.success(t('add_success'));
            }
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('confirm_delete'))) {
            try {
                await deleteFeature(id).unwrap();
                toast.success(t('delete_success'));
            } catch (err) {
                toast.error(err.data?.message || 'Delete failed');
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest italic uppercase">{t('features') || 'Features'}</h1>
                    <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md">{t('manage_features_desc') || 'Define distinct features that can be added to your subscription plans.'}</p>
                </div>
                <button onClick={() => { setEditingFeature(null); setIsModalOpen(true); }} className="btn-orange flex items-center gap-2 h-14 px-8 shadow-lg font-main">
                    <Plus size={18} />
                    <span>{t('add_new')}</span>
                </button>
            </div>

            <DataTable 
                columns={columns}
                data={features}
                isLoading={isLoading}
                onEdit={(item) => { setEditingFeature(item); setIsModalOpen(true); }}
                onDelete={handleDelete}
            />

            <FeatureModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingFeature}
                isLoading={isAdding || isUpdating}
                title={editingFeature ? 'update_feature' : 'add_feature'}
            />
        </div>
    );
};

export default Features;
