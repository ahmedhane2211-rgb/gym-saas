import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Shield, Award, Banknote } from 'lucide-react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { LanguageContext } from '../../shared/context/LanguageContext';
import Select from '../../shared/components/Select';
import { useGetUsersQuery } from '../../users/userSlice';

const CoachModal = ({ isOpen, onClose, onSubmit, initialData, isLoading, title }) => {
  const { register, handleSubmit, reset,watch,setValue, formState: { errors } } = useForm();
  const { t } = useContext(LanguageContext);
  
  const { data: response } = useGetUsersQuery();
  const usersList = Array.isArray(response) ? response : (response?.data || response?.users || []);
  const filteredUsers = usersList.filter(user => user.role === 'coach');

  useEffect(() => {
    if (initialData) {
      reset({
        userId: initialData.userId || initialData.user_id || '',
        speciality: initialData.speciality || initialData.specialty || '',
        salary: initialData.salary || '',
      });
    } else {
      reset({
        userId: '',
        speciality: '',
        salary: '',
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
            {/* User Selection */}
            <div className="space-y-2">
              <Select 
                label="select_user"
                name="userId"
                register={register}
                setValue={setValue}
                watch={watch}
                errors={errors}
                options={[
                  { value: '', label: t('select_user_placeholder') || 'Select User' },
                  ...filteredUsers.map(user => ({
                    value: user.id,
                    label: `${user.full_name}`
                  }))
                ]}
              />
            </div>

            {/* Specialty */}
            <div className="relative">
              <Input 
                label="specialty" 
                placeholder="e.g. Bodybuilding, Yoga, Crossfit" 
                name="speciality" 
                register={register} 
                errors={errors} 
              />
              <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
                <Award size={18} />
              </div>
            </div>

            {/* Salary */}
            <div className="relative">
              <Input 
                label="salary" 
                type="number"
                placeholder="e.g. 5000" 
                name="salary" 
                register={register} 
                errors={errors} 
              />
              <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
                <Banknote size={18} />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col gap-4">
            <Button 
              title={isLoading ? 'Processing...' : (initialData ? t('update') : t('add'))}
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

export default CoachModal;
