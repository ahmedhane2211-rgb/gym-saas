import React, { useContext } from 'react';
import { Edit2, Trash2, Eye, LogIn } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

const DataTable = ({ 
  columns, 
  data, 
  isLoading, 
  onEdit, 
  onDelete, 
  onView,
  onCheckIn,
  actions = true 
}) => {
  const { t } = useContext(LanguageContext);

  return (
    <div className="glass-card overflow-hidden animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left rtl:text-right border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-100/50 dark:bg-white/[0.02]">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-8 py-6 text-[14px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-[0.2em] ${col.align === 'right' ? 'text-right' : ''}`}
                >
                  {t(col.header)}
                </th>
              ))}
              {actions && (
                <th className="px-8 text-center py-6 text-[14px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-[0.2em]">
                  {t('actions')}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/5">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="px-8 py-8">
                    <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-full" />
                  </td>
                </tr>
              ))
            ) : (
              data?.map((item, rowIdx) => (
                <tr key={item.id || rowIdx} className="hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors group">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-8 py-6 ${col.align === 'right' ? 'text-right' : ''}`}>
                      {col.render ? col.render(item) : (
                        <span className="text-gray-900 dark:text-gray-200 font-bold text-sm">
                          {item[col.key]}
                        </span>
                      )}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-3">
                        {onCheckIn && (
                          <button
                            onClick={() => onCheckIn(item)}
                            className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                            title={t('check_in')}
                          >
                            <LogIn size={16} />
                          </button>
                        )}
                        {onView && (
                          <button
                            onClick={() => onView(item)}
                            className="p-2 text-gray-400 hover:text-blue transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item.id)}
                            className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
            {!isLoading && data?.length === 0 && (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-8 py-20 text-center">
                  <p className="text-gray-400 font-black uppercase tracking-widest italic">{t('no_data') || 'No Data Found'}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
