import React, { useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'

const Input = ({type,placeholder,className,disabled,label,register,name,errors}) => {
  const {t} = useContext(LanguageContext)
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 dark:text-gray-light/50 tracking-[0.2em] uppercase">{t(label)}</label>
      <input 
        type={type} 
        placeholder={placeholder} 
        disabled={disabled}
        className={`w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-all focus:border-orange/50 focus:outline-none ${className}`}
        {...register(name)}
      />
      {errors && errors[name] && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors[name].message}</p>}
    </div>
  )
}

export default Input