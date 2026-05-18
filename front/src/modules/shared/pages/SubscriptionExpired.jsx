import React from 'react';
import { Mail, Phone, ArrowLeft, ShieldAlert, Sparkles, LogOut } from 'lucide-react';
import deleteToken from '../utils/deleteToken';

const SubscriptionExpired = () => {

  const handleLogout = () => {
    deleteToken();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange/5 rounded-full blur-[120px]"></div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Main Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden relative group">
          {/* Top Decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange/50 to-transparent"></div>
          
          <div className="flex flex-col items-center text-center">
            {/* Icon Header */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-orange/20 rounded-full blur-2xl group-hover:bg-orange/30 transition-all duration-500 scale-150"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-orange to-orange-600 rounded-3xl flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-2xl">
                <ShieldAlert size={48} className="text-white" />
              </div>
            </div>

            {/* Content */}
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
              انتهت <span className="text-orange italic">فترة الاشتراك.</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md mb-12 leading-relaxed">
              لقد انتهت صلاحية اشتراك النادي الخاص بك. يرجى التواصل مع الإدارة لتجديد الاشتراك والاستمرار في استخدام النظام.
            </p>

            {/* Contact Grid */}
            <div className="grid md:grid-cols-2 gap-4 w-full mb-12">
              <a 
                href="tel:01098843280"
                className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange/30 hover:bg-orange/5 transition-all group/item"
              >
                <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center text-orange group-hover/item:scale-110 transition-transform">
                  <Phone size={20} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">تواصل هاتفياً</p>
                  <p className="text-white font-bold text-lg">01098843280</p>
                </div>
              </a>

              <a 
                href="mailto:medoo1342005@gmail.com"
                className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange/30 hover:bg-orange/5 transition-all group/item"
              >
                <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center text-orange group-hover/item:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">البريد الإلكتروني</p>
                  <p className="text-white font-bold text-sm">medoo1342005@gmail.com</p>
                </div>
              </a>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-orange text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange/20 active:scale-95"
              >
                تسجيل الخروج <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Text */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-600 font-medium">
          <Sparkles size={16} className="text-orange/50" />
          <span>نحن هنا لمساعدتك في أي وقت</span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionExpired;
