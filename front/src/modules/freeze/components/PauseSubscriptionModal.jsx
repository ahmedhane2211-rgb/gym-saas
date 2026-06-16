import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, Snowflake } from 'lucide-react';
import { LanguageContext } from '../../shared/context/LanguageContext';
import Button from '../../shared/components/Button';
import { useGetFreezePlansQuery } from '../services/FreezeSlice';
import Input from '../../shared/components/Input';
import Select from '../../shared/components/Select';

const PauseSubscriptionModal = ({ isOpen, onClose, onSubmit, member, isLoading }) => {
  const { register, handleSubmit, reset,watch,setValue, formState: { errors } } = useForm();
  const { t } = useContext(LanguageContext);
  const { data: freezePlansResponse } = useGetFreezePlansQuery();
  const freezePlans = Array.isArray(freezePlansResponse) ? freezePlansResponse : (freezePlansResponse?.data || []);

  useEffect(() => {
    if (isOpen) {
      reset({
        freeze_id: '',
        from_date: new Date().toISOString().split('T')[0],
        to_date: ''
      });
    }
  }, [isOpen, reset]);

  if (!isOpen || !member) return null;

  const subscriptionId = member?.subscription?.id;

  const handleFormSubmit = (data) => {
    
    onSubmit({
      subscription_id: subscriptionId || member?.subscription?.id,
      freeze_id: data.freeze_id,
      from_date: data.from_date,
      to_date: data.to_date
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-widest">{t('freeze_subscription') || 'تجميد الاشتراك'}</h2>
            <p className="text-xs font-bold text-gray-500 uppercase">{member?.user?.full_name}</p>
            <div className="w-12 h-1 bg-orange rounded-full" />
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-orange transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        {subscriptionId ? (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-8 pt-4 space-y-6">
            {/* Freeze Plan Dropdown */}
            <div className="space-y-2">
              {/* <label className="text-[10px] font-bold text-gray-400 dark:text-gray-light/50 tracking-[0.2em] uppercase">
                {t('select_freeze_plan') || 'اختر باقة التجميد'}
              </label>
              <select
                {...register('freeze_id', { required: 'Freeze plan is required' })}
                className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-all focus:border-orange/50 focus:outline-none"
              >
                <option value="" className="bg-white dark:bg-dark">{t('select_option') || 'اختر...'}</option>
                {freezePlans.map((plan) => (
                  <option key={plan.id} value={plan.id} className="bg-white dark:bg-dark">
                    {plan.name} ({plan.days} {t('days')} - {t('max_uses')}: {plan.max_uses})
                  </option>
                ))}
              </select> */}
              {/* {errors.freeze_id && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.freeze_id.message}</p>} */}
              <Select
                register={register}
                name="freeze_id"
                errors={errors}
                placeholder={t('select_freeze_plan') || 'اختر باقة التجميد'}
                label={t('select_freeze_plan')}
                options={freezePlans.map((plan) => ({ label: plan.name, value: plan.id }))}
                watch={watch}
                setValue={setValue}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                {/* <label className="text-[10px] font-bold text-gray-400 dark:text-gray-light/50 tracking-[0.2em] uppercase">
                  {t('from_date') || 'من تاريخ'}
                </label>
                <input 
                  type="date"
                  {...register('from_date', { required: 'Start date is required' })}
                  className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white focus:border-orange/50 focus:outline-none"
                />
                {errors.from_date && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.from_date.message}</p>} */}
              <Input 
                  type="date"
                  register={register}
                  name="from_date"
                  error={errors.from_date}
                  placeholder={t('from_date') || 'من تاريخ'}
                  label={t("from_date")}
                  />
              </div>

              <div className="space-y-2">
                {/* <label className="text-[10px] font-bold text-gray-400 dark:text-gray-light/50 tracking-[0.2em] uppercase">
                  {t('to_date') || 'إلى تاريخ'}
                </label>
                <input 
                  type="date"
                  {...register('to_date', { required: 'End date is required' })}
                  className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white focus:border-orange/50 focus:outline-none"
                /> */}
                <Input 
                  type="date"
                  register={register}
                  name="to_date"
                  error={errors.to_date}
                  placeholder={t('to_date') || 'إلى تاريخ'}
                  label={t("to_date")}
                  />
                {/* {errors.to_date && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.to_date.message}</p>} */}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col gap-4 pt-4">
              <Button 
                title={isLoading ? 'Processing...' : t('submit')}
                className="w-full bg-orange hover:bg-orange/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-lg dark:shadow-[0_0_30px_rgba(255,95,31,0.2)]"
              />
              <Button 
                onClick={onClose}
                title={t('cancel')}
                className="w-full text-gray-500 dark:text-gray-600 font-black text-[10px] tracking-[0.3em] uppercase hover:text-gray-900 dark:hover:text-white transition-colors"
              />
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-6">
            <p className="text-red-500 font-bold">{t('no_active_subscription') || 'لا يوجد اشتراك نشط للعضو'}</p>
            <Button 
              onClick={onClose}
              title={t('close')}
              className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-xl"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PauseSubscriptionModal;
