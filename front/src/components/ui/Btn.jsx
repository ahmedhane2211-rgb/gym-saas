import React from 'react'

const Btn = ({ title,onClick }) => {
  return (
    <button onClick={onClick} className="rounded-full bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition-colors">
        {title}
    </button>
  )
}

export default Btn