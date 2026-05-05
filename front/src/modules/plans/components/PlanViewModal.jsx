import React, { useContext } from 'react';
import { X, ScrollText, DollarSign, Clock, Sparkles, CheckCircle2, FileText } from 'lucide-react';
import { LanguageContext } from '../../shared/context/LanguageContext';

const PlanViewModal = ({ isOpen, onClose, plan }) => {
    const { t } = useContext(LanguageContext);

    if (!isOpen || !plan) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header Banner */}
                <div className="h-32 bg-gradient-to-r from-blue to-purple relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 ltr:right-6 rtl:left-6 p-2 bg-white/20 hover:bg-white/40 text-white rounded-xl backdrop-blur-md transition-all"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute -bottom-10 ltr:left-10 rtl:right-10 w-20 h-20 rounded-2xl bg-white dark:bg-gray-dark border-4 border-white dark:border-gray-dark flex items-center justify-center shadow-xl">
                        <ScrollText size={32} className="text-blue" />
                    </div>
                </div>

                <div className="p-10 pt-16 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">{plan.name}</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('plan_details') || 'Subscription Plan Details'}</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${plan.is_active ? 'bg-orange/10 border-orange/20 text-orange' : 'bg-gray-500/10 border-gray-500/20 text-gray-500'}`}>
                            {plan.is_active ? t('active') : t('inactive')}
                        </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-1">
                            <div className="flex items-center gap-2 text-blue">
                                <DollarSign size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{t('price')}</span>
                            </div>
                            <p className="text-xl font-black text-gray-900 dark:text-white italic">{plan.price} <span className="text-[10px] font-bold text-gray-400">EGP</span></p>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-1">
                            <div className="flex items-center gap-2 text-purple">
                                <Clock size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{t('duration')}</span>
                            </div>
                            <p className="text-xl font-black text-gray-900 dark:text-white italic">{plan.duration} <span className="text-[10px] font-bold text-gray-400">{t('days')}</span></p>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-blue" />
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('included_features') || 'Included In This Plan'}</h4>
                        </div>
                        <div className="space-y-3">
                            {plan.features?.map((f, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-blue/5 border border-blue/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue/20 flex items-center justify-center text-blue">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <span className="text-xs font-black text-gray-900 dark:text-gray-200 uppercase tracking-tight">{f.name}</span>
                                    </div>
                                    <span className="px-3 py-1 bg-white dark:bg-black/40 rounded-lg text-[10px] font-black text-blue shadow-sm border border-blue/5">{f.value}</span>
                                </div>
                            ))}
                            {(!plan.features || plan.features.length === 0) && (
                                <div className="p-8 text-center border-2 border-dashed border-gray-100 dark:border-white/5 rounded-2xl">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase italic tracking-widest">No Features Assigned</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="w-full py-5 bg-gradient-to-r from-blue to-purple text-white font-black text-[12px] uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-[1.02] transition-all"
                    >
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanViewModal;
