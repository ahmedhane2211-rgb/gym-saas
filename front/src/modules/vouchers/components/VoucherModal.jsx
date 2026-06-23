import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, DollarSign, Calendar, FileText } from 'lucide-react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { LanguageContext } from '../../shared/context/LanguageContext';
import Select from '../../shared/components/Select';
import CheckBox from '../../shared/components/CheckBox';
import { useGetExpensesQuery } from '../../expenses/services/ExpenseSlice';
import { useGetMembersQuery } from '../../members/services/MemberSlice';

const VoucherModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const { t } = useContext(LanguageContext);
  const voucherType = watch('type') || 'payment';

  const { data: expensesData } = useGetExpensesQuery();
  const expenses = Array.isArray(expensesData) ? expensesData : (expensesData?.data || []);

  const { data: membersData } = useGetMembersQuery();
  const members = Array.isArray(membersData) ? membersData : (membersData?.data || []);

  useEffect(() => {
    if (initialData) {
      reset({
        type: initialData.type || 'payment',
        expense_id: initialData.expenseId || initialData.expense_id || '',
        revenueName: initialData.revenueName || initialData.revenue_name || '',
        amount: initialData.amount || '',
        date: initialData.date || '',
        note: initialData.note || '',
        customerId: initialData.customerId || initialData.customer_id || '',
      });
    } else {
      reset({
        type: 'payment',
        expense_id: '',
        revenueName: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
        customerId: '',
      });
    }
  }, [initialData, reset, isOpen]);

  const handleTypeChange = (newType) => {
    setValue('type', newType);
  };

  if (!isOpen) return null;

  const buttonColorClass = voucherType === 'payment' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600';
  const headerAccentClass = voucherType === 'payment' ? 'bg-red-500' : 'bg-green-500';
  const hoverColorClass = voucherType === 'payment' ? 'hover:text-red-500' : 'hover:text-green-500';
  const focusBorderClass = voucherType === 'payment' ? 'focus:border-red-500/50' : 'focus:border-green-500/50';
  const title = voucherType === 'payment' 
    ? (initialData ? 'update_payment_voucher' : 'add_payment_voucher')
    : (initialData ? 'update_receipt_voucher' : 'add_receipt_voucher');

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 p-8 pb-4 flex items-center justify-between bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-white/5 z-10">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-widest">{t(title)}</h2>
            <div className={headerAccentClass + ' w-12 h-1 rounded-full'} />
          </div>
          <button 
            onClick={onClose}
            className={`p-2 text-gray-500 ${hoverColorClass} transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-4 space-y-6">
          {/* Voucher Type Selection */}
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${voucherType === 'payment' ? 'bg-red-500' : 'bg-green-500'}`} />
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-light/50 tracking-[0.2em] uppercase">
                {t('voucher_type')}
              </label>
            </div>
            <div className="flex gap-6">
              <div 
                onClick={() => handleTypeChange('payment')}
                className="cursor-pointer"
              >
                <CheckBox 
                  label={t('payment_voucher')}
                  name="type_payment"
                  checked={voucherType === 'payment'}
                  onChange={() => handleTypeChange('payment')}
                />
              </div>
              <div 
                onClick={() => handleTypeChange('receipt')}
                className="cursor-pointer"
              >
                <CheckBox 
                  label={t('receipt_voucher')}
                  name="type_receipt"
                  checked={voucherType === 'receipt'}
                  onChange={() => handleTypeChange('receipt')}
                />
              </div>
            </div>

          {/* Expense Selection - Payment Voucher (صرف) */}
          {voucherType === 'payment' && (
            <div className="space-y-2">
              <Select 
                label="select_expense"
                name="expense_id"
                register={register}
                setValue={setValue}
                watch={watch}
                errors={errors}
                options={[
                  { value: '', label: t('select_expense_placeholder') || 'Select Expense' },
                  ...expenses.map(expense => ({
                    value: expense.id,
                    label: `${expense.name}`
                  }))
                ]}
              />
            </div>
          )}

          {/* Revenue Name - Receipt Voucher (قبض) */}
          {voucherType === 'receipt' && (
            <div className="relative">
              <Input 
                label="revenue_name" 
                placeholder="e.g. Subscription, Training Session" 
                name="revenueName" 
                register={register} 
                errors={errors}
                validation={{ required: "Required" }}
              />
              <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
                <FileText size={18} />
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="relative">
            <Input 
              label="amount" 
              type="number"
              placeholder="e.g. 500" 
              name="amount" 
              register={register} 
              errors={errors}
              validation={{ required: "Required" }}
            />
            <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
              <DollarSign size={18} />
            </div>
          </div>

          {/* Date */}
          <div className="relative">
            <Input 
              label="date" 
              type="date" 
              name="date" 
              register={register} 
              errors={errors}
              validation={{ required: "Required" }}
            />
            <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
              <Calendar size={18} />
            </div>
          </div>

          {/* Customer Selection (Optional) */}
          <div className="space-y-2">
            <Select 
              label="customer"
              name="customerId"
              register={register}
              setValue={setValue}
              watch={watch}
              errors={errors}
              options={[
                { value: '', label: t('select_customer_optional') || 'Select Customer (Optional)' },
                ...members.map(member => ({
                  value: member.id,
                  label: member.fullName || member.full_name
                }))
              ]}
            />
          </div>

          {/* Note */}
          <div className="relative">
            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-light/50 tracking-[0.2em] uppercase px-1">
              {t('note')}
            </label>
            <textarea 
              {...register('note')}
              placeholder="Add notes..."
              className={`w-full bg-gray-50 dark:bg-white/3 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-xs text-gray-900 dark:text-white focus:outline-none ${focusBorderClass} transition-all font-bold resize-none h-20`}
            />
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

export default VoucherModal;
