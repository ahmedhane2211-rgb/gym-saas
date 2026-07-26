import React, { useEffect, useState } from 'react';
import { Search, Globe, Moon, Sun, Bell, ChevronDown, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGetProfileQuery } from '../../auth/services/AuthSlice';
import { useGetSettingsQuery } from '../../settings/services/SettingsSlice';


const Navbar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { i18n, t } = useTranslation();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const { data } = useGetProfileQuery();
  const { data: settingsData } = useGetSettingsQuery();
  const companyLogo = settingsData?.data?.logo;

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
      <div className="flex items-center gap-4 lg:gap-12">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileOpen && setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden p-2 hover:bg-orange/10 hover:text-orange rounded-lg transition-all"
        >
          <Menu size={20} className="text-gray-600 dark:text-gray-300" />
        </button>

        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-light">
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="p-2 hover:bg-orange/10 hover:text-orange rounded-lg transition-all flex items-center gap-2"
            title="Change Language"
          >
            <Globe size={18} />
            <span className="text-[14px] hidden sm:block font-medium tracking-widest">{i18n.language === 'ar' ? 'English' : 'عربي'}</span>
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
      <div className="flex items-center gap-6 sm:block hidden">
        <div className="flex items-center gap-3 ltr:pl-6 rtl:pr-6 ltr:border-l rtl:border-r border-gray-200 dark:border-white/5 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-gray-900 dark:text-white text-xs font-bold">{data?.data?.user?.full_name}</p>
            <p className="text-gray-500 dark:text-gray-600 text-[10px] uppercase font-black tracking-widest">{data?.data?.user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 group-hover:border-orange/50 transition-colors shadow-sm">
            <img src={companyLogo || "https://api.dicebear.com/7.x/avataaars/svg?seed=Erik"} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <ChevronDown size={14} className="text-gray-400 group-hover:text-orange transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;