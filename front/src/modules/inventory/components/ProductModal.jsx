import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, ShoppingBag, Palette, Ruler, Hash, DollarSign, Image as ImageIcon, Upload, Trash2 } from 'lucide-react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { LanguageContext } from '../../shared/context/LanguageContext';

const ProductModal = ({ isOpen, onClose, onSubmit, initialData, isLoading, title }) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const { t } = useContext(LanguageContext);
  const [imagePreview, setImagePreview] = useState(null);

  const selectedImage = watch('image');

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
        name: initialData.name || '',
        color: initialData.color || '',
        size: initialData.size || '',
        quantity: initialData.quantity || '',
        price: initialData.price || '',
        purchasePrice: initialData.purchase_price || ''
      });
      setImagePreview(initialData.image || null);
    } else {
      reset({
        name: '',
        color: '',
        size: '',
        quantity: '',
        price: '',
        purchasePrice: '',
        image: null
      });
      setImagePreview(null);
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-widest">{t(title) || title}</h2>
            <div className="w-12 h-1 bg-blue rounded-full" />
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-blue transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-8 pt-4 space-y-6">
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase self-start">
                {t('product_image') || 'Product Image'}
              </label>
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-black transition-all group-hover:border-blue/50">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 dark:text-gray-600">
                      <ImageIcon size={32} strokeWidth={1} />
                      <span className="text-[8px] font-black uppercase mt-2">{t('no_image') || 'No Image'}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="cursor-pointer p-2 bg-blue rounded-lg text-black hover:bg-blue/90 transition-colors">
                      <Upload size={16} />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        {...register('image')}
                      />
                    </label>
                    {imagePreview && (
                      <button 
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setValue('image', null);
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

            {/* Name */}
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
                {/* Color */}
                <div className="relative">
                    <Input label="color" placeholder="Red, Black..." name="color" register={register} errors={errors} />
                    <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400"><Palette size={18} /></div>
                </div>
                {/* Size */}
                <div className="relative">
                    <Input label="size" placeholder="L, XL, 500ml..." name="size" register={register} errors={errors} />
                    <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400"><Ruler size={18} /></div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Quantity */}
                <div className="relative">
                    <Input label="quantity" type="number" placeholder="0" name="quantity" register={register} errors={errors} validation={{ required: "Required" }} />
                    <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400"><Hash size={18} /></div>
                </div>
                {/* Purchase Price */}
                <div className="relative">
                    <Input label="purchase_price" type="number" placeholder="0.00" name="purchasePrice" register={register} errors={errors} validation={{ required: "Required" }} />
                    <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400"><DollarSign size={18} /></div>
                </div>
                {/* Price */}
                <div className="relative">
                    <Input label="price" type="number" placeholder="0.00" name="price" register={register} errors={errors} validation={{ required: "Required" }} />
                    <div className="absolute top-9 ltr:right-4 rtl:left-4 text-gray-400"><DollarSign size={18} /></div>
                </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col gap-4 pt-4">
            <Button 
                title={isLoading ? 'Processing...' : (initialData ? t('update') : t('add'))}
                className="w-full bg-blue hover:bg-blue/90 text-black font-black py-5 rounded-xl tracking-[0.2em] shadow-lg"
            />
            <Button onClick={onClose} title={t('cancel')} className="w-full text-gray-500 font-black text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
