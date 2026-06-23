import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, RefreshCw, Calendar, Clock } from 'lucide-react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Select from '../../shared/components/Select';
import { LanguageContext } from '../../shared/context/LanguageContext';
import { useGetPlansQuery } from '../../plans/services/PlanSlice';

const RenewSubscriptionModal = ({ isOpen, onClose, onSubmit, member, isLoading }) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const { t } = useContext(LanguageContext);
  const { data: plansData } = useGetPlansQuery();
  const plans = Array.isArray(plansData) ? plansData : (plansData?.data || []);

  const selectedPlanId = watch('plansId');
  const startDate = watch('startDate');

  useEffect(() => {
    if (selectedPlanId && startDate) {
      const plan = plans.find(p => String(p.id) === String(selectedPlanId));
      if (plan && plan.duration) {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + parseInt(plan.duration));
        setValue('endDate', end.toISOString().split('T')[0]);
      }
    }
  }, [selectedPlanId, startDate, plans, setValue]);

  useEffect(() => {
    if (isOpen) {
      reset({
        memberId: member?.id,
        startDate: new Date().toISOString().split('T')[0],
        plansId: member?.subscription?.plans_id ? String(member.subscription.plans_id) : '',
        endDate: ''
      });
    }
  }, [isOpen, member, reset]);

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue">
              <RefreshCw size={20} />
              <h2 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-widest">
                {t('renew_subscription') || 'Renew Subscription'}
              </h2>
            </div>
            <div className="w-12 h-1 bg-blue rounded-full" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
              {t('member')}: <span className="text-blue">{member?.user?.full_name}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-blue transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-4 space-y-6">
          <Select
            label="select_plan"
            name="plansId"
            options={plans.map(p => ({ value: p.id, label: `${p.name} (${p.duration} ${t('days')})` }))}
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Input
                label="start_date"
                type="date"
                name="startDate"
                register={register}
                errors={errors}
                validation={{ required: 'Required' }}
              />
              <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
                <Calendar size={18} />
              </div>
            </div>
            <div className="relative">
              <Input
                label="end_date"
                type="date"
                name="endDate"
                register={register}
                errors={errors}
                validation={{ required: 'Required' }}
              />
              <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
                <Clock size={18} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <Button
              title={isLoading ? (t('saving') || 'Saving...') : (t('renew_subscription') || 'Renew Now')}
              className="w-full bg-blue hover:bg-blue/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-lg"
            />
            <Button
              onClick={onClose}
              title={t('cancel')}
              className="w-full text-gray-500 font-black text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenewSubscriptionModal;
