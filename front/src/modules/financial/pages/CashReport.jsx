import React, { useContext, useState } from 'react';
import { useGetCashReportQuery } from '../services/CashSlice';
import { 
    Wallet, 
    Calendar, 
    TrendingUp, 
    ArrowUpCircle, 
    ArrowDownCircle, 
    Filter,
    Search,
    Download
} from 'lucide-react';
import { LanguageContext } from '../../shared/context/LanguageContext';
import DataTable from '../../shared/components/DataTable';
import formattedDate from '../../shared/utils/formattedDate';
import formatNum from '../../shared/utils/formatNum';
import StatsCard from '../../shared/components/StatsCard';

const CashReport = () => {
    const { t } = useContext(LanguageContext);
    
    // Default filter to current month
    const today = new Date().toISOString().split('T')[0];
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    
    const [filters, setFilters] = useState({
        from: firstDay,
        to: today
    });

    const { data: response, isLoading, isFetching } = useGetCashReportQuery(filters);
    const reportData = Array.isArray(response) ? response : (response?.data || []);

    const columns = [
        {
            header: 'type',
            render: (row) => {
                const isIncome = row.type === 'income' || row.type === 'sale';
                return (
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isIncome ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                            {isIncome ? <ArrowDownCircle size={16} /> : <ArrowUpCircle size={16} />}
                        </div>
                        <span className="font-black uppercase tracking-tight italic">
                            {t(row.type) || row.type}
                        </span>
                    </div>
                );
            }
        },
        {
            header: 'amount',
            render: (row) => (
                <span className={`font-black italic ${row.value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatNum(row.value)} EGP
                </span>
            )
        },
        {
            header: 'running_balance',
            render: (row) => (
                <div className="font-black text-blue italic">
                    {formatNum(row.balance || row.total_value)} EGP
                </div>
            )
        },
        {
            header: 'date',
            render: (row) => (
                <div className="flex items-center gap-2 text-gray-500">
                    <Calendar size={14} />
                    <span className="text-xs font-bold">{formattedDate(row.created_at || row.date)}</span>
                </div>
            )
        }
    ];

    // Calculate summary from the last row's balance or sum up
    const currentBalance = reportData.length > 0 ? (reportData[0].total_value) : 0;
    const totalIncome = reportData.reduce((acc, row) => (row.amount > 0 ? acc + Number(row.amount) : acc), 0);
    const totalExpense = reportData.reduce((acc, row) => (row.amount < 0 ? acc + Math.abs(Number(row.amount)) : acc), 0);

    const stats = [
        { label: t('current_balance') || 'Current Balance', value: formatNum(currentBalance) + ' EGP', icon: <Wallet className="text-blue" />, color: 'blue' }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
             {/* Header */}
             <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange/10 rounded-2xl text-orange">
                            <Wallet size={28} />
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest italic uppercase">{t('cash_report')}</h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed ml-1">
                        {t('cash_report_desc') || 'Track daily cash flow, income, and expenses to monitor your gym\'s financial health.'}
                    </p>
                </div>

                <div className="flex flex-wrap gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="glass-card p-6 min-w-[180px] flex flex-col justify-between h-32 relative overflow-hidden group">
                            <StatsCard stat={stat} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-6 border-l-4 border-l-orange">
                <div className="flex flex-col md:flex-row items-end gap-6">
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('from_date') || 'From Date'}</label>
                            <div className="relative">
                                <Calendar className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input 
                                    type="date" 
                                    value={filters.from}
                                    onChange={(e) => setFilters({...filters, from: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/5 rounded-xl py-3 ltr:pl-12 rtl:pr-12 ltr:pr-4 rtl:pl-4 text-gray-900 dark:text-white text-xs font-bold outline-none focus:border-orange/50 transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('to_date') || 'To Date'}</label>
                            <div className="relative">
                                <Calendar className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input 
                                    type="date" 
                                    value={filters.to}
                                    onChange={(e) => setFilters({...filters, to: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/5 rounded-xl py-3 ltr:pl-12 rtl:pr-12 ltr:pr-4 rtl:pl-4 text-gray-900 dark:text-white text-xs font-bold outline-none focus:border-orange/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="relative">
                {(isLoading || isFetching) && (
                    <div className="absolute inset-0 z-10 bg-white/50 dark:bg-black/50 backdrop-blur-[2px] flex items-center justify-center rounded-3xl">
                        <div className="animate-spin text-orange">
                            <TrendingUp size={40} />
                        </div>
                    </div>
                )}
                <DataTable 
                    columns={columns}
                    data={reportData}
                    isLoading={isLoading && !isFetching}
                    actions={false}
                />
            </div>
        </div>
    );
};

export default CashReport;
