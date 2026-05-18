import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Menu,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { LanguageContext } from '../../shared/context/LanguageContext';
import deleteToken from '../../shared/utils/deleteToken';

const OwnerSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { t } = useContext(LanguageContext);


  const handleLogout = () => {
    deleteToken();
  };
  const NavItem = ({ to, icon, name }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-link ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''} text-[14px]`
      }
    >
      <div className={`${isCollapsed ? 'scale-110' : ''} transition-transform`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      {!isCollapsed && <span>{name}</span>}
    </NavLink>
  );

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-72'} h-screen bg-white dark:bg-dark border-r border-gray-200 dark:border-white/5 flex flex-col fixed ltr:left-0 rtl:right-0 top-0 z-50 overflow-hidden shadow-2xl transition-all duration-300`}>
      {/* Logo & Toggle */}
      <div className={`p-8 pb-10 flex items-center ${isCollapsed ? 'justify-center px-4' : 'justify-between'} transition-all duration-300`}>
        {!isCollapsed && (
          <div className="flex flex-col items-start animate-in fade-in duration-500">
            <h1 className="text-gray-900 dark:text-white font-black tracking-widest text-2xl italic uppercase leading-none">
              SAAS <span className="text-orange block">Owner.</span>
            </h1>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} className="rtl:rotate-180" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow overflow-y-auto custom-scrollbar pb-8 px-4 space-y-2">
        <NavItem to="/owner/dashboard" icon={<LayoutDashboard />} name={t('dashboard')} />
        <NavItem to="/owner/subscriptions" icon={<Building2 />} name={t('subscriptions')} />
        {/* <NavItem to="/owner/users" icon={<Users />} name={t('users')} /> */}
        {/* <NavItem to="/owner/settings" icon={<Settings />} name={t('settings')} /> */}
      </nav>

      {/* Footer Area */}
      <div className="p-6 space-y-6">
        <div className={`pt-4 border-t border-gray-200 dark:border-white/5 ${isCollapsed ? 'px-0 flex justify-center' : ''}`}>
          <button onClick={handleLogout} className="flex items-center gap-3 cursor-pointer text-red-600 hover:text-red-900 dark:hover:text-red-500 text-[12px] font-bold uppercase tracking-widest transition-colors py-2">
            <LogOut /> {!isCollapsed && t("logout")}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default OwnerSidebar;
