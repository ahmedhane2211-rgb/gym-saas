import React, { useContext } from 'react';
import { X, Building2, User, Mail, Globe, Calendar, BadgeCheck, ShieldCheck } from 'lucide-react';
import { LanguageContext } from '../../shared/context/LanguageContext';
import formattedDate from '../../shared/utils/formattedDate';

const TenantViewModal = ({ isOpen, onClose, tenant }) => {
  const { t } = useContext(LanguageContext);

  if (!isOpen || !tenant) return null;

  const DetailItem = ({ icon: Icon, label, value, color = "orange" }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
      <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t(label)}</p>
        <p className="text-gray-900 dark:text-white font-bold">{value || '---'}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-widest">{t('subscription_details')}</h2>
            <div className="w-12 h-1 bg-orange rounded-full" />
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-orange transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 pt-4 space-y-6">
          <div className="flex flex-col items-center justify-center py-6 space-y-3">
             <div className="w-20 h-20 rounded-3xl bg-orange/10 flex items-center justify-center text-orange shadow-2xl shadow-orange/20">
                <Building2 size={40} />
             </div>
             <div className="text-center">
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic">{tenant.gym_name}</h3>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full text-[9px] uppercase tracking-widest font-black border ${tenant.status === 'active'
                    ? 'bg-green-500/10 border-green-500/20 text-green-500'
                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                    }`}>
                    {tenant.status === 'active' ? 'Active' : 'Inactive'}
                </span>

             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem icon={User} label="owner_name" value={tenant.user?.full_name} />
            <DetailItem icon={Mail} label="email" value={tenant.user?.email} color="blue" />
            <DetailItem icon={Calendar} label="start_date" value={formattedDate(tenant.start_date)} color="purple-500" />
            <DetailItem icon={Calendar} label="end_date" value={formattedDate(tenant.end_date)} color="green-500" />
            <DetailItem icon={BadgeCheck} label="paid" value={tenant.paid} color="yellow-500" />
            <DetailItem icon={Globe} label="phone" value={tenant.gym_phone} color="orange" />
          </div>


          <div className="p-6 rounded-2xl bg-orange/5 border border-orange/10 flex items-start gap-4">
             <ShieldCheck size={24} className="text-orange shrink-0" />
             <div className="space-y-1">
                <p className="text-xs font-black text-orange uppercase tracking-widest">System Access Verified</p>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                    This gym is currently authorized to use the platform. All security protocols and feature limits are enforced based on the active tier.
                </p>
             </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-gray-50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.05] text-gray-500 dark:text-gray-400 font-black text-[10px] tracking-[0.3em] uppercase rounded-xl transition-all"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantViewModal;
