import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Shield, User, Info, Calendar, Phone, Mail, MapPin } from 'lucide-react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import CheckBox from '../../shared/components/CheckBox';
import { LanguageContext } from '../../shared/context/LanguageContext';
import Select from '../../shared/components/Select';

const UserModal = ({ isOpen, onClose, onSubmit, initialData, isLoading, title }) => {
  const { register, handleSubmit,watch,setValue, reset, formState: { errors } } = useForm();
  const { t } = useContext(LanguageContext)
  useEffect(() => {
    if (initialData) {
      // Format date to YYYY-MM-DD for the HTML5 date input
      const formattedData = {
        ...initialData,
        date_of_birthday: initialData.date_of_birthday ? new Date(initialData.date_of_birthday).toISOString().split('T')[0] : ''
      };
      reset(formattedData);
    } else {
      reset({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: '',
        is_active: true,
        gender: '',
        date_of_birthday: ''
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#121212] border border-white/5 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-widest">{t(title)}</h2>
            <div className="w-12 h-1 bg-orange rounded-full" />
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-4 h-[80vh] overflow-y-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <Input
              label="full_name"
              placeholder="e.g. Alex Sterling"
              name="full_name"
              register={register}
              errors={errors}
            />

            {/* Gender */}
            <div className="space-y-2">
              <Select
                label="gender"
                name="gender"
                register={register}
                setValue={setValue}
                watch={watch}
                errors={errors}
                options={[
                  { value: '', label: t('select_gender') },
                  { value: 'male', label: t('male') },
                  { value: 'female', label: t('female') },
                ]}
              />
            </div>

            {/* Date of Birth */}
            <Input
              label="date_of_birthday"
              type="date"
              name="date_of_birthday"
              register={register}
              errors={errors}
            />

            {/* Phone Number */}
            <Input
              label="phone"
              placeholder="+1 (555) 000-0000"
              name="phone"
              register={register}
              errors={errors}
            />

            {/* Email Address */}
            <div className="md:col-span-2">
              <Input
                label="email"
                placeholder="alex.sterling@example.com"
                type="email"
                name="email"
                register={register}
                errors={errors}
              />
            </div>

            {/* Residential Address */}
            <div className="md:col-span-2">
              <Input
                label="address"
                placeholder="123 Performance Way, Athlete City"
                name="address"
                register={register}
                errors={errors}
              />
            </div>

            {!initialData && (
              <div className="md:col-span-2">
                <Input
                  label="password"
                  type="password"
                  placeholder=""
                  name="password"
                  register={register}
                  errors={errors}
                />
              </div>
            )}
          </div>

          {/* Operational Setup Section */}
          <div className="bg-blue/5 border border-blue/10 rounded-2xl p-6 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Shield size={120} className="text-blue" />
            </div>

            <div className="flex items-center gap-2 text-blue">
              <Shield size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operational Setup</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <select
                  label="role"
                  name="role"
                  {...register('role', {
                    required: t('role_required'),
                  })}
                  className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:border-blue/30"
                >
                  <option value="">{t('select_role')}</option>
                  {[
                    { value: 'member', label: t('member') },
                    { value: 'coach', label: t('coach') },
                    { value: 'employee', label: t('employee') },
                    { value: 'admin', label: t('admin') },
                    { value: 'reception', label: t('reception') },
                  ].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {initialData && (
                <div className="pb-4">
                  <CheckBox
                    label="Active"
                    name="is_active"
                    register={register}
                    errors={errors}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
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

export default UserModal;
