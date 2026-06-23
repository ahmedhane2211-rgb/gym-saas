import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, DollarSign, FileText, Calendar } from 'lucide-react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { LanguageContext } from '../../shared/context/LanguageContext';

const ExpenseModal = ({ isOpen, onClose, onSubmit, initialData, isLoading, title }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        note: initialData.note || '',
      });
    } else {
      reset({
        name: '',
        note: '',
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-widest">{t(title)}</h2>
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-4 space-y-8">
          <div className="space-y-6">
            {/* Expense Name */}
            <div className="relative">
              <Input 
                label="expense_name" 
                placeholder="e.g. Rent, Utilities" 
                name="name" 
                register={register} 
                errors={errors}
                validation={{ required: "Required" }}
              />
              <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
                <FileText size={18} />
              </div>
            </div>

            {/* Note */}
            <div className="relative">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-light/50 tracking-[0.2em] uppercase px-1">
                {t('note')}
              </label>
              <textarea 
                {...register('note')}
                placeholder="Add notes..."
                className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-orange/50 transition-all font-bold resize-none h-24"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Button
              title={isLoading ? 'Processing...' : (initialData ? t('update') : t('add'))}
              className="w-full bg-orange hover:bg-orange/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-[0_0_30px_rgba(255,95,31,0.2)]"
            />
            <Button
              onClick={onClose}
              title={t('cancel')}
              className="w-full text-gray-600 font-black text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors flex items-center justify-center gap-2"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
