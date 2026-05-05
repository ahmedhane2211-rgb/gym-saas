import React, { useContext } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, Shield, Activity } from 'lucide-react';
import { LanguageContext } from '../../shared/context/LanguageContext';
import formattedDate from '../../shared/utils/formattedDate';
import DetailItem from '../../shared/components/DetailItem';

const UserViewModal = ({ isOpen, onClose, user }) => {
  const { t } = useContext(LanguageContext);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-orange to-orange/50 opacity-10" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 ltr:right-6 rtl:left-6 p-2 text-gray-400 hover:text-orange transition-colors z-10 bg-white/10 dark:bg-black/20 rounded-full backdrop-blur-md"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="relative pt-12 px-8 pb-8 space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-3xl border-4 border-white dark:border-gray-dark shadow-xl overflow-hidden bg-gray-100 dark:bg-gray-dark -mt-4">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-widest">{user.full_name}</h3>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black bg-orange/10 text-orange border border-orange/20 mt-2">
                    {t(user.role)}
                </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-6 pt-4">
            <DetailItem icon={<Mail size={16}/>} label={t('email')} value={user.email} />
            <div className="grid grid-cols-2 gap-4">
                <DetailItem icon={<Phone size={16}/>} label={t('phone')} value={user.phone || 'N/A'} />
                <DetailItem icon={<Shield size={16}/>} label={t('gender')} value={t(user.gender) || 'N/A'} />
            </div>
            <DetailItem icon={<MapPin size={16}/>} label={t('address')} value={user.address || 'N/A'} />
            <div className="grid grid-cols-2 gap-4">
                <DetailItem icon={<Calendar size={16}/>} label={t('created_at')} value={formattedDate(user.created_at)} />
                <DetailItem 
                    icon={<Activity size={16}/>} 
                    label={t('status')} 
                    value={
                        <span className={user.is_active ? 'text-blue' : 'text-gray-500'}>
                            {user.is_active ? t('active') : t('inactive')}
                        </span>
                    } 
                />
            </div>
          </div>

          {/* Actions */}
          <button 
            onClick={onClose}
            className="w-full py-4 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 dark:text-gray-400 font-black text-[12px] uppercase tracking-[0.3em] hover:bg-orange hover:text-black transition-all"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};


export default UserViewModal;
