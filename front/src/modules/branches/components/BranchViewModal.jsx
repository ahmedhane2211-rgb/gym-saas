import React, { useContext } from 'react';
import { X, MapPin, Phone, Building2, ShieldCheck, Calendar } from 'lucide-react';
import { LanguageContext } from '../../shared/context/LanguageContext';
import formattedDate from '../../shared/utils/formattedDate';

const BranchViewModal = ({ isOpen, onClose, branch }) => {
    const { t } = useContext(LanguageContext);

    if (!isOpen || !branch) return null;

    const dataPoints = [
        { label: t('branch_name') || 'Branch Name', value: branch.name, icon: Building2, color: 'text-orange' },
        { label: t('phone'), value: branch.phone, icon: Phone, color: 'text-blue' },
        { label: t('address'), value: branch.address, icon: MapPin, color: 'text-purple' },
        { label: t('gym_id') || 'Gym ID', value: branch.gym_id, icon: ShieldCheck, color: 'text-gray-400' },
        { label: t('created_at'), value: formattedDate(branch.created_at), icon: Calendar, color: 'text-gray-400' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Visual Header */}
                <div className="h-32 bg-gradient-to-r from-orange to-orange/30 relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 ltr:right-6 rtl:left-6 p-2 bg-white/20 hover:bg-white/40 text-white rounded-xl backdrop-blur-md transition-all"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute -bottom-10 ltr:left-10 rtl:right-10 w-24 h-24 rounded-3xl bg-white dark:bg-gray-dark border-4 border-white dark:border-gray-dark flex items-center justify-center shadow-xl">
                        <Building2 size={40} className="text-orange" />
                    </div>
                </div>

                <div className="p-10 pt-16 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">{branch.name}</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Branch Profile</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${branch.is_active ? 'bg-blue/10 border-blue/20 text-blue' : 'bg-gray-500/10 border-gray-500/20 text-gray-500'}`}>
                            {branch.is_active ? t('active') : t('inactive')}
                        </span>
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

                    <button 
                        onClick={onClose}
                        className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-black font-black text-[12px] uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-[1.02] transition-all"
                    >
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BranchViewModal;
