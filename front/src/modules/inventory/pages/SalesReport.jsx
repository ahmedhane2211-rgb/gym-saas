import React, { useContext, useState } from 'react';
import { useGetInvoicesQuery } from '../services/InvoiceSlice';
import { FileText, Eye, Printer, Calendar, TrendingUp, DollarSign, Package } from 'lucide-react';
import { LanguageContext } from '../../shared/context/LanguageContext';
import DataTable from '../../shared/components/DataTable';
import InvoiceViewModal from '../components/InvoiceViewModal';
import formattedDate from '../../shared/utils/formattedDate';
import formatNum from '../../shared/utils/formatNum';
import SearchFilter from '../../shared/components/SearchFilter';
import StatsCard from '../../shared/components/StatsCard';

const SalesReport = () => {
    const { t } = useContext(LanguageContext);
    const { data: response, isLoading } = useGetInvoicesQuery();
    const invoices = Array.isArray(response) ? response : (response?.data || []);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingInvoice, setViewingInvoice] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredInvoices = invoices.filter(inv => {
        const search = searchTerm.toLowerCase();
        return (
            (inv.invoice_number || inv.id).toString().toLowerCase().includes(search) ||
            (inv.user_name || '').toLowerCase().includes(search)
        );
    });

    const columns = [
        {
            header: 'invoice_id',
            render: (inv) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue/10 text-blue rounded-lg">
                        <FileText size={16} />
                    </div>
                    <span className="font-black italic text-gray-900 dark:text-gray-100">#{inv.invoice_number || inv.id}</span>
                </div>
            )
        },
        {
            header: 'customer',
            render: (inv) => (
                <span className="font-bold text-gray-700 dark:text-gray-400 uppercase tracking-tight">
                    {inv?.user_name || 'N/A'}
                </span>
            )
        },
        {
            header: 'invoice_date',
            render: (inv) => (
                <div className="flex items-center gap-2 text-gray-500">
                    <Calendar size={14} />
                    <span className="text-xs font-bold">{formattedDate(inv.created_at)}</span>
                </div>
            )
        },
        {
            header: 'final_total',
            render: (inv) => (
                <div className="font-black text-blue italic">
                    {formatNum(inv.final_total)} EGP
                </div>
            )
        },
        {
            header: 'status',
            render: (inv) => {
                const statusStyles = {
                    completed: 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400',
                    partially_refunded: 'bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
                    fully_refunded: 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${statusStyles[inv.status] || 'bg-gray-100 text-gray-500'}`}>
                        {t(inv.status)}
                    </span>
                );
            }
        }
    ];
    const totalCompletedInvoices = invoices.filter(inv => inv.status !== 'cancelled');
    const totalSales = totalCompletedInvoices.reduce(
        (acc, inv) => acc + (Number(inv.final_total) - Number(inv.refund_total || 0)),
        0
    );
    const stats = [
        { label: t('total_sales') || 'Total Sales', value: formatNum(totalSales) + ' EGP', icon: <TrendingUp className="text-green-500" />, color: 'green' },
        { label: t('total_invoices') || 'Total Invoices', value: invoices.length, icon: <Package className="text-blue" />, color: 'blue' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
             {/* Header */}
             <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest italic uppercase">{t('sales_report')}</h1>
                    <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed">
                        {t('sales_report_desc') || 'Monitor and analyze your detailed sales history and revenue performance.'}
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

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <SearchFilter onSearch={setSearchTerm} placeholder={t('search_invoices') || 'Search invoices...'} />
            </div>

            <DataTable 
                columns={columns}
                data={filteredInvoices}
                isLoading={isLoading}
                onView={(inv) => { setViewingInvoice(inv); setIsViewModalOpen(true); }}
                title={t('sales_report')}
            />


            <InvoiceViewModal 
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                invoice={viewingInvoice}
            />
        </div>
    );
};

export default SalesReport;
