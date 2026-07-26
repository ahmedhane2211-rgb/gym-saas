import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ShoppingBag,
  Palette,
  Ruler,
  Hash,
  DollarSign,
  Image as ImageIcon,
  Upload,
  Trash2,
} from "lucide-react";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import { LanguageContext } from "../../shared/context/LanguageContext";
import AppModal from "../../shared/components/AppModal";

const ProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  title,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const { t } = useContext(LanguageContext);
  const [imagePreview, setImagePreview] = useState(null);

  const selectedImage = watch("image");

  useEffect(() => {
    if (selectedImage && selectedImage.length > 0) {
      const file = selectedImage[0];
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [selectedImage]);

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        color: initialData.color || "",
        size: initialData.size || "",
        quantity: initialData.quantity || "",
        price: initialData.price || "",
        purchasePrice: initialData.purchase_price || "",
      });
      setImagePreview(initialData.image || null);
    } else {
      reset({
        name: "",
        color: "",
        size: "",
        quantity: "",
        price: "",
        purchasePrice: "",
        image: null,
      });
      setImagePreview(null);
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title={t(title) || title} maxWidth="max-w-xl">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase self-start">
              {t("product_image") || "Product Image"}
            </label>
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-black transition-all group-hover:border-blue/50">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 dark:text-gray-600">
                    <ImageIcon size={32} strokeWidth={1} />
                    <span className="text-[8px] font-black uppercase mt-2">
                      {t("no_image") || "No Image"}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label className="cursor-pointer p-2 bg-blue rounded-lg text-black hover:bg-blue/90 transition-colors">
                    <Upload size={16} />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      {...register("image")}
                    />
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setValue("image", null);
                      }}
                      className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Input
              label="product_name"
              placeholder="Ex: T-Shirt, Water Bottle"
              name="name"
              register={register}
              errors={errors}
              validation={{ required: "Required" }}
            />
            <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
              <ShoppingBag size={18} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative">
              <Input
                label="color"
                placeholder="Red, Black..."
                name="color"
                register={register}
                errors={errors}
              />
              <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
                <Palette size={18} />
              </div>
            </div>
            <div className="relative">
              <Input
                label="size"
                placeholder="L, XL, 500ml..."
                name="size"
                register={register}
                errors={errors}
              />
              <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
                <Ruler size={18} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="relative">
              <Input
                label="quantity"
                type="number"
                placeholder="0"
                name="quantity"
                register={register}
                errors={errors}
                validation={{ required: "Required" }}
              />
              <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
                <Hash size={18} />
              </div>
            </div>
            <div className="relative">
              <Input
                label="purchase_price"
                type="number"
                placeholder="0.00"
                name="purchasePrice"
                register={register}
                errors={errors}
                validation={{ required: "Required" }}
              />
              <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
                <DollarSign size={18} />
              </div>
            </div>
            <div className="relative">
              <Input
                label="price"
                type="number"
                placeholder="0.00"
                name="price"
                register={register}
                errors={errors}
                validation={{ required: "Required" }}
              />
              <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400">
                <DollarSign size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <Button
            title={
              isLoading
                ? "Processing..."
                : initialData
                  ? t("update")
                  : t("add")
            }
            className="w-full bg-blue hover:bg-blue/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-lg"
          />
          <Button
            onClick={onClose}
            title={t("cancel")}
            className="w-full text-gray-500 font-black text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors"
          />
        </div>
      </form>
    </AppModal>
  );
};

export default ProductModal;
