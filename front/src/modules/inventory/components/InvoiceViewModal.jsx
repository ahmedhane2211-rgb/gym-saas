import React, { useContext, useRef } from 'react';
import { X, Printer, Receipt, User, Calendar, Hash, Tag, DollarSign, ShoppingBag } from 'lucide-react';
import { LanguageContext } from '../../shared/context/LanguageContext';
import DetailItem from '../../shared/components/DetailItem';
import formattedDate from '../../shared/utils/formattedDate';

const InvoiceViewModal = ({ isOpen, onClose, invoice }) => {
    const { t } = useContext(LanguageContext);
    const printRef = useRef();

    if (!isOpen || !invoice) return null;

    const refundTotal = invoice.refund_total || (invoice.items?.reduce((acc, item) => acc + ((item.refunded_quantity || 0) * item.price), 0) || 0);

    const handlePrint = () => {
        const printContent = printRef.current;
        const windowUrl = 'about:blank';
        const uniqueName = new Date();
        const windowName = 'Print' + uniqueName.getTime();
        const printWindow = window.open(windowUrl, windowName, 'left=500,top=500,width=900,height=900');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice #${invoice.id}</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    <style>
                        @media print {
                            .no-print { display: none; }
                            body { font-family: sans-serif; padding: 20px; }
                        }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                    <script>
                        setTimeout(() => {
                            window.print();
                            window.close();
                        }, 500);
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue/10 rounded-2xl text-blue">
                            <Receipt size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-widest">{t('invoice_details')}</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">#{invoice.invoice_number || invoice.id}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="p-3 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-blue hover:text-black transition-all"
                        >
                            <Printer size={20} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-3 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-xl hover:text-red-500 transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Printable Content */}
                <div ref={printRef} className="overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    {/* Top Info */}
                    <div className="grid grid-cols-2 gap-8">
                        <DetailItem icon={<User size={16} />} label={t('customer')} value={invoice?.user_name || 'N/A'} />
                        <DetailItem icon={<Calendar size={16} />} label={t('date')} value={formattedDate(invoice.created_at)} />
                        <DetailItem icon={<Hash size={16} />} label={t('status')} value={t(invoice.status)} />
                    </div>

                    {/* Items Table */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('invoice_items')}</h3>
                        <div className="rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                            <table className="w-full text-xs">
                                <thead className="bg-gray-50 dark:bg-white/5 font-black uppercase text-gray-500">
                                    <tr>
                                        <th className="p-4 text-left">{t('product')}</th>
                                        <th className="p-4 text-center">{t('price')}</th>
                                        <th className="p-4 text-center">{t('quantity')}</th>
                                        {invoice.items?.some(i => i.refunded_quantity > 0) && (
                                            <th className="p-4 text-center text-orange">{t('refunded')}</th>
                                        )}
                                        <th className="p-4 text-right">{t('total')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    {(invoice.items || []).map((item, idx) => (
                                        <tr key={idx} className="dark:text-white">
                                            <td className="p-4 flex items-center gap-2">
                                                <ShoppingBag size={12} className="text-blue" />
                                                <span className="font-bold uppercase tracking-tight">{item.product?.name || item.name || 'Unknown Product'}</span>
                                            </td>
                                            <td className="p-4 text-center font-bold">{item.price} EGP</td>
                                            <td className="p-4 text-center">
                                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/10 rounded">{item.quantity}</span>
                                            </td>
                                            {invoice.items?.some(i => i.refunded_quantity > 0) && (
                                                <td className="p-4 text-center">
                                                    {item.refunded_quantity > 0 ? (
                                                        <span className="px-2 py-0.5 bg-orange/10 text-orange rounded font-bold">
                                                            -{item.refunded_quantity}
                                                        </span>
                                                    ) : '-'}
                                                </td>
                                            )}
                                            <td className="p-4 text-right font-black italic">
                                                <div className={item.refunded_quantity === item.quantity ? 'line-through text-gray-400' : ''}>
                                                    {((item.quantity - (item.refunded_quantity || 0)) * item.price).toFixed(2)} EGP
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Totals Summary */}
                    <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span className="font-bold uppercase tracking-widest">{t('subtotal')}</span>
                                <span className="font-black italic">{invoice.total} EGP</span>
                            </div>
                            <div className="flex justify-between text-xs text-orange">
                                <span className="font-bold uppercase tracking-widest">{t('discount')}</span>
                                <span className="font-black italic">- {invoice.discount} EGP</span>
                            </div>
                            {refundTotal > 0 && (
                                <div className="flex justify-between text-xs text-red-500 font-bold border-t border-dashed border-gray-200 dark:border-white/5 pt-2">
                                    <span className="uppercase tracking-widest">{t('total_refund')}</span>
                                    <span className="italic">- {refundTotal} EGP</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue italic">{t('remaining_balance') || t('final_total')}</span>
                                <span className="text-2xl font-black text-gray-900 dark:text-white italic">
                                    {invoice.final_total - refundTotal} EGP
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-gray-100 dark:border-white/5 pt-0">
                    <button
                        onClick={onClose}
                        className="w-full py-5 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:text-red-500 transition-all mt-8"
                    >
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceViewModal;
