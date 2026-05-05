import React, { useContext } from 'react';
import { X, ShoppingBag, Palette, Ruler, Hash, DollarSign, Box } from 'lucide-react';
import { LanguageContext } from '../../shared/context/LanguageContext';
import DetailItem from '../../shared/components/DetailItem';

const ProductViewModal = ({ isOpen, onClose, product }) => {
    const { t } = useContext(LanguageContext);

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header Banner */}
                <div className="h-32 bg-gradient-to-r from-blue to-purple relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 ltr:right-6 rtl:left-6 p-2 bg-white/20 hover:bg-white/40 text-white rounded-xl backdrop-blur-md transition-all"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute -bottom-10 ltr:left-10 rtl:right-10 w-24 h-24 rounded-2xl bg-white dark:bg-gray-dark border-4 border-white dark:border-gray-dark overflow-hidden flex items-center justify-center shadow-2xl text-blue">
                        {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <Box size={32} />
                        )}
                    </div>
                </div>

                <div className="p-10 pt-16 space-y-8">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">{product.name}</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('product_details') || 'Inventory Product Details'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <DetailItem icon={<Palette size={16} />} label={t('color')} value={product.color || 'N/A'} />
                        <DetailItem icon={<Ruler size={16} />} label={t('size')} value={product.size || 'N/A'} />
                        <DetailItem icon={<Hash size={16} />} label={t('quantity')} value={product.quantity || '0'} />
                        <DetailItem icon={<DollarSign size={16} />} label={t('purchase_price')} value={`${product.purchase_price || 0} EGP`} />
                        <DetailItem icon={<DollarSign size={16} />} label={t('price')} value={`${product.price} EGP`} />
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                        <button 
                            onClick={onClose}
                            className="w-full py-5 bg-gradient-to-r from-blue to-purple text-white font-black text-[12px] uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-[1.02] transition-all"
                        >
                            {t('close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductViewModal;
