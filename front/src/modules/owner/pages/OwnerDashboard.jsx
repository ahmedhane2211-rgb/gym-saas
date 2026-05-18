import React, { useContext } from 'react';
import { Building2, ShieldCheck, Activity, Users } from 'lucide-react';
import { LanguageContext } from '../../shared/context/LanguageContext';
import { useGetSubscriptionsQuery } from '../services/OwnerSlice';

const OwnerDashboard = () => {
  const { t } = useContext(LanguageContext);
  const { data: response } = useGetSubscriptionsQuery();
  const subscriptions = Array.isArray(response) ? response : (response?.data || []);

  const stats = [
    { label: t('tenants'), value: subscriptions.length, icon: <Building2 size={32} className="text-orange" /> },
    { label: t('active_subscriptions'), value: subscriptions.filter(s => s.is_active).length, icon: <ShieldCheck size={32} className="text-blue" /> },
    { label: t('total_users'), value: '---', icon: <Users size={32} className="text-purple-500" /> },
    { label: t('live_now'), value: '---', icon: <Activity size={32} className="text-green-500" /> },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase">
          {t('owner_dashboard')}
        </h1>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">
          System Overview & Management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-8 group hover:scale-[1.02] transition-all duration-500 cursor-default">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 group-hover:border-orange/20 transition-colors">
                {stat.icon}
              </div>
            </div>
            <div className="mt-6 space-y-1">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <p className="text-4xl font-black text-gray-900 dark:text-white italic">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 h-96 flex flex-col items-center justify-center border-dashed border-2 border-gray-200 dark:border-white/5">
            <Activity size={48} className="text-gray-300 mb-4 animate-pulse" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Revenue Analytics Coming Soon</p>
        </div>
        <div className="glass-card p-8 h-96 flex flex-col items-center justify-center border-dashed border-2 border-gray-200 dark:border-white/5">
            <Users size={48} className="text-gray-300 mb-4 animate-bounce" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Recent Activity Coming Soon</p>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
