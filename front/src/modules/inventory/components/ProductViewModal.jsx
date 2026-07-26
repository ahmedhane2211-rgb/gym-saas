import React, { useContext } from "react";
import { Palette, Ruler, Hash, DollarSign, Box } from "lucide-react";
import { LanguageContext } from "../../shared/context/LanguageContext";
import DetailItem from "../../shared/components/DetailItem";
import AppModal from "../../shared/components/AppModal";

const ProductViewModal = ({ isOpen, onClose, product }) => {
  const { t } = useContext(LanguageContext);

  if (!isOpen || !product) return null;

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-xl"
      showCloseFooter
      closeText={t("close")}
      headerContent={<div />}
    >
      <div className="h-32 bg-gradient-to-r from-blue to-purple relative">
        <div className="absolute -bottom-10 ltr:left-10 rtl:right-10 w-24 h-24 rounded-2xl bg-white dark:bg-gray-dark border-4 border-white dark:border-gray-dark overflow-hidden flex items-center justify-center shadow-2xl text-blue">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Box size={32} />
          )}
        </div>
      </div>

      <div className="pt-16 space-y-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase  tracking-tighter">
            {product.name}
          </h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {t("product_details") || "Inventory Product Details"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <DetailItem
            icon={<Palette size={16} />}
            label={t("color")}
            value={product.color || "N/A"}
          />
          <DetailItem
            icon={<Ruler size={16} />}
            label={t("size")}
            value={product.size || "N/A"}
          />
          <DetailItem
            icon={<Hash size={16} />}
            label={t("quantity")}
            value={product.quantity || "0"}
          />
          <DetailItem
            icon={<DollarSign size={16} />}
            label={t("purchase_price")}
            value={`${product.purchase_price || 0} EGP`}
          />
          <DetailItem
            icon={<DollarSign size={16} />}
            label={t("price")}
            value={`${product.price} EGP`}
          />
        </div>
      </div>
    </AppModal>
  );
};

export default ProductViewModal;
