import React, { useContext } from 'react';
import { FileText, Calendar } from 'lucide-react';
import { LanguageContext } from '../../shared/context/LanguageContext';
import formattedDate from '../../shared/utils/formattedDate';
import AppModal from '../../shared/components/AppModal';

const ExpenseViewModal = ({ isOpen, onClose, expense }) => {
    const { t } = useContext(LanguageContext);

    if (!isOpen || !expense) return null;

    const DetailItem = ({ icon: Icon, label, value, color = "orange" }) => (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
            <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t(label)}</p>
                <p className="text-sm font-black text-gray-900 dark:text-white mt-1">{value}</p>
            </div>
        </div>
    );

    return (
        <AppModal isOpen={isOpen} onClose={onClose} title={t('expense_details')} maxWidth="max-w-2xl" showCloseFooter closeText={t('close')}>
                <div className="space-y-4">
                    <DetailItem 
                        icon={FileText}
                        label="expense_name"
                        value={expense.name}
                        color="blue"
                    />
                    <DetailItem 
                        icon={Calendar}
                        label="note"
                        value={formattedDate(expense.created_at || expense.createdAt || expense.date)}
                        color="purple"
                    />
                    {expense.note && (
                        <div className="mt-6 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('note')}</p>
                            <p className="text-sm text-gray-900 dark:text-gray-300">{expense.note}</p>
                        </div>
                    )}
                </div>
        </AppModal>
    );
};

export default ExpenseViewModal;
