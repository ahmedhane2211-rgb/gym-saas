import React, { useContext, useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, Tag, DollarSign, Clock, FileText, Plus, Trash2, Sparkles } from 'lucide-react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import CheckBox from '../../shared/components/CheckBox';
import { LanguageContext } from '../../shared/context/LanguageContext';
import { useGetFeaturesQuery } from '../services/FeatureSlice';
import Select from '../../shared/components/Select';
import { useGetFreezePlansQuery } from '../../freeze/services/FreezeSlice';

const PlanModal = ({ isOpen, onClose, onSubmit, initialData, isLoading, title }) => {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: {
      features: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features"
  });

  const { t } = useContext(LanguageContext);
  const { data: featuresData } = useGetFeaturesQuery();
  const availableFeatures = Array.isArray(featuresData) ? featuresData : (featuresData?.data || []);

  const { data: freezePlansResponse } = useGetFreezePlansQuery();
  const freezePlans = Array.isArray(freezePlansResponse) ? freezePlansResponse : (freezePlansResponse?.data || []);

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        price: initialData.price || '',
        duration: initialData.duration || '',
        description: initialData.description || '',
        isActive: initialData.isActive ?? true,
        freeze_plan_id: initialData.freeze_plan_id || initialData.freezePlanId || '',
        features: initialData.features?.map(f => ({
            featuresId: f.featuresId || f.id,
            value: f.value || ''
        })) || []
      });
    } else {
      reset({
        name: '',
        price: '',
        duration: '',
        description: '',
        isActive: true,
        freeze_plan_id: '',
        features: []
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between flex-shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-widest">{t(title)}</h2>
            <div className="w-12 h-1 bg-orange rounded-full" />
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-orange transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-4 space-y-6 overflow-y-auto no-scrollbar flex-grow">
          <div className="space-y-6">
            <div className="relative">
              <Input label="plan_name" placeholder="e.g. Monthly Pro" name="name" register={register} errors={errors} validation={{ required: "Required" }} />
              <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400"><Tag size={18} /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                    <Input label="price" type="number" placeholder="e.g. 50" name="price" register={register} errors={errors} validation={{ required: "Required" }} />
                    <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400"><DollarSign size={18} /></div>
                </div>
                <div className="relative">
                    <Input label="duration_days" type="number" placeholder="e.g. 30" name="duration" register={register} errors={errors} validation={{ required: "Required" }} />
                    <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400"><Clock size={18} /></div>
                </div>
            </div>

            <div className="relative">
              <Input label="description" placeholder="Details about the plan..." name="description" register={register} errors={errors} />
              <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400"><FileText size={18} /></div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-light/50 tracking-[0.2em] uppercase px-1">
                {t('select_freeze_plan') || 'اختر باقة التجميد'}
              </label>
              <select
                {...register('freeze_plan_id')}
                className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl py-3.5 px-4 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-all focus:border-orange/50 focus:outline-none"
              >
                <option value="" className="bg-white dark:bg-dark">{t('select_option') || 'اختر...'}</option>
                {freezePlans.map((plan) => (
                  <option key={plan.id} value={plan.id} className="bg-white dark:bg-dark">
                    {plan.name} ({plan.days} {t('days')} - {t('max_uses')}: {plan.max_uses})
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Features Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-blue" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{t('plan_features') || 'Plan Features'}</h4>
                    </div>
                    <button 
                        type="button"
                        onClick={() => append({ featuresId: '', value: '' })}
                        className="text-[10px] font-black uppercase text-blue hover:text-blue/80 flex items-center gap-1 transition-colors"
                    >
                        <Plus size={14} />
                        {t('add_feature') || 'Add Feature'}
                    </button>
                </div>

                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex flex-col md:flex-row items-end gap-3 p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                            <div className="flex-1 w-full space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">{t('feature')}</label>
                                <select 
                                    {...register(`features.${index}.featuresId`, { required: true })}
                                    className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-blue/50 transition-all"
                                >
                                    <option value="">{t('select_feature') || 'Select Feature'}</option>
                                    {availableFeatures.map(f => (
                                        <option key={f.id} value={f.id}>{f.name}</option>
                                    ))}
                                </select>
                                {/* <Select 
                                    label="feature"
                                    name={`features.${index}.featuresId`}
                                    options={availableFeatures.map(f => ({ value: f.id, label: f.name }))}
                                    register={register}
                                    errors={errors}
                                /> */}
                            </div>
                            <div className="w-full md:w-32 lg:w-48 space-y-2">
                                <Input label="value" placeholder="e.g. Unlimited" name={`features.${index}.value`} register={register} errors={errors} validation={{ required: "Required" }} />
                            </div>
                            <button 
                                type="button"
                                onClick={() => remove(index)}
                                className="p-3 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {fields.length === 0 && (
                        <p className="text-center py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic border-2 border-dashed border-gray-100 dark:border-white/5 rounded-2xl">
                            {t('no_features_added') || 'No features added yet'}
                        </p>
                    )}
                </div>
            </div>

            <div className="pt-2">
              <CheckBox label={t('active')} name="isActive" register={register} errors={errors} />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col gap-4 sticky bottom-0 pt-6 bg-white dark:bg-[#121212] z-10">
            <Button 
              title={isLoading ? 'Processing...' : (initialData ? t('update') : t('add'))}
              className="w-full bg-orange hover:bg-orange/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-lg"
            />
            <Button onClick={onClose} title={t('cancel')} className="w-full text-gray-500 font-black text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors pb-4" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanModal;
