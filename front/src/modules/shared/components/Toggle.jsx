import React from 'react';

const Toggle = ({ label, enabled, onChange, description }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-orange/20 transition-all group">
      <div className="flex flex-col gap-1">
        <span className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{label}</span>
        {description && <span className="text-[10px] text-gray-500 font-bold uppercase">{description}</span>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`${
          enabled ? 'bg-orange shadow-[0_0_20px_rgba(255,95,31,0.3)]' : 'bg-gray-200 dark:bg-gray-800'
        } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
      >
        <span
          className={`${
            enabled ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};

export default Toggle;
