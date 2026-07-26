import React from 'react'

const SectionTitle = ({title, description,t}) => {
  return (
    <div className="space-y-2">
          <h1 className="text-5xl font-black text-gray-900 dark:text-white ">
            {t(title)}
          </h1>
          <p className="text-gray-600 dark:text-gray-500 text-sm font-bold  max-w-md leading-relaxed">
            {t(description)}
          </p>
        </div>
  )
}

export default SectionTitle