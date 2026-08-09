import React from 'react'

const CheckBox = ({label, register, name, t,...props}) => {
  return (
    <div className="flex items-center space-x-3 group cursor-pointer">
        <div className="relative flex items-center">
          <input 
            type="checkbox" 
            {...register?.(name)} 
            {...props}
            className="peer h-4 w-4 appearance-none rounded-full border border-white/10 bg-[#aba094] checked:bg-orange checked:border-orange transition-all cursor-pointer" 
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100 transition-opacity">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <label className="text-gray-400 font-bold cursor-pointer group-hover:text-gray-300 transition-colors">{t(label)}</label>
    </div>
  )
}

export default CheckBox