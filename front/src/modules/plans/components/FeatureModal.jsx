import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Sparkles } from 'lucide-react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { LanguageContext } from '../../shared/context/LanguageContext';

const FeatureModal = ({ isOpen, onClose, onSubmit, initialData, isLoading, title }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    if (isOpen) {
      reset(initialData || { name: '' });
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-widest">{t(title)}</h2>
            <div className="w-12 h-1 bg-blue rounded-full" />
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-blue transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-4 space-y-6">
          <Input 
            label={t('feature_name') || 'Feature Name'} 
            name="name" 
            register={register} 
            errors={errors} 
            validation={{ required: 'Name is required' }}
            icon={<Sparkles size={18} />}
          />

          <div className="flex flex-col gap-4 pt-4">
            <Button 
                title={isLoading ? 'Processing...' : t(initialData ? 'update' : 'add')}
                className="w-full bg-blue hover:bg-blue/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-lg"
            />
            <Button onClick={onClose} title={t('cancel')} className="w-full text-gray-500 font-black text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeatureModal;
