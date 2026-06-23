import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const VoucherTypeToggle = ({ value, onChange }) => {
  const { t } = useContext(LanguageContext);

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 dark:text-gray-light/50 tracking-[0.2em] uppercase px-1">
        {t('voucher_type')}
      </label>
      
      <div className="flex gap-4">
        {/* Payment Voucher Option */}
        <label className="flex items-center gap-3 cursor-pointer flex-1 group">
          <div className="relative flex items-center">
            <input 
              type="radio"
              name="voucherType"
              value="payment"
              checked={value === 'payment'}
              onChange={(e) => onChange(e.target.value)}
              className="peer h-5 w-5 appearance-none rounded-full border border-white/10 bg-black checked:bg-red-500 checked:border-red-500 transition-all cursor-pointer"
            />
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100 transition-opacity">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-red-500 transition-colors">
              {t('payment_voucher')}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">{t('select_expense')}</p>
          </div>
        </label>

        {/* Receipt Voucher Option */}
        <label className="flex items-center gap-3 cursor-pointer flex-1 group">
          <div className="relative flex items-center">
            <input 
              type="radio"
              name="voucherType"
              value="receipt"
              checked={value === 'receipt'}
              onChange={(e) => onChange(e.target.value)}
              className="peer h-5 w-5 appearance-none rounded-full border border-white/10 bg-black checked:bg-green-500 checked:border-green-500 transition-all cursor-pointer"
            />
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100 transition-opacity">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-green-500 transition-colors">
              {t('receipt_voucher')}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">{t('revenue_name')}</p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default VoucherTypeToggle;
