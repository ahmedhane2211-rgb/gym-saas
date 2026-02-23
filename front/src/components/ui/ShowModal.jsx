/* eslint-disable no-unused-vars */
import React from 'react'


const ShowModal = ({children, setShowModal, t,showModal,title,onClose}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-sky-bg-dark p-6 rounded-lg shadow-lg min-w-[500px]">
        <p className="text-lg text-center mb-6 font-semibold text-slate-900 dark:text-slate-100">{t(`${title}`)}</p>
            {children}
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="rounded-full bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition-colors">
            {t("cancel")}
          </button>
        </div>
        </div>
    </div>
  )
}

export default ShowModal