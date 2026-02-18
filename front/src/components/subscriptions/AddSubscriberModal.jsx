import React from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Btn from '../ui/Btn';

const AddSubscriberModal = ({ isOpen, onClose, t }) => {
  const { members } = useSelector((state) => state.members);
  const { subscriptions } = useSelector((state) => state.subscriptions);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleClose = () => {
    onClose?.();
    reset();
  };

  const onSubmit = (data) => {
    // TODO: dispatch add subscription action
    console.log(data);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-3xl border border-[var(--color-card-border)] bg-[var(--color-card)] shadow-lg dark:border-[var(--color-dark-card-border)] dark:bg-[var(--color-dark-card)]">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-card-border)] p-6 dark:border-[var(--color-dark-card-border)]">
          <h2 className="text-xl font-bold text-[var(--color-text)] dark:text-[var(--color-dark-text)]">
            {t('actions.addSubscriber') || 'إضافة مشترك جديد'}
          </h2>
          <button type="button" onClick={handleClose} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-card-border)] bg-[var(--color-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)] dark:border-[var(--color-dark-card-border)] dark:bg-[var(--color-dark-card)] dark:hover:bg-[var(--color-dark-bg)] dark:hover:text-[var(--color-dark-text)]" aria-label={t('actions.close') || 'Close'}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* memberId dropdown */}
            <div className="col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[var(--color-text)] dark:text-[var(--color-dark-text)]">
                {t('member') || 'العضو'} *
              </label>
              <select {...register('memberId', { required: true })} className="w-full rounded-lg border border-[var(--color-card-border)] bg-white px-4 py-2 text-[var(--color-text)] dark:bg-[var(--color-dark-card)] dark:text-[var(--color-dark-text)]">
                <option value="">{t('select_member') || 'اختر العضو'}</option>
                {members?.map((m) => (
                  <option key={m.id} value={m.id}>{m.fullName}</option>
                ))}
              </select>
              {errors.memberId && <p className="text-red-500 text-xs mt-1">{t('required') || 'مطلوب'}</p>}
            </div>
            {/* planId dropdown */}
            <div className="col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[var(--color-text)] dark:text-[var(--color-dark-text)]">
                {t('plan.title') || 'الخطة'} *
              </label>
              <select {...register('planId', { required: true })} className="w-full rounded-lg border border-[var(--color-card-border)] bg-white px-4 py-2 text-[var(--color-text)] dark:bg-[var(--color-dark-card)] dark:text-[var(--color-dark-text)]">
                <option>{t('select_plan') || 'اختر الخطة'}</option>
                {subscriptions?.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {errors.planId && <p className="text-red-500 text-xs mt-1">{t('required') || 'مطلوب'}</p>}
            </div>
            {/* startDate */}
            <div>
              <Input t={t} name="startDate" register={register} required type="date" label="start_date" />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{t('required') || 'مطلوب'}</p>}
            </div>
            {/* endDate */}
            <div>
              <Input t={t} name="endDate" register={register} required type="date" label="end_date" />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{t('required') || 'مطلوب'}</p>}
            </div>
            {/* pricePaid */}
            <div className="md:col-span-2">
              <Input t={t} name="pricePaid" register={register} required type="number" label="price_paid" />
              {errors.pricePaid && <p className="text-red-500 text-xs mt-1">{t('required') || 'مطلوب'}</p>}
            </div>
            {/* status */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--color-text)] dark:text-[var(--color-dark-text)]">
                {t('members.table.status') || 'الحالة'} *
              </label>
              <select {...register('status', { required: true })} className="w-full rounded-lg border border-[var(--color-card-border)] bg-white px-4 py-2 text-[var(--color-text)] dark:bg-[var(--color-dark-card)] dark:text-[var(--color-dark-text)]">
                <option value="active">{t('active') || 'نشط'}</option>
                <option value="expired">{t('members.status.expired') || 'منتهي'}</option>
                <option value="pending">{t('members.status.pending') || 'معلق'}</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs mt-1">{t('required') || 'مطلوب'}</p>}
            </div>
            {/* isRenewal */}
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" {...register('isRenewal')} className="h-5 w-5" />
              <span className="text-sm text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">{t('is_renewal') || 'تجديد؟'}</span>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Btn title={t('add') || 'إضافة'} />
            <button type="button" onClick={handleClose} className="rounded-full border px-5 py-2">
              {t('cancel') || 'إلغاء'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscriberModal;