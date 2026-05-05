import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, MapPin, Phone, Building2, CheckCircle2 } from 'lucide-react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { LanguageContext } from '../../shared/context/LanguageContext';

const BranchModal = ({ isOpen, onClose, onSubmit, initialData, isLoading, title }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          address: initialData.address,
          phone: initialData.phone,
          isActive: initialData.isActive !== undefined ? initialData.isActive : true
        });
      } else {
        reset({
          name: '',
          address: '',
          phone: '',
          isActive: true
        });
      }
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
                label={t('branch_name') || 'Branch Name'} 
                name="name" 
                register={register} 
                errors={errors} 
                validation={{ required: 'Name is required' }}
                icon={<Building2 size={18} />}
            />
             <Input 
                label={t('phone')} 
                name="phone" 
                register={register} 
                errors={errors} 
                icon={<Phone size={18} />}
            />
          </div>

          <Input 
            label={t('address')} 
            name="address" 
            register={register} 
            errors={errors} 
            validation={{ required: 'Address is required' }}
            icon={<MapPin size={18} />}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Toggle Status */}
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('status')}</label>
                <div className="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        {...register('isActive')}
                        className="w-5 h-5 rounded border-gray-300 text-orange focus:ring-orange" 
                    />
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{t('isActive') || 'Active'}</span>
                </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col gap-4 pt-4">
            <Button 
                title={isLoading ? 'Processing...' : t(initialData ? 'update' : 'add')}
                className="w-full bg-orange hover:bg-orange/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-lg dark:shadow-[0_0_30px_rgba(255,95,31,0.2)]"
            />
            <Button 
              onClick={onClose}
              title={t('cancel')}
              className="w-full text-gray-500 dark:text-gray-600 font-black text-[10px] tracking-[0.3em] uppercase hover:text-gray-900 dark:hover:text-white transition-colors"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchModal;
