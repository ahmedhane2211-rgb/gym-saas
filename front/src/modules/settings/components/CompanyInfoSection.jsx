import { Building2, CreditCard, FileText, Globe, Hash, Mail, MapPin, Phone } from 'lucide-react'
import React from 'react'

const CompanyInfoSection = ({ register, t }) => {
  return (
    <section className="space-y-6">
          <div className="flex items-center gap-3 text-orange">
            <Building2 size={24} />
            <h2 className="text-xl font-black uppercase tracking-widest italic">{t('company_information')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('company_name')}</label>
              <div className="relative group">
                <Building2 className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange transition-colors" size={18} />
                <input
                  {...register('company_name')}
                  placeholder={t('company_name')}
                  className="w-full bg-gray-50 dark:bg-gray-dark/30 border border-gray-200 dark:border-white/5 rounded-xl py-4 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-orange/20 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('company_email')}</label>
              <div className="relative group">
                <Mail className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange transition-colors" size={18} />
                <input
                  {...register('company_email')}
                  placeholder={t('company_email')}
                  className="w-full bg-gray-50 dark:bg-gray-dark/30 border border-gray-200 dark:border-white/5 rounded-xl py-4 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-orange/20 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('company_phone')}</label>
              <div className="relative group">
                <Phone className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange transition-colors" size={18} />
                <input
                  {...register('company_phone')}
                  placeholder={t('company_phone')}
                  className="w-full bg-gray-50 dark:bg-gray-dark/30 border border-gray-200 dark:border-white/5 rounded-xl py-4 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-orange/20 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('whatsapp')}</label>
              <div className="relative group">
                <Phone className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange transition-colors" size={18} />
                <input
                  {...register('whatsapp')}
                  placeholder={t('whatsapp')}
                  className="w-full bg-gray-50 dark:bg-gray-dark/30 border border-gray-200 dark:border-white/5 rounded-xl py-4 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-orange/20 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('website')}</label>
              <div className="relative group">
                <Globe className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange transition-colors" size={18} />
                <input
                  {...register('website')}
                  placeholder={t('website')}
                  className="w-full bg-gray-50 dark:bg-gray-dark/30 border border-gray-200 dark:border-white/5 rounded-xl py-4 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-orange/20 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('tax_number')}</label>
              <div className="relative group">
                <Hash className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange transition-colors" size={18} />
                <input
                  {...register('tax_number')}
                  placeholder={t('tax_number')}
                  className="w-full bg-gray-50 dark:bg-gray-dark/30 border border-gray-200 dark:border-white/5 rounded-xl py-4 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-orange/20 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('commercial_registry')}</label>
              <div className="relative group">
                <FileText className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange transition-colors" size={18} />
                <input
                  {...register('commercial_registry')}
                  placeholder={t('commercial_registry')}
                  className="w-full bg-gray-50 dark:bg-gray-dark/30 border border-gray-200 dark:border-white/5 rounded-xl py-4 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-orange/20 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('bank_account')}</label>
              <div className="relative group">
                <CreditCard className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange transition-colors" size={18} />
                <input
                  {...register('bank_account')}
                  placeholder={t('bank_account')}
                  className="w-full bg-gray-50 dark:bg-gray-dark/30 border border-gray-200 dark:border-white/5 rounded-xl py-4 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-orange/20 transition-all font-bold"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('address')}</label>
              <div className="relative group">
                <MapPin className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange transition-colors" size={18} />
                <input
                  {...register('address')}
                  placeholder={t('address')}
                  className="w-full bg-gray-50 dark:bg-gray-dark/30 border border-gray-200 dark:border-white/5 rounded-xl py-4 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-orange/20 transition-all font-bold"
                />
              </div>
            </div>
          </div>
        </section>
  )
}

export default CompanyInfoSection