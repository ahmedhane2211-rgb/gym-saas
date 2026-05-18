import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, CreditCard, ShieldCheck, Zap } from 'lucide-react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { LanguageContext } from '../../shared/context/LanguageContext';

const TenantModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    if (initialData) {
      reset({
        status: initialData.status || 'active',
        start_date: initialData.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : '',
        end_date: initialData.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : '',
        is_trial: initialData.is_trial ?? false,
        paid: initialData.paid || 0,
        gym_id: initialData.gym_id,
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between flex-shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-widest">
                {t('edit_subscription')}
            </h2>
            <p className="text-orange text-xs font-bold uppercase tracking-widest">{initialData?.gym_name}</p>
            <div className="w-12 h-1 bg-orange rounded-full mt-2" />
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-orange transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-4 space-y-8 overflow-y-auto no-scrollbar flex-grow">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <div className="relative">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">{t('status')}</label>
                    <select 
                        {...register('status')}
                        className="w-full bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl py-4 px-4 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-orange/20 transition-all font-medium appearance-none"
                    >
                        <option value="active">Active</option>
                        <option value="expired">Inactive</option>
                    </select>

                    <div className="absolute top-11 ltr:right-4 rtl:left-4 text-gray-400 pointer-events-none">
                        <Zap size={18} />
                    </div>
                </div>

                {/* Paid Amount */}
                <div className="relative">
                    <Input 
                        label="paid_amount" 
                        type="number"
                        placeholder="0.00" 
                        name="paid" 
                        register={register} 
                        errors={errors} 
                    />
                    <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
                        <CreditCard size={18} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div className="relative">
                    <Input 
                        label="start_date" 
                        type="date"
                        name="start_date" 
                        register={register} 
                        errors={errors} 
                    />
                    <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
                        <Calendar size={18} />
                    </div>
                </div>

                {/* End Date */}
                <div className="relative">
                    <Input 
                        label="end_date" 
                        type="date"
                        name="end_date" 
                        register={register} 
                        errors={errors} 
                    />
                    <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
                        <Calendar size={18} />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                <input 
                    type="checkbox" 
                    id="is_trial"
                    {...register('is_trial')}
                    className="w-5 h-5 rounded border-gray-300 text-orange focus:ring-orange"
                />
                <label htmlFor="is_trial" className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                    {t('is_trial')}
                </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col gap-4 sticky bottom-0 pt-6 bg-white dark:bg-[#121212] z-10 pb-4">
            <Button 
              title={isLoading ? 'Processing...' : t('update')}
              className="w-full bg-orange hover:bg-orange/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-lg dark:shadow-[0_0_30px_rgba(255,95,31,0.2)]"
            />
            <Button 
              onClick={onClose}
              type="button"
              title={t('cancel')}
              className="w-full text-gray-500 dark:text-gray-600 font-black text-[10px] tracking-[0.3em] uppercase hover:text-gray-900 dark:hover:text-white transition-colors"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantModal;
