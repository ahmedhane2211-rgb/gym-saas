import React, { useEffect, useState } from 'react';
import { Search, Globe, Moon, Sun, Bell, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGetProfileQuery } from '../../auth/services/AuthSlice';

const Navbar = () => {
  const { i18n, t } = useTranslation();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const { data } = useGetProfileQuery();
  // Handle Theme Toggle
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Handle Language Toggle
  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  // Update Direction on Language Change
  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Initial Theme Check
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  return (
    <header className="h-20 bg-white/50 dark:bg-black/50 backdrop-blur-md border-b border-gray-200 dark:border-white/5 sticky top-0 z-40 px-8 flex items-center justify-between transition-colors duration-300">
      {/* Search Bar & Nav */}
      <div className="flex items-center gap-12">

        {/* <div className="relative group">
          <div className="absolute inset-y-0 ltr:left-4 rtl:right-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange transition-colors">
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder={t('search_command')} 
            className="bg-gray-100 dark:bg-gray-dark/50 border border-gray-200 dark:border-white/5 rounded-xl py-2 ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 text-gray-900 dark:text-white text-xs w-64 focus:outline-none focus:border-orange/30 transition-all placeholder:text-gray-500 font-medium"
          />
        </div> */}
        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-light">
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="p-2 hover:bg-orange/10 hover:text-orange rounded-lg transition-all flex items-center gap-2"
            title="Change Language"
          >
            <Globe size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">{i18n.language === 'ar' ? 'English' : 'عربي'}</span>
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-orange/10 hover:text-orange rounded-lg transition-all"
            title="Toggle Theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="p-2 hover:bg-orange/10 hover:text-orange rounded-lg transition-all relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange rounded-full" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 ltr:pl-6 rtl:pr-6 ltr:border-l rtl:border-r border-gray-200 dark:border-white/5 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-gray-900 dark:text-white text-xs font-bold">{data?.data?.user?.full_name}</p>
            <p className="text-gray-500 dark:text-gray-600 text-[10px] uppercase font-black tracking-widest">{data?.data?.user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 group-hover:border-orange/50 transition-colors shadow-sm">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Erik" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <ChevronDown size={14} className="text-gray-400 group-hover:text-orange transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;