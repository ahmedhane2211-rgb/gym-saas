import React, { useState, useEffect, useContext } from "react";
import {
  useGetInvoicesQuery,
  useAddRefundMutation,
} from "../services/InvoiceSlice";
import {
  RotateCcw,
  Search,
  User,
  Calendar,
  Hash,
  ShoppingBag,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Tag,
  Trash2,
  Receipt,
} from "lucide-react";
import { LanguageContext } from "../../shared/context/LanguageContext";
import useDebounce from "../../shared/hooks/useDebounce";
import formatNum from "../../shared/utils/formatNum";
import formattedDate from "../../shared/utils/formattedDate";
import toast from "react-hot-toast";
import Button from "../../shared/components/Button";

// 1. InvoiceDetails Component
const InvoiceDetails = ({ invoice, t }) => {
  if (!invoice) return null;
  return (
    <div className="glass-card p-6 border-l-4 border-l-blue animate-in slide-in-from-left duration-500">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2 bg-blue/5 rounded-lg text-blue">
          <Hash size={20} />
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white ">
          {t("invoice_info") || "Invoice Info"}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {t("invoice_id")}
          </p>
          <p className="text-sm font-black text-gray-900 dark:text-white ">
            #{invoice.invoice_number || invoice.id}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {t("member") || "Member"}
          </p>
          <p className="text-sm font-black text-gray-900 dark:text-white uppercase ">
            {invoice.user_name || "N/A"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {t("date")}
          </p>
          <p className="text-sm font-black text-gray-900 dark:text-white ">
            {formattedDate(invoice.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
};

// 2. RefundTable Component
const RefundTable = ({
  items,
  refundItems,
  onQuantityChange,
  onMaxClick,
  t,
}) => {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left rtl:text-right border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/5">
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {t("product")}
              </th>
              <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {t("price")}
              </th>
              <th className="px-6 py-4 text-center text-[10px] font-black text-orange-400 uppercase tracking-widest">
                {t("discount")}
              </th>
              <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {t("sold_qty") || "Sold Qty"}
              </th>
              <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {t("refunded_qty") || "Refunded"}
              </th>
              <th className="px-6 py-4 text-center text-[10px] font-black text-blue uppercase tracking-widest">
                {t("net_price") || "Net Price"}
              </th>
              <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {t("refund_qty") || "Refund Qty"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {items.map((item) => {
              const refundedSoFar = item.refunded_quantity || 0;
              const remaining = item.quantity - refundedSoFar;
              const refundValue = refundItems[item.product_id] || "";
              const isInvalid = refundValue > remaining || refundValue < 0;

              return (
                <tr
                  key={item.product_id}
                  className={`transition-colors ${isInvalid ? "bg-red-500/5" : "hover:bg-blue/5"}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <ShoppingBag size={14} className="text-blue" />
                      <span className="text-xs font-black text-gray-900 dark:text-white uppercase ">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-bold text-gray-500">
                      {item.price}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-bold text-orange">
                      {item.discount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-bold text-gray-500">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`text-xs font-bold ${refundedSoFar > 0 ? "text-orange" : "text-gray-400"}`}
                    >
                      {refundedSoFar}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-black text-blue">
                      {(item.total / item.quantity).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 w-48">
                    <div className="flex items-center gap-2 justify-center">
                      <input
                        type="number"
                        min="0"
                        max={remaining}
                        value={refundValue}
                        onChange={(e) =>
                          onQuantityChange(item.product_id, e.target.value)
                        }
                        className={`w-20 bg-white dark:bg-black border rounded-lg p-2 text-center text-xs font-black transition-all outline-none ${isInvalid ? "border-red-500 text-red-500 shadow-lg shadow-red-500/20" : "border-gray-200 dark:border-white/10 focus:border-blue"}`}
                        placeholder="0"
                      />
                      <button
                        onClick={() => onMaxClick(item.product_id, remaining)}
                        className="p-2 text-[8px] font-black uppercase tracking-widest text-blue hover:bg-blue/10 rounded-lg transition-all"
                      >
                        MAX
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 3. RefundSummary Component
const RefundSummary = ({
  itemsTotal,
  overallDiscountDeduction,
  netRefund,
  t,
}) => {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-2 bg-orange/5 rounded-lg text-orange">
          <Tag size={18} />
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white ">
          {t("refund_summary")}
        </h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {t("items_refund_total") || "Items Total"}
          </span>
          <span className="text-xs font-black  text-gray-900 dark:text-white">
            {formatNum(itemsTotal)} EGP
          </span>
        </div>
        {overallDiscountDeduction > 0 && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5 text-orange">
            <span className="text-[10px] font-black uppercase tracking-widest">
              {t("discount_deduction") || "Discount Deduction"}
            </span>
            <span className="text-xs font-black ">
              -{formatNum(overallDiscountDeduction)} EGP
            </span>
          </div>
        )}
        <div className="flex justify-between items-center py-4">
          <span className="text-[10px] font-black text-blue uppercase tracking-[0.2em] ">
            {t("net_refund") || "Net Refund"}
          </span>
          <span className="text-2xl font-black text-gray-900 dark:text-white ">
            {formatNum(netRefund)} EGP
          </span>
        </div>
      </div>
    </div>
  );
};

const RefundPage = () => {
  const { t } = useContext(LanguageContext);
  const { data: invoicesResponse, isLoading: isLoadingInvoices } =
    useGetInvoicesQuery();
  const [addRefund, { isLoading: isSubmitting }] = useAddRefundMutation();

  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [refundItems, setRefundItems] = useState({}); // { productId: quantity }
  const [reason, setReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const invoices = Array.isArray(invoicesResponse)
    ? invoicesResponse
    : invoicesResponse?.data || [];

  useEffect(() => {
    if (selectedInvoiceId) {
      const inv = invoices.find((i) => i.id === selectedInvoiceId);
      if (inv) {
        // Merge duplicate items for the UI (handles cases where same product was added multiple times)
        const mergedItems = inv.items.reduce((acc, current) => {
          const existing = acc.find(
            (item) =>
              item.product_id === (current.product_id || current.productId),
          );
          if (existing) {
            existing.quantity += Number(current.quantity);
            existing.refunded_quantity =
              Number(existing.refunded_quantity || 0) +
              Number(current.refunded_quantity || 0);
            existing.total =
              Number(existing.total || 0) +
              Number(current.total || current.price * current.quantity);
            existing.discount =
              Number(existing.discount || 0) + Number(current.discount || 0);
          } else {
            acc.push({
              ...current,
              product_id: current.product_id || current.productId,
              quantity: Number(current.quantity),
              total: Number(current.total || current.price * current.quantity),
              discount: Number(current.discount || 0),
              refunded_quantity: Number(current.refunded_quantity || 0),
            });
          }
          return acc;
        }, []);

        setSelectedInvoice({ ...inv, items: mergedItems });
      }
      setRefundItems({}); // Reset selections when switching invoices
      setReason("");
    } else {
      setSelectedInvoice(null);
    }
  }, [selectedInvoiceId, invoices]);

  const handleQuantityChange = (productId, value) => {
    setRefundItems((prev) => ({
      ...prev,
      [productId]: value === "" ? "" : parseInt(value),
    }));
  };

  const handleMaxClick = (productId, remaining) => {
    setRefundItems((prev) => ({
      ...prev,
      [productId]: remaining,
    }));
  };

  const filteredInvoices = invoices.filter((inv) => {
    const search = debouncedSearchTerm.toLowerCase();
    const number = (inv.invoice_number || inv.id).toString().toLowerCase();
    const customer = (inv.user_name || "").toLowerCase();
    return number.includes(search) || customer.includes(search);
  });

  const getSummaryValues = () => {
    if (!selectedInvoice)
      return { itemsTotal: 0, overallDiscountDeduction: 0, netRefund: 0 };

    // Sum of items net prices (after line-item discounts)
    const itemsTotal = selectedInvoice.items.reduce((acc, item) => {
      const qty = refundItems[item.product_id] || 0;
      const netPricePaid = item.total / item.quantity;
      return acc + qty * netPricePaid;
    }, 0);

    const originalSubtotal =
      selectedInvoice.total ||
      selectedInvoice.items.reduce((acc, i) => acc + i.total, 0);
    const overallDiscountRatio =
      originalSubtotal > 0
        ? (selectedInvoice.discount || 0) / originalSubtotal
        : 0;

    const overallDiscountDeduction = itemsTotal * overallDiscountRatio;
    const netRefund = itemsTotal - overallDiscountDeduction;

    return { itemsTotal, overallDiscountDeduction, netRefund };
  };

  const { itemsTotal, overallDiscountDeduction, netRefund } =
    getSummaryValues();

  const isFormValid = () => {
    const itemIds = Object.keys(refundItems);
    const hasQuantities = itemIds.some((id) => refundItems[id] > 0);
    const hasInvalid = itemIds.some((id) => {
      const item = selectedInvoice.items.find((i) => i.product_id === id);
      const remaining = item.quantity - (item.refunded_quantity || 0);
      return refundItems[id] > remaining || refundItems[id] < 0;
    });
    return hasQuantities && !hasInvalid && !isSubmitting;
  };

  const handleSubmit = async () => {
    const items = Object.keys(refundItems)
      .filter((id) => refundItems[id] > 0)
      .map((id) => ({
        product_id: id,
        quantity: refundItems[id],
      }));

    const payload = {
      invoice_id: selectedInvoice.id,
      items,
      reason,
    };

    try {
      await addRefund(payload).unwrap();
      toast.success(t("refund_success") || "Refund processed successfully!");
      setSelectedInvoiceId("");
      setSearchTerm("");
      setRefundItems({});
      setReason("");
    } catch (err) {
      toast.error(err.data?.message || "Refund failed");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue/10 rounded-2xl text-blue">
              <RotateCcw size={28} />
            </div>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest  uppercase">
              {t("sales_return_invoice")}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed ml-1">
            {t("refund_page_desc") ||
              "Process partial or full product returns for existing invoices."}
          </p>
        </div>
      </div>

      {/* Step 1: Invoice Lookup */}
      <div className="glass-card p-8 border-t-4 border-t-orange">
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex-grow space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {t("select_invoice") || "Select Invoice"}
            </label>
            <div
              className="relative"
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            >
              <Search
                className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold"
                size={18}
              />
              <input
                type="text"
                placeholder={
                  t("search_invoice_placeholder") ||
                  "Search by invoice # or customer..."
                }
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                  if (!e.target.value) {
                    setSelectedInvoiceId("");
                  }
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full bg-gray-100/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-2xl py-5 ltr:pl-14 rtl:pr-14 ltr:pr-6 rtl:pl-6 text-gray-900 dark:text-white text-sm font-black  outline-none transition-all focus:border-orange focus:ring-4 focus:ring-orange/10"
              />

              {isDropdownOpen && searchTerm && (
                <div className="absolute z-50 w-full mt-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-xl">
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((inv) => (
                      <button
                        key={inv.id}
                        onClick={() => {
                          setSelectedInvoiceId(inv.id);
                          setSearchTerm(
                            `#${inv.invoice_number || inv.id} - ${inv.user_name}`,
                          );
                          setIsDropdownOpen(false);
                        }}
                        className="w-full ltr:text-left rtl:text-right px-8 py-5 hover:bg-orange/5 border-b border-gray-100 dark:border-white/5 last:border-0 transition-all group flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-gray-100 dark:bg-white/5 rounded-lg group-hover:bg-orange/10 group-hover:text-orange transition-colors">
                              <Hash size={14} className="font-bold" />
                            </div>
                            <span className="text-sm font-black text-gray-900 dark:text-white  tracking-tighter">
                              #{inv.invoice_number || inv.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 px-1">
                            <User size={12} className="text-gray-400" />
                            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                              {inv.user_name}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {formattedDate(inv.created_at)}
                          </span>
                          <div className="px-2 py-0.5 bg-blue/5 rounded text-[8px] font-black text-blue uppercase tracking-widest  group-hover:bg-blue/10">
                            {inv.items?.length || 0} ITEMS
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-6 py-12 text-center text-gray-400 space-y-3">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Search size={20} className="opacity-20" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest">
                        {t("no_results_found") || "No matching invoices found"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {isLoadingInvoices && (
            <div className="animate-spin text-blue mb-4">
              <RotateCcw size={20} />
            </div>
          )}
        </div>
      </div>

      {selectedInvoice ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-8">
            <InvoiceDetails invoice={selectedInvoice} t={t} />

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white  ml-2">
                {t("return_items") || "Return Items"}
              </h3>
              <RefundTable
                items={selectedInvoice.items}
                refundItems={refundItems}
                onQuantityChange={handleQuantityChange}
                onMaxClick={handleMaxClick}
                t={t}
              />
            </div>

            {/* Refund Reason */}
            <div className="glass-card p-8 space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 bg-blue/5 rounded-lg text-blue">
                  <AlertCircle size={18} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white ">
                  {t("refund_reason") || "Refund Reason"}
                </h3>
              </div>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  t("refund_reason_placeholder") ||
                  "Enter why the customer is returning these items..."
                }
                className="w-full h-32 bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/5 rounded-2xl p-6 text-xs text-gray-900 dark:text-white focus:border-blue/50 outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="sticky top-8 space-y-8">
              <RefundSummary
                itemsTotal={itemsTotal}
                overallDiscountDeduction={overallDiscountDeduction}
                netRefund={netRefund}
                t={t}
              />

              <div className="px-2">
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid()}
                  className={`w-full py-6 rounded-[2rem] font-black uppercase  tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl ${isFormValid() ? "bg-gradient-to-r from-orange to-orange/80 hover:scale-[1.02] active:scale-95 text-black" : "bg-gray-200 dark:bg-white/5 text-gray-400 cursor-not-allowed grayscale"}`}
                >
                  {isSubmitting ? (
                    <RotateCcw size={20} className="animate-spin" />
                  ) : (
                    <>
                      <span>{t("process_refund") || "Process Refund"}</span>
                      <CheckCircle2 size={20} />
                    </>
                  )}
                </button>
                <p className="text-center mt-6 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                  {t("refund_disclaimer") ||
                    "Note: This action will update inventory stock levels."}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400 space-y-4">
          <Receipt size={48} className="opacity-10" />
          <p className="text-[10px] font-black uppercase tracking-widest">
            {t("no_invoice_selected") || "No invoice selected to return"}
          </p>
        </div>
      )}
    </div>
  );
};

export default RefundPage;
