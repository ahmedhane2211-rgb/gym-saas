import React, { useContext } from 'react';
import { Calendar, ShieldAlert, Award } from 'lucide-react';
import { LanguageContext } from '../../shared/context/LanguageContext';
import AppModal from '../../shared/components/AppModal';

const FreezeViewModal = ({ isOpen, onClose, freezePlan }) => {
    const { t } = useContext(LanguageContext);

    if (!isOpen || !freezePlan) return null;

    const dataPoints = [
        { label: t('name') || 'Name', value: freezePlan.name, icon: Award, color: 'text-orange' },
        { label: t('days') || 'Days', value: freezePlan.days, icon: Calendar, color: 'text-blue' },
        { label: t('max_uses') || 'Max Uses', value: freezePlan.max_uses, icon: ShieldAlert, color: 'text-purple' },
    ];

    return (
        <AppModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl" showCloseFooter closeText={t('close')} headerContent={<div />}>
                <div className="h-32 bg-gradient-to-r from-orange to-orange/30 relative">
                    <div className="absolute -bottom-10 ltr:left-10 rtl:right-10 w-24 h-24 rounded-3xl bg-white dark:bg-gray-dark border-4 border-white dark:border-gray-dark flex items-center justify-center shadow-xl">
                        <Award size={40} className="text-orange" />
                    </div>
                </div>

                <div className="pt-16 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">{freezePlan.name}</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Freeze Plan Profile</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                        {dataPoints.map((dp, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                                <div className={`p-2.5 rounded-xl bg-white dark:bg-white/5 shadow-sm ${dp.color}`}>
                                    <dp.icon size={18} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{dp.label}</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-200">{dp.value || 'N/A'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
        </AppModal>
    );
};

export default FreezeViewModal;
