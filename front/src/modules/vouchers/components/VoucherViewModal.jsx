import React, { useContext } from 'react';
import { DollarSign, FileText, Calendar, User } from 'lucide-react';
import { LanguageContext } from '../../shared/context/LanguageContext';
import formattedDate from '../../shared/utils/formattedDate';
import AppModal from '../../shared/components/AppModal';
import formatNum from '../../shared/utils/formatNum';

const VoucherViewModal = ({ isOpen, onClose, voucher }) => {
    const { t } = useContext(LanguageContext);

    if (!isOpen || !voucher) return null;

    const DetailItem = ({ icon: Icon, label, value, color = "blue" }) => (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
            <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="font-black text-gray-400">{t(label)}</p>
                <p className="text-sm font-black text-gray-900 dark:text-white mt-1">{value}</p>
            </div>
        </div>
    );

    const isPayment = voucher.type === 'payment';
    const borderColor = isPayment ? 'border-red-200 dark:border-red-900/30' : 'border-green-200 dark:border-green-900/30';
    const bgColor = isPayment ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20';
    const textColor = isPayment ? 'text-red-600' : 'text-green-600';
    const dotColor = isPayment ? 'orange' : 'blue';

    return (
        <AppModal isOpen={isOpen} onClose={onClose} title={t('voucher_details')} maxWidth="max-w-2xl" showCloseFooter closeText={t('close')}>
                <div className="space-y-6">
                    {/* Type Badge */}
                    <div className={`p-4 rounded-xl ${bgColor} border ${borderColor} flex items-center gap-3`}>
                        <div className={`p-2 rounded-lg ${bgColor} ${textColor}`}>
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className={`font-black ${textColor}`}>
                                {t('voucher_type')}
                            </p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                {isPayment ? t('payment_voucher') : t('receipt_voucher')}
                            </p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-4">
                        {isPayment ? (
                            <>
                                <DetailItem 
                                    icon={FileText}
                                    label="select_expense"
                                    value={voucher.expense_name || voucher.expenseName || '—'}
                                    color={dotColor}
                                />
                                {voucher.expense && (
                                    <DetailItem 
                                        icon={DollarSign}
                                        label="expense_amount"
                                        value={`${voucher.expense.amount} EGP`}
                                        color="green"
                                    />
                                )}
                            </>
                        ) : (
                            <DetailItem 
                                icon={FileText}
                                label="revenue_name"
                                value={voucher.revenue_name || '—'}
                                color={dotColor}
                            />
                        )}
                        
                        <DetailItem 
                            icon={DollarSign}
                            label="amount"
                            value={`${formatNum(voucher.amount)} EGP`}
                            color="green"
                        />

                        <DetailItem 
                            icon={Calendar}
                            label="date"
                            value={formattedDate(voucher.date)}
                            color="purple"
                        />

                        {voucher.customer && (
                            <DetailItem 
                                icon={User}
                                label="customer"
                                value={voucher.customer.fullName || voucher.customer.full_name || '—'}
                                color="blue"
                            />
                        )}
                    </div>

                    {/* Note */}
                    {voucher.note && (
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('note')}</p>
                            <p className="text-sm text-gray-900 dark:text-gray-300">{voucher.note}</p>
                        </div>
                    )}
                </div>
        </AppModal>
    );
};

export default VoucherViewModal;
