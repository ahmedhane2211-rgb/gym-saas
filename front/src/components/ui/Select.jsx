import React from 'react'

const Select = ({ t, register, options,label,name,required = false}) => {
  return (
    <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t(label)}
            </label>
            <select
              {...register(name,{required})}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-emerald-900"
            >
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  { t(option?.name)}
                </option>
              ))}
            </select>
          </div>
  )
}

export default Select