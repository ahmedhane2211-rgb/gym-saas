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
import { exportToCSV } from '../../shared/utils/exportUtils';
import DataTable from '../../shared/components/DataTable';
import StatsCard from '../../shared/components/StatsCard';

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

    const columns = [
  {
    header: t('member'),
    accessor: 'member',
    render: (record) => (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg border border-gray-200 dark:border-white/5 overflow-hidden bg-gray-100 dark:bg-gray-dark relative">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${record.member?.user?.full_name || record.user?.full_name}`}
            alt=""
            className="w-full h-full object-cover grayscale opacity-80"
          />
        </div>

        <div>
          <p className="text-gray-900 dark:text-white font-black text-xs uppercase tracking-tight italic">
            {record.member?.user?.full_name || record.user?.full_name}
          </p>

          <p className="text-gray-500 dark:text-gray-600 text-[9px] font-bold uppercase tracking-widest">
            MB-{record.member_id?.toString().padStart(3, '0')}
          </p>
        </div>
      </div>
    )
  },

  {
    header: t('date') || 'Date',
    accessor: 'date',
    render: (record) => (
      <div className="flex items-center gap-2 text-gray-900 dark:text-white text-[11px] font-black uppercase tracking-widest">
        <Calendar size={14} className="text-orange" />
        {formattedDate(record.check_in)}
      </div>
    )
  },

  {
    header: t('check_in'),
    accessor: 'check_in',
    render: (record) => (
      <div className="flex items-center gap-2 text-blue text-[11px] font-black uppercase tracking-widest border border-blue/20 bg-blue/5 px-3 py-1 rounded-lg w-fit">
        <Clock size={14} />
        {new Date(record.check_in).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    )
  }
];
    const handleExport = () => {
        if (!attendanceRecords || attendanceRecords.length === 0) {
            toast.error(t('no_data_to_export') || 'No data to export');
            return;
        }

        const exportColumns = [
            {
                header: 'member',
                key: 'member_name',
                render: (record) => record.member?.user?.full_name || record.user?.full_name || 'N/A'
            },
            {
                header: 'member_id',
                key: 'member_id',
                render: (record) => `MB-2026-${record.member_id?.toString().padStart(3, '0')}`
            },
            {
                header: 'date',
                key: 'date',
                render: (record) => formattedDate(record.check_in)
            },
            {
                header: 'check_in',
                key: 'check_in',
                render: (record) => new Date(record.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
        ];

        exportToCSV(
            attendanceRecords,
            exportColumns,
            `attendance_${filters.from}_to_${filters.to}`,
            t
        );
        toast.success(t('exported_successfully') || 'Exported successfully!');
    };
   

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
                            <StatsCard stat={stat} />
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
            </div>

            {/* Table */}
            <div className="glass-card p-6 overflow-hidden">
                <DataTable
                columns={columns}
                data={attendanceRecords}
                isLoading={isLoading}
                actions={false}
                title={t('attendance')}
                />

            </div>
        </div>
    );
};

export default Attendance;
