import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  UserCheck,
  CreditCard,
  Settings,
  HelpCircle,
  Plus,
  ChevronDown,
  ChevronRight,
  Banknote,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  FileText,
  FileClock,
  ScrollText,
  ClipboardCheck,
  ShieldCheck,
  ChevronLeft,
  Menu,
  ShoppingBag,
  MapPin,
  LogOut,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import deleteToken from '../utils/deleteToken';
import { useGetSettingsQuery } from '../../settings/services/SettingsSlice';


const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { t } = useContext(LanguageContext);
  const { data: settingsData } = useGetSettingsQuery();
  const companyName = settingsData?.data?.company_name || 'GYM';
  const companyLogo = settingsData?.data?.logo;
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('people');

  const toggleModule = (module) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setActiveModule(module);
    } else {
      setActiveModule(prev => prev === module ? null : module);
    }
  };

  const NavItem = ({ to, icon, name, subItem = false }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-link ${isActive ? 'active' : ''} ${subItem ? 'ltr:pl-14 rtl:pr-14 py-2.5 opacity-80 hover:opacity-100 text-[13px]' : 'text-[14px]'} ${isCollapsed && !subItem ? 'justify-center px-0' : ''}`
      }
    >
      <div className={`${isCollapsed && !subItem ? 'scale-110' : ''} transition-transform`}>
        {React.cloneElement(icon, { size: subItem ? 16 : 20 })}
      </div>
      {!isCollapsed && <span>{name}</span>}
      {isCollapsed && subItem && <span>{name}</span>}
    </NavLink>
  );

  const ModuleHeader = ({ id, name, icon, isOpen }) => (
    <button
      onClick={() => toggleModule(id)}
      className={`w-full flex items-center justify-between px-6 py-4 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all group ${isCollapsed ? 'px-0 justify-center' : ''}`}
    >
      <div className={`flex items-center gap-3 ${isCollapsed ? 'gap-0' : ''}`}>
        <div className={`p-2 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] group-hover:bg-orange/10 group-hover:border-orange/20 transition-all ${isOpen && !isCollapsed ? 'text-orange border-orange/20 bg-orange/10 scale-110' : ''}`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        {!isCollapsed && <span className="text-[12px] font-black uppercase tracking-[0.2em]">{name}</span>}
      </div>
      {!isCollapsed && (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
    </button>
  );

  const handleLogout = () => {
    deleteToken();
  };
  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-72'} h-screen bg-white dark:bg-dark border-r border-gray-200 dark:border-white/5 flex flex-col fixed ltr:left-0 rtl:right-0 top-0 z-50 overflow-hidden shadow-2xl transition-all duration-300`}>
      {/* Logo & Toggle */}
      <div className={`p-8 pb-10 flex items-center ${isCollapsed ? 'justify-center px-4' : 'justify-between'} transition-all duration-300`}>
        {!isCollapsed && (
          <div className="flex flex-col items-start animate-in fade-in duration-500">
            <h1 className="text-gray-900 dark:text-white font-black tracking-widest text-2xl italic uppercase leading-none">
              {companyName.split(' ')[0]} <span className="text-orange block">{companyName.split(' ').slice(1).join(' ')}</span>
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
        <NavItem to="/dashboard" icon={<LayoutDashboard />} name={t('dashboard')} />

        <div className="pt-4">
          <ModuleHeader id="people" name={t('community')} icon={<Users />} isOpen={activeModule === 'people'} />
          {activeModule === 'people' && !isCollapsed && (
            <div className="animate-in slide-in-from-top-2 fade-in duration-300 space-y-1">
              <NavItem to="/users" icon={<ShieldCheck />} name={t('users')} subItem />
              <NavItem to="/members" icon={<Dumbbell />} name={t('members')} subItem />
              <NavItem to="/coaches" icon={<UserCheck />} name={t('coaches')} subItem />
            </div>
          )}
        </div>

        <div>
          <ModuleHeader id="operations" name={t('operations')} icon={<Settings />} isOpen={activeModule === 'operations'} />
          {activeModule === 'operations' && !isCollapsed && (
            <div className="animate-in slide-in-from-top-2 fade-in duration-300 space-y-1">
              <NavItem to="/plans" icon={<ScrollText />} name={t('plans')} subItem />
              <NavItem to="/features" icon={<Sparkles />} name={t('features')} subItem />
              <NavItem to="/attendance" icon={<ClipboardCheck />} name={t('attendance')} subItem />
              <NavItem to="/branches" icon={<MapPin />} name={t('branches')} subItem />
            </div>
          )}
        </div>

        <div>
          <ModuleHeader id="inventory" name={t('inventory')} icon={<Banknote />} isOpen={activeModule === 'inventory'} />
          {activeModule === 'inventory' && !isCollapsed && (
            <div className="animate-in slide-in-from-top-2 fade-in duration-300 space-y-1">
              <NavItem to="/products" icon={<ShoppingBag />} name={t('products')} subItem />
              <NavItem to="/sales-invoice" icon={<FileText />} name={t('sales_invoice')} subItem />
              <NavItem to="/sales-report" icon={<TrendingUp />} name={t('sales_report')} subItem />
              <NavItem to="/sales-return-invoice" icon={<FileClock />} name={t('return_invoice')} subItem />
            </div>
          )}
        </div>
        <div>
          <ModuleHeader id="financials" name={t('financials')} icon={<Banknote />} isOpen={activeModule === 'financials'} />
          {activeModule === 'financials' && !isCollapsed && (
            <div className="animate-in slide-in-from-top-2 fade-in duration-300 space-y-1">
              {/* <NavItem to="/expenses" icon={<ArrowUpCircle />} name={t('expenses')} subItem />
              <NavItem to="/income" icon={<ArrowDownCircle />} name={t('income')} subItem /> */}
              <NavItem to="/cash-day" icon={<Wallet />} name={t('cash_day')} subItem />
            </div>
          )}
        </div>
        {/* <NavItem to="/settings" icon={<Settings />} name={t('settings')} /> */}
      </nav>

      {/* Footer Area */}
      <div className="p-6 space-y-6">
        <div className={`pt-4 border-t border-gray-200 dark:border-white/5 ${isCollapsed ? 'px-0 flex items-center  flex-col' : 'items-start'}`}>
          <button onClick={handleLogout} className="flex items-center gap-3 cursor-pointer text-red-600 hover:text-red-900 dark:hover:text-red-500 text-[12px] font-bold uppercase tracking-widest transition-colors py-2">
            <LogOut /> {!isCollapsed && t("logout")}
          </button>
          <button onClick={() => {navigate("/settings")}} className="flex items-center gap-3 cursor-pointer text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white text-[12px] font-bold uppercase tracking-widest transition-colors py-2">
            <Settings size={18} />
            {!isCollapsed && <span>{t("settings")}</span>}
          </button>
          <NavLink to="#" className="flex items-center gap-3 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white text-[12px] font-bold uppercase tracking-widest transition-colors py-2">
            <HelpCircle size={18} />
            {!isCollapsed && <span>{t("help_center")}</span>}
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;