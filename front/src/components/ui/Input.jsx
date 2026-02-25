import React from 'react'

const Input = ({t,name,register,required = false,type="text",label,min,max,step,errors}) => {

  return (
    <div>
            <label className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2`}>
              {t(label) || t("add")} {required && '*'}
            </label>
            <input
              min={min}
              max={max}
              step={step}
              type={type}
              {...register(name,{required})}
              required={required}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-emerald-900"
              placeholder={`Enter ${name}`}
            />
            {errors && errors[name] && <span className="text-red-500 text-sm mt-1 block">{t('required')}</span>}
          </div>
  )
}

export default Input