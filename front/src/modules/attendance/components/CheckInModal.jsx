import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, LogIn, Clock } from 'lucide-react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { LanguageContext } from '../../shared/context/LanguageContext';

const CheckInModal = ({ isOpen, onClose, onSubmit, member, isLoading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { t } = useContext(LanguageContext);

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-widest">{t('check_in')}</h2>
            <div className="w-12 h-1 bg-blue rounded-full" />
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-blue transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Member Preview */}
        <div className="px-8 pt-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user?.full_name}`} alt="" />
                </div>
                <div>
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase italic">{member.user?.full_name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: MB-{member.id?.toString().padStart(3, '0')}</p>
                </div>
            </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-6 space-y-6">
          {/* Footer Actions */}
          <div className="flex flex-col gap-4">
            <Button 
                title={isLoading ? 'Processing...' : t('check_in')}
                className="w-full bg-blue hover:bg-blue/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-lg dark:shadow-[0_0_30px_rgba(0,127,255,0.2)]"
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

export default CheckInModal;
