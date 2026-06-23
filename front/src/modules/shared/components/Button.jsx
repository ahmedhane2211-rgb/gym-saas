import React from 'react'

const Button = ({title, onClick, className, disabled, icon}) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`w-full flex items-center justify-center gap-3 rounded-xl p-4 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span style={{ fontSize: 'var(--font-size-sm)' }} className="font-black">{title}</span>
    </button>
  )
}

export default Button