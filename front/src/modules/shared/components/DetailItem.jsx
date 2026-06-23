import React from 'react'

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-blue border border-gray-100 dark:border-white/5">
      {icon}
    </div>
    <div className="space-y-0.5">
      <p style={{ fontSize: 'var(--font-size-base)' }} className="font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <div style={{ fontSize: 'var(--font-size-sm)' }} className="font-medium text-gray-900 dark:text-gray-200">
        {value}
      </div>
    </div>
  </div>
);

export default DetailItem