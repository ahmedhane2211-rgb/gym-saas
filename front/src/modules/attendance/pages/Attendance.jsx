import React, { useContext, useState, cloneElement } from 'react';
import { useGetAttendanceQuery } from '../services/AttendanceSlice';
import { 
  ClipboardCheck,
  Search, 
  Filter, 
  Download, 
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { LanguageContext } from '../../shared/context/LanguageContext';
import formattedDate from '../../shared/utils/formattedDate';
import Input from '../../shared/components/Input';

const Attendance = () => {
    const { t } = useContext(LanguageContext);
    
    // Date Filters State (Default to current month)
    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    
    const [filters, setFilters] = useState({
        from: firstDayOfMonth,
        to: today
    });

    const { data: response, error, isLoading } = useGetAttendanceQuery({ 
        from: filters.from, 
        to: filters.to 
    });
    
    const attendanceRecords = Array.isArray(response) ? response : (response?.data || response?.attendance || []);

    if (error) {
        toast.error(t('fetch_error') || 'Failed to fetch attendance');
    }

    const stats = [
        { label: t('total_check_ins') || 'Total Check-ins', value: attendanceRecords?.length || 0, icon: <ClipboardCheck className="text-orange" />, color: 'orange' },
        { label: t('active_now') || 'Active Now', value: attendanceRecords?.filter(a => !a.check_out).length || 0, icon: <User className="text-blue" />, color: 'blue' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header & Stats */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest italic uppercase">{t('attendance')}</h1>
                    <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed">
                        {t('attendance_desc') || 'Monitor real-time gym traffic and member entry logs.'}
                    </p>
                </div>

                <div className="flex gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="glass-card p-6 min-w-[200px] flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ltr:translate-x-2 ltr:-translate-y-2 rtl:-translate-x-2 rtl:-translate-y-2">
                                {cloneElement(stat.icon, { size: 64 })}
                            </div>
                            <p className="text-gray-600 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                            <p className={`text-4xl font-black ${stat.color === 'orange' ? 'text-orange' : 'text-blue'}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col md:flex-row items-end gap-4 w-full md:w-auto">
                    <div className="w-full md:w-48">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">{t('date_from') || 'Date From'}</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                value={filters.from}
                                onChange={(e) => setFilters(prev => ({ ...prev, from: e.target.value }))}
                                className="w-full bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl py-3 px-4 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-orange/20 transition-all font-bold"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-48">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">{t('date_to') || 'Date To'}</label>
                        <input 
                            type="date" 
                            value={filters.to}
                            onChange={(e) => setFilters(prev => ({ ...prev, to: e.target.value }))}
                            className="w-full bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl py-3 px-4 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-orange/20 transition-all font-bold"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-6 py-4 bg-gray-50 dark:bg-gray-dark/50 border border-gray-200 dark:border-white/5 rounded-xl text-gray-500 dark:text-gray-light font-black text-[12px] uppercase tracking-widest hover:text-orange dark:hover:text-white transition-all">
                        <Download size={16} />
                        <span>{t('export')}</span>
                    </button>
                    <button className="btn-blue flex items-center gap-2 h-14 px-8 shadow-[0_0_30px_rgba(0,127,255,0.1)]">
                        <Filter size={18} />
                        <span>{t('apply_filters') || 'Apply'}</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <table className="w-full text-left rtl:text-right border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-100/50 dark:bg-white/[0.02]">
                            <th className="px-8 py-6 text-[16px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-[0.2em]">{t('member')}</th>
                            <th className="px-8 py-6 text-[16px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-[0.2em]">{t('date') || 'Date'}</th>
                            <th className="px-8 py-6 text-[16px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-[0.2em]">{t('check_in')}</th>
                            <th className="px-8 py-6 text-[16px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-[0.2em]">{t('check_out') || 'Check-Out'}</th>
                            <th className="px-8 py-6 text-[16px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-[0.2em]">{t('duration') || 'Duration'}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-8 py-8"><div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-full"></div></td>
                                </tr>
                            ))
                        ) : (
                            attendanceRecords?.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg border border-gray-200 dark:border-white/5 overflow-hidden bg-gray-100 dark:bg-gray-dark relative">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${record.member?.user?.full_name || record.user?.full_name}`}
                                                    alt=""
                                                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-gray-900 dark:text-white font-black text-xs uppercase tracking-tight italic">{record.member?.user?.full_name || record.user?.full_name}</p>
                                                <p className="text-gray-500 dark:text-gray-600 text-[9px] font-bold uppercase tracking-widest">MB-2026-{record.member_id?.toString().padStart(3, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-gray-900 dark:text-white text-[11px] font-black uppercase tracking-widest">
                                            <Calendar size={14} className="text-orange" />
                                            {formattedDate(record.check_in)}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-blue text-[11px] font-black uppercase tracking-widest border border-blue/20 bg-blue/5 px-3 py-1 rounded-lg w-fit">
                                            <Clock size={14} />
                                            {new Date(record.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {record.check_out ? (
                                            <div className="flex items-center gap-2 text-rose-500 text-[11px] font-black uppercase tracking-widest border border-rose-500/20 bg-rose-500/5 px-3 py-1 rounded-lg w-fit">
                                                <Clock size={14} />
                                                {new Date(record.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        ) : (
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest animate-pulse">In Progress...</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                        {record.duration || '--'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="px-8 py-6 border-t border-gray-200 dark:border-white/5 flex items-center justify-between bg-gray-50 dark:bg-white/[0.01]">
                    <p className="text-gray-500 dark:text-gray-600 text-[10px] font-black uppercase tracking-widest">
                        Showing 1-{attendanceRecords?.length || 0} of {attendanceRecords?.length || 0} Records
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ltr:rotate-0 rtl:rotate-180"><ChevronLeft size={18} /></button>
                        <div className="flex gap-1">
                            <button className="w-8 h-8 rounded-lg bg-orange text-black font-black text-[10px] flex items-center justify-center">1</button>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ltr:rotate-0 rtl:rotate-180"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
