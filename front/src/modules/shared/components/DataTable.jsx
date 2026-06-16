import React, { useContext, useRef, useState, useEffect } from 'react';
import { Edit2, Trash2, Eye, LogIn, Printer, Download, MoreVertical, Snowflake } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { exportToCSV } from '../utils/exportUtils';

const DataTable = ({ 
  columns, 
  data, 
  isLoading, 
  onEdit, 
  onDelete, 
  onView,
  onCheckIn,
  onFreeze,
  actions = true,
  title = 'Table'
}) => {
  const { t } = useContext(LanguageContext);
  const tableRef = useRef(null);
  const [activeDropdownRow, setActiveDropdownRow] = useState(null);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdownRow(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handlePrint = () => {
    const printContent = tableRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #333; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #eee; padding: 12px 15px; text-align: left; font-size: 12px; }
            th { background: #f9f9f9; text-transform: uppercase; letter-spacing: 1px; color: #666; }
            .no-print { display: none !important; }
            img { width: 40px; height: 40px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h2 style="text-transform: uppercase; letter-spacing: 2px; font-style: italic;">${title}</h2>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleExport = () => {
    exportToCSV(data, columns, title.toLowerCase().replace(/\s+/g, '_'), t);
  };

  return (
    <div className="space-y-4">
      {/* Table Tools */}
      <div className="flex justify-end gap-2">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm"
        >
          <Printer size={14} />
          {t('print') || 'Print'}
        </button>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue hover:bg-blue/5 transition-all shadow-sm"
        >
          <Download size={14} />
          {t('export_excel') || 'Export Excel'}
        </button>
      </div>

      <div className="glass-card overflow-hidden animate-in fade-in duration-500" ref={tableRef}>
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-100/50 dark:bg-white/[0.02]">
                {columns.map((col, idx) => (
                  <th 
                    key={idx} 
                    className={`px-8 py-6 text-[14px] font-black text-gray-500 dark:text-gray-light/60 uppercase tracking-[0.2em] ${col.align === 'right' ? 'text-right' : ''}`}
                  >
                    {t(col.header)}
                  </th>
                ))}
                {actions && (
                  <th className="px-8 text-center py-6 text-[14px] font-black text-gray-500 dark:text-gray-light/60 uppercase tracking-[0.2em] no-print">
                    {t('actions')}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
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
                          <span className="text-gray-900 dark:text-gray-100 font-bold text-sm">
                            {item[col.key]}
                          </span>
                        )}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-8 py-6 no-print">
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
                          {onFreeze && (
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdownRow(activeDropdownRow === item.id ? null : item.id);
                                }}
                                className="p-2 text-gray-400 hover:text-orange transition-colors"
                                title={t('options')}
                              >
                                <MoreVertical size={16} />
                              </button>
                              {activeDropdownRow === item.id && (
                                <div className="absolute ltr:right-0 rtl:left-0 mt-2 z-[90] w-48 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-xl shadow-xl py-2 animate-in fade-in slide-in-from-top-1 duration-150">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onFreeze(item);
                                      setActiveDropdownRow(null);
                                    }}
                                    className="w-full text-left rtl:text-right px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"
                                  >
                                    <Snowflake size={14} className="text-orange" />
                                    <span>{t('freeze_subscription') || 'تجميد الاشتراك'}</span>
                                  </button>
                                </div>
                              )}
                            </div>
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
    </div>
  );
};

export default DataTable;
