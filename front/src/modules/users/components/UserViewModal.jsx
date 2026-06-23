import React, { useContext } from 'react';
import { Mail, Phone, MapPin, Calendar, Shield, Activity } from 'lucide-react';
import { LanguageContext } from '../../shared/context/LanguageContext';
import formattedDate from '../../shared/utils/formattedDate';
import DetailItem from '../../shared/components/DetailItem';
import AppModal from '../../shared/components/AppModal';

const UserViewModal = ({ isOpen, onClose, user }) => {
  const { t } = useContext(LanguageContext);

  if (!isOpen || !user) return null;

  return (
    <AppModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg" showCloseFooter closeText={t('close')} headerContent={<div />} >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-orange to-orange/50 opacity-10" />
        <div className="relative space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-3xl border-4 border-white dark:border-gray-dark shadow-xl overflow-hidden bg-gray-100 dark:bg-gray-dark -mt-4">
              <img
                src={user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`}
                alt="avatar"
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

        </div>
    </AppModal>
  );
};


export default UserViewModal;
