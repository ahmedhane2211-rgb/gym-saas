import React, { useContext, useState } from 'react';
import { useGetVouchersQuery, useAddVoucherMutation, useUpdateVoucherMutation, useDeleteVoucherMutation } from '../services/VoucherSlice';
import { Banknote, Plus, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { LanguageContext } from '../../shared/context/LanguageContext';
import formattedDate from '../../shared/utils/formattedDate';
import VoucherModal from '../components/VoucherModal';
import VoucherViewModal from '../components/VoucherViewModal';
import DataTable from '../../shared/components/DataTable';
import SearchFilter from '../../shared/components/SearchFilter';
import useFilter from '../../shared/hooks/useFilter';

const Voucher = () => {
    const { t,i18n } = useContext(LanguageContext);
    const { data: response, isLoading } = useGetVouchersQuery();
    const vouchers = Array.isArray(response) ? response : (response?.data || []);
    const searchInputRef = React.useRef(null);
    const [addVoucher, { isLoading: isAdding }] = useAddVoucherMutation();
    const [updateVoucher, { isLoading: isUpdating }] = useUpdateVoucherMutation();
    const [deleteVoucher] = useDeleteVoucherMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [viewingVoucher, setViewingVoucher] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVouchers = useFilter(vouchers, searchTerm, ['type', 'note']);

    const handleAddClick = () => {
        setEditingVoucher(null);
        setIsModalOpen(true);
    };

    // const handleEditClick = (voucher) => {
    //     setEditingVoucher(voucher);
    //     setIsModalOpen(true);
    // };

    const handleSubmit = async (data) => {
        try {
            if (editingVoucher) {
                await updateVoucher({ 
                    id: editingVoucher.id, 
                    body: data 
                }).unwrap();
                toast.success(t('update_success'));
            } else {
                await addVoucher(data).unwrap();
                toast.success(t('add_success'));
            }
            setIsModalOpen(false);
            setEditingVoucher(null);
        } catch (err) {
            toast.error(err.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('confirm_delete'))) {
            try {
                await deleteVoucher(id).unwrap();
                toast.success(t('delete_success'));
            } catch (err) {
                toast.error(err.data?.message || 'Delete failed');
            }
        }
    };

    const columns = [
        {
            header: 'voucher_type',
            render: (voucher) => (
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                        voucher.type === 'payment' 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600' 
                            : 'bg-green-100 dark:bg-green-900/30 text-green-600'
                    }`}>
                        {voucher.type === 'payment' ? t('payment_voucher') : t('receipt_voucher')}
                    </span>
                </div>
            )
        },
        
        {
            header: 'amount',
            render: (voucher) => (
                <span className={`font-black text-lg ${voucher.type === 'payment' ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500'}`}>
                    {voucher.amount} EGP
                </span>
            )
        },
        {
            header: 'date',
            render: (voucher) => (
                <span className="text-gray-600 dark:text-gray-400 font-bold text-sm">
                    {formattedDate(voucher.date)}
                </span>
            )
        },
        {
            header: 'description',
            render: (voucher) => (
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                    {voucher.type === 'payment' 
                        ? (voucher.expense?.name || voucher.expenseName || '—')
                        : (voucher.revenueName || '—')}
                </span>
            )
        },
    ];

    const isArabic = i18n.language === "ar";

return (
  <div dir={isArabic ? "rtl" : "ltr"} className="space-y-6">
    {/* Header */}
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white italic uppercase tracking-widest flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue/10 text-blue">
            <Banknote size={28} />
          </div>
          {t("vouchers")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("manage_vouchers")}
        </p>
      </div>
    </div>

    {/* Search and Add */}
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <SearchFilter
        ref={searchInputRef}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        placeholder={t("search_voucher")}
      />

      <button
        onClick={handleAddClick}
        className="btn-blue flex items-center gap-2 h-14 px-8 shadow-lg font-main w-full md:w-auto"
      >
        <Plus size={18} />
        <span>{t("add_new")}</span>
      </button>
    </div>

    <DataTable
      columns={columns}
      data={filteredVouchers}
      isLoading={isLoading}
    //   onEdit={handleEditClick}
      onDelete={handleDelete}
      onView={(item) => {
        setViewingVoucher(item);
        setIsViewModalOpen(true);
      }}
      title={t("vouchers")}
    />

    <VoucherModal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setEditingVoucher(null);
      }}
      onSubmit={handleSubmit}
      initialData={editingVoucher}
      isLoading={isAdding || isUpdating}
    />

    <VoucherViewModal
      isOpen={isViewModalOpen}
      onClose={() => setIsViewModalOpen(false)}
      voucher={viewingVoucher}
    />
  </div>
);
};

export default Voucher;
