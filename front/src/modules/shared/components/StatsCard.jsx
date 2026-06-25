import React, { cloneElement } from 'react'

const StatsCard = ({stat}) => {
  return (
    <>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ltr:translate-x-2 ltr:-translate-y-2 rtl:-translate-x-2 rtl:-translate-y-2">
                {cloneElement(stat.icon, { size: 64 })}
              </div>
              <p style={{fontSize:"var(--font-size-base)"}} className="text-gray-600 dark:text-gray-500 font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <p className={`text-4xl font-black ${
                                stat.color === "orange" ? "text-orange" : 
                                stat.color === "blue" ? "text-blue" : 
                                stat.color === "green" ? "text-green-500" : "text-red-500"
                            }`}>{stat.value}</p>
        </>    
  )
}

export default StatsCard