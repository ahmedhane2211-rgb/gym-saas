import React, { useContext, useState, cloneElement } from "react";
import {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../services/ProductSlice";
import { ShoppingBag, Plus, Activity, Package } from "lucide-react";
import toast from "react-hot-toast";
import { LanguageContext } from "../../shared/context/LanguageContext";
import ProductModal from "../components/ProductModal";
import ProductViewModal from "../components/ProductViewModal";
import DataTable from "../../shared/components/DataTable";
import SearchFilter from "../../shared/components/SearchFilter";
import useFilter from "../../shared/hooks/useFilter";
import Button from "../../shared/components/Button";
import StatsCard from "../../shared/components/StatsCard";
import SectionTitle from "../../shared/components/SectionTitle";

const Product = () => {
  const { t } = useContext(LanguageContext);
  const { data: response, isLoading } = useGetProductsQuery();
  const products = Array.isArray(response) ? response : response?.data || [];

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useFilter(products, searchTerm, [
    "name",
    "color",
    "size",
  ]);

  const handleSubmit = async (data) => {
    const formData = new FormData();

    // Append all form fields to FormData
    Object.keys(data).forEach((key) => {
      if (key === "image") {
        if (data[key] && data[key].length > 0) {
          formData.append("image", data[key][0]);
        }
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, body: formData }).unwrap();
        toast.success(t("update_success"));
      } else {
        await addProduct(formData).unwrap();
        toast.success(t("add_success"));
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("confirm_delete"))) {
      try {
        await deleteProduct(id).unwrap();
        toast.success(t("delete_success"));
      } catch (err) {
        toast.error(err.data?.message || "Delete failed");
      }
    }
  };

  const columns = [
    {
      header: "product_name",
      render: (p) => (
        <div className="flex items-center gap-4 text-gray-900 dark:text-white font-black text-sm uppercase tracking-tight ">
          <div className="w-12 h-12 rounded-xl bg-blue/10 text-blue overflow-hidden flex items-center justify-center shrink-0">
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ShoppingBag size={18} />
            )}
          </div>
          <div>
            <p>{p.name}</p>
            <p className="text-[10px] text-gray-400 not- font-bold tracking-widest">
              {p.color} - {p.size}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "purchase_price",
      render: (p) => (
        <div className="flex items-baseline gap-1 text-gray-400 dark:text-gray-500 font-black">
          <span className="text-lg">{p.purchase_price || 0}</span>
          <span className="text-[10px] uppercase tracking-widest">EGP</span>
        </div>
      ),
    },
    {
      header: "price",
      render: (p) => (
        <div className="flex items-baseline gap-1 text-gray-900 dark:text-white font-black">
          <span className="text-lg">{p.price}</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest">
            EGP
          </span>
        </div>
      ),
    },
    {
      header: "quantity",
      render: (p) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${p.quantity > 5 ? "bg-blue/5 border-blue/10 text-blue" : "bg-orange/10 border-orange/20 text-orange"}`}
          >
            {p.quantity} {t("in_stock") || "In Stock"}
          </span>
        </div>
      ),
    },
  ];

  const stats = [
    {
      label: t("total_products") || "Total Products",
      value: products?.length || 0,
      icon: <Package className="text-blue" />,
      color: "blue",
    },
    {
      label: t("low_stock") || "Low Stock",
      value: products?.filter((p) => p.quantity <= 5).length || 0,
      icon: <Activity className="text-orange" />,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <SectionTitle title="products" description="manage_products_desc" t={t} />

        <div className="flex gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card p-6 min-w-[200px] flex flex-col justify-between h-32 relative overflow-hidden group"
            >
              <StatsCard stat={stat} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <SearchFilter
          onSearch={setSearchTerm}
          placeholder={t("search_products")}
        />
        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="btn-orange h-14 px-8 shadow-lg !w-auto"
          title={t("add_new")}
          icon={<Plus size={18} />}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredProducts}
        isLoading={isLoading}
        onEdit={(item) => {
          setEditingProduct(item);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
        onView={(item) => {
          setViewingProduct(item);
          setIsViewModalOpen(true);
        }}
        title={t("products")}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingProduct}
        isLoading={isAdding || isUpdating}
        title={editingProduct ? "update_product" : "add_product"}
      />

      <ProductViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        product={viewingProduct}
      />
    </div>
  );
};

export default Product;
