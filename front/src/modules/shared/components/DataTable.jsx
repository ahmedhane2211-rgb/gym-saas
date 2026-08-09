import React, { useContext, useRef, useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Eye,
  LogIn,
  Printer,
  Download,
  MoreVertical,
  Snowflake,
  RefreshCw,
} from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";
import { exportToCSV } from "../utils/exportUtils";
import { useGetSettingsQuery } from "../../settings/services/SettingsSlice";

const DataTable = ({
  columns,
  data,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onCheckIn,
  onFreeze,
  onRenew,
  actions = true,
  title = "Table",
  exportColumns,
}) => {
  const { t, i18n } = useContext(LanguageContext);
  const tableRef = useRef(null);
  const [activeDropdownRow, setActiveDropdownRow] = useState(null);
  const { data: settings } = useGetSettingsQuery();
  const settingsData = settings?.data;
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdownRow(null);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const isRtl = i18n.language === "ar";
  const handlePrint = () => {
    const printContent = tableRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    console.log("settingsData:", settingsData); // ← أضف ده
    console.log("show_logo:", settingsData?.show_logo_in_header);
    console.log("logo:", settingsData?.logo);
    const headerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:24px; padding-bottom:16px; border-bottom:2px solid #eee;">
      ${
        settingsData?.show_logo_in_header && settingsData?.logo
          ? `<img src="${settingsData.logo}" style="width:60px; height:60px; object-fit:contain;" />`
          : ""
      }
        ${
          settingsData?.show_name_in_header && settingsData?.company_name
            ? `<h1 style="margin:0; font-size:20px; font-weight:900; letter-spacing:2px;">${settingsData.company_name}</h1>`
            : ""
        }
          ${
            settingsData?.show_address_in_header && settingsData?.address
              ? `<p style="margin:4px 0 0; font-size:12px; color:#666;">${settingsData.address}</p>`
              : ""
          }
    </div>
  `;

    const footerItems = [
      settingsData?.show_phone_in_footer &&
        settingsData?.company_phone && {
          label: t("phone"),
          value: settingsData.company_phone,
        },
      settingsData?.show_email_in_footer &&
        settingsData?.company_email && {
          label: t("email"),
          value: settingsData.company_email,
        },
      settingsData?.show_whatsapp_in_footer &&
        settingsData?.whatsapp && {
          label: t("whatsapp"),
          value: settingsData.whatsapp,
        },
      settingsData?.show_website_in_footer &&
        settingsData?.website && {
          label: t("website"),
          value: settingsData.website,
        },
      settingsData?.show_tax_in_footer &&
        settingsData?.tax_number && {
          label: t("tax_no"),
          value: settingsData.tax_number,
        },
      settingsData?.show_bank_account_in_footer &&
        settingsData?.bank_account && {
          label: t("bank_account"),
          value: settingsData.bank_account,
        },
    ].filter(Boolean);

    // تقسيم الـ items على rows كل row 3 columns
    const footerRows = [];
    for (let i = 0; i < footerItems.length; i += 3) {
      footerRows.push(footerItems.slice(i, i + 3));
    }

    const footerHTML =
      footerRows.length > 0
        ? `
    <div style="margin-top:24px; padding-top:16px; border-top:2px solid #eee;">
      ${footerRows
        .map(
          (row) => `
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-bottom:8px;">
          ${row
            .map(
              (item) => `
            <div dir=${isRtl ? "rtl" : "ltr"}>
              <p style="font-size:10px; color:#000; letter-spacing:1px;">${item.label}: ${item.value}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      `,
        )
        .join("")}
      ${
        settingsData?.show_stamp_in_footer && settingsData?.stamp
          ? `<div style="margin-top:12px;"><img src="${settingsData.stamp}" style="width:80px; height:80px; object-fit:contain; opacity:0.8;" /></div>`
          : ""
      }
    </div>
  `
        : "";

    printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: sans-serif; padding: 20px; color: #333; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #eee; padding: 12px 15px; text-align: left; font-size: 12px; }
          th { background: #f9f9f9;  letter-spacing: 1px; color: #666; }
          .no-print { display: none !important; }
          tbody img { display: none !important; }
        </style>
      </head>
      <body>
        ${headerHTML}
        <h2 style=" letter-spacing:2px; font-style:; margin-bottom:16px;">${title}</h2>
        ${printContent}
        ${footerHTML}
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
    exportToCSV(
      data,
      exportColumns || columns,
      title.toLowerCase().replace(/\s+/g, "_"),
      t,
    );
  };

  return (
    <div className="space-y-4">
      {/* Table Tools */}
      <div className="flex justify-end gap-2">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-black  tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm"
        >
          <Printer size={14} />
          {t("print") || "Print"}
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-black  tracking-widest text-blue hover:bg-blue/5 transition-all shadow-sm"
        >
          <Download size={14} />
          {t("export_excel") || "Export Excel"}
        </button>
      </div>

      <div
        
        className="glass-card overflow-hidden animate-in fade-in duration-500"
        ref={tableRef}
      >
        <div style={{ direction: isRtl ? "rtl" : "ltr" }} className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-100/50 dark:bg-white/[0.02]">
                <th
                  style={{ fontSize: "var(--font-size-base)" }}
                  className={`px-8 py-6 font-bold text-gray-500 dark:text-gray-light/60  tracking-[0.2em]`}
                >
                  {t("serial")}
                </th>
                {columns.map((col, idx) => (
                  <th
                    style={{ fontSize: "var(--font-size-base)" }}
                    key={idx}
                    className={`px-8 font-bold py-6 text-gray-500 dark:text-gray-light/60 tracking-[0.2em] ${col.align === "right" ? "text-right" : ""}`}
                  >
                    {t(col.header)}
                  </th>
                ))}
                {actions && (
                  <th
                    style={{ fontSize: "var(--font-size-base)" }}
                    className="px-8 text-center py-6 font-black text-gray-500 dark:text-gray-light/60 tracking-[0.2em] no-print"
                  >
                    {t("actions")}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td
                        colSpan={columns.length + (actions ? 1 : 0)}
                        className="px-8 py-8"
                      >
                        <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-full" />
                      </td>
                    </tr>
                  ))
                : data?.map((item, rowIdx) => (
                    <tr
                      key={item.id || rowIdx}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors group"
                    >
                      <td
                        style={{ fontSize: "var(--font-size-sm)" }}
                        className={`px-8 py-6 font-black text-gray-500 dark:text-gray-light/60  tracking-[0.2em]`}
                      >
                        {rowIdx + 1}
                      </td>
                      {columns.map((col, colIdx) => (
                        <td
                          key={colIdx} style={{ fontSize: "var(--font-size-sm)" }}
                          className={`px-8 py-6  text-xs ${col.align === "right" ? "text-right" : ""}`}
                        >
                          {col.render ? (
                            col.render(item)
                          ) : (
                            <span style={{ fontSize: "var(--font-size-sm)" }} className="text-gray-900 dark:text-gray-100 font-normal">
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
                                title={t("check_in")}
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
                                    setActiveDropdownRow(
                                      activeDropdownRow === item.id
                                        ? null
                                        : item.id,
                                    );
                                  }}
                                  className="p-2 text-gray-400 hover:text-orange transition-colors"
                                  title={t("options")}
                                >
                                  <MoreVertical size={16} />
                                </button>
                                {activeDropdownRow === item.id && (
                                  <div className="absolute ltr:right-0 rtl:left-0 mt-2 z-[90] w-48 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-xl shadow-xl py-2 animate-in fade-in slide-in-from-top-1 duration-150">
                                    {onRenew && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onRenew(item);
                                          setActiveDropdownRow(null);
                                        }}
                                        className="w-full text-left rtl:text-right px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"
                                      >
                                        <RefreshCw
                                          size={14}
                                          className="text-blue"
                                        />
                                        <span>
                                          {t("renew_subscription") ||
                                            "تجديد الاشتراك"}
                                        </span>
                                      </button>
                                    )}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onFreeze(item);
                                        setActiveDropdownRow(null);
                                      }}
                                      className="w-full text-left rtl:text-right px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"
                                    >
                                      <Snowflake
                                        size={14}
                                        className="text-orange"
                                      />
                                      <span>
                                        {t("freeze_subscription") ||
                                          "تجميد الاشتراك"}
                                      </span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
              {!isLoading && data?.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-8 py-20 text-center"
                  >
                    <p className="text-gray-400 font-black  tracking-widest ">
                      {t("no_data") || "No Data Found"}
                    </p>
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
