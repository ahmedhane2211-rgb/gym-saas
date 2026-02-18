/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSubscriptions } from '../../redux/slices/SubscriptionSlice';
import { useForm } from 'react-hook-form';

const AddSubscriptionModal = ({ isOpen, onClose, onSubmit, t }) => {
  const dispatch = useDispatch();

    const durationOptions = useMemo(
        () => [
        { value: 'daily', label: t?.('plans.daily') || 'Daily', days: 1 },
        { value: 'weekly', label: t?.('plans.weekly') || 'Weekly', days: 7 },
        { value: 'monthly', label: t?.('plans.monthly') || 'Monthly', days: 30 },
        { value: 'quarterly', label: t?.('plans.quarterly') || 'Quarterly', days: 90 },
        { value: 'yearly', label: t?.('plans.yearly') || 'Yearly', days: 365 },
        ],
        [t]
    );

    const {register,formState: { errors },handleSubmit,reset} = useForm();

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleClose, isOpen]);

  let id = 1
  const handleAdd = (data) => {
    console.log(data)
    dispatch(addSubscriptions(data));
    reset();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t?.('actions.addPlan') || 'Add Plan'}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-card-border bg-card shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] dark:border-dark-card-border dark:bg-dark-card dark:shadow-[0_20px_60px_-40px_rgba(0,0,0,0.85)]">
        <div className="flex items-start justify-between gap-4 border-b border-card-border p-6 dark:border-dark-card-border">
          <div>
            <h2 className="text-xl font-bold text-text dark:text-dark-text">
              {t?.('actions.addPlan') || 'Add Subscription Plan'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-card text-text-secondary hover:bg-bg hover:text-text dark:border-dark-card-border dark:bg-dark-card dark:hover:bg-dark-bg dark:hover:text-dark-text"
            aria-label={t?.('actions.close') || 'Close'}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(handleAdd)} className="space-y-5 p-6">
  <div className="grid gap-4 md:grid-cols-2">

    <div className="md:col-span-2">
      <label className="mb-2 block text-sm font-semibold">
        {t?.('plan_name') || 'Plan name'} *
      </label>
      <input
        {...register("name", { required: true })}
        placeholder="Monthly Unlimited"
        className="w-full rounded-2xl border px-4 py-2"
      />
      {errors.name && (
        <p className="text-red-500 text-xs mt-1">Name is required</p>
      )}
    </div>

    <div>
      <label className="mb-2 block text-sm font-semibold">
        {t?.('plan_price') || 'Price'} *
      </label>
      <input
        type="number"
        step="0.01"
        {...register("price", { required: true, min: 0 })}
        placeholder="0.00"
        className="w-full rounded-2xl border px-4 py-2"
      />
      {errors.price && (
        <p className="text-red-500 text-xs mt-1">Valid price required</p>
      )}
    </div>

    <div>
      <label className="mb-2 block text-sm font-semibold">
        {t?.('plan_duration') || 'Duration'} *
      </label>
      <select
        {...register("duration", { required: true })}
        className="w-full rounded-2xl border px-4 py-2"
      >
        {durationOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  </div>

  <label className="flex items-center gap-3">
    <input
      type="checkbox"
      {...register("active")}
      className="h-5 w-5"
    />
    <span>{t?.('plan_active') || 'Active plan'}</span>
  </label>

  <div className="flex justify-end gap-3 pt-4">
    <button
      type="button"
      onClick={handleClose}
      className="rounded-full border px-5 py-2"
    >
      {t?.('cancel') || 'Cancel'}
    </button>

    <button
      type="submit"
      className="rounded-full bg-emerald-500 px-5 py-2 text-white"
    >
      {t?.('add') || 'Add'}
    </button>
  </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
