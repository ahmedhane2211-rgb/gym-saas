import React, { useContext, useState, useEffect } from 'react';
import { useGetProductsQuery } from '../services/ProductSlice';
import { useGetUsersQuery } from '../../users/userSlice';
import { useAddInvoiceMutation } from '../services/InvoiceSlice';
import { useForm, useWatch } from 'react-hook-form';
import { 
    User, 
    Package, 
    Plus, 
    Trash2, 
    Calculator, 
    Receipt, 
    ShoppingBag, 
    Tag, 
    DollarSign,
    Percent,
    ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { LanguageContext } from '../../shared/context/LanguageContext';
import Select from '../../shared/components/Select';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';

const SalesInvoice = () => {
    const { t } = useContext(LanguageContext);
    const { data: usersResponse } = useGetUsersQuery();
    const { data: productsResponse } = useGetProductsQuery();
    const [addInvoice, { isLoading: isSubmitting }] = useAddInvoiceMutation();
    
    const { register, handleSubmit, setValue, getValues, watch, reset, control, formState: { errors } } = useForm({
        defaultValues: {
            userId: '',
            overallDiscount: 0,
            currentProductId: '',
            currentQuantity: 1,
            currentTax: 0,
            currentDiscountPercent: 0
        }
    });

    const [items, setItems] = useState([]);
    
    // Watch relevant values for totals calculation
    const watchedItems = useWatch({ control, name: 'items' }) || items; // fallback to state
    const watchedOverallDiscount = watch('overallDiscount');
    const currentProductId = watch('currentProductId');

    const users = Array.isArray(usersResponse) ? usersResponse : (usersResponse?.data || []);
    const products = Array.isArray(productsResponse) ? productsResponse : (productsResponse?.data || []);

    // Effect to update price when product changes
    useEffect(() => {
        const product = products.find(p => p.id === currentProductId);
        if (product) {
            setValue('currentPrice', product.price || 0);
        } else {
            setValue('currentPrice', 0);
        }
    }, [currentProductId, products, setValue]);

    const addItem = () => {
        const formData = getValues();
        const { currentProductId, currentQuantity, currentTax, currentDiscountPercent } = formData;
        
        if (!currentProductId) {
            toast.error(t('select_product') || 'Please select a product');
            return;
        }

        const product = products.find(p => p.id === currentProductId);
        const price = product?.price || 0;
        const name = product?.name || '';

        const existingItemIndex = items.findIndex(item => item.productId === currentProductId);

        if (existingItemIndex > -1) {
            const updatedItems = [...items];
            const existingItem = updatedItems[existingItemIndex];
            const newQuantity = existingItem.quantity + (parseInt(currentQuantity) || 0);

            const subtotal = existingItem.price * newQuantity;
            const discountAmount = subtotal * (existingItem.discountPercent / 100);
            const afterDiscount = subtotal - discountAmount;
            const taxAmount = afterDiscount * (existingItem.tax / 100);
            const itemTotal = afterDiscount + taxAmount;

            updatedItems[existingItemIndex] = {
                ...existingItem,
                quantity: newQuantity,
                total: itemTotal
            };
            setItems(updatedItems);
        } else {
            const qty = parseInt(currentQuantity) || 0;
            const tax = parseFloat(currentTax) || 0;
            const discPercent = parseFloat(currentDiscountPercent) || 0;
            
            const subtotal = price * qty;
            const discountAmount = subtotal * (discPercent / 100);
            const afterDiscount = subtotal - discountAmount;
            const taxAmount = afterDiscount * (tax / 100);
            const itemTotal = afterDiscount + taxAmount;

            setItems([...items, { 
                productId: currentProductId, 
                name, 
                price, 
                quantity: qty, 
                tax, 
                discountPercent: discPercent,
                discountValue: discountAmount,
                total: itemTotal 
            }]);
        }
        
        // Reset current item fields
        setValue('currentProductId', '');
        setValue('currentQuantity', 1);
        setValue('currentDiscountPercent', 0);
        setValue('currentTax', 0);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotals = () => {
        const total = items.reduce((acc, item) => acc + item.total, 0);
        const finalTotal = total - (parseFloat(watchedOverallDiscount) || 0);
        return { total, finalTotal };
    };

    const { total, finalTotal } = calculateTotals();

    const onSubmitInvoice = async (formData) => {
        if (items.length === 0) {
            toast.error(t('add_items_first') || 'Please add items to the invoice');
            return;
        }

        const payload = {
            userId: formData.userId,
            items: items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                discount: item.discountValue,
                total: item.total
            })),
            total,
            discount: parseFloat(formData.overallDiscount) || 0,
            finalTotal,
            status: 'completed'
        };

        try {
            await addInvoice(payload).unwrap();
            toast.success(t('invoice_created') || 'Invoice created successfully!');
            setItems([]);
            reset();
        } catch (err) {
            toast.error(err.data?.message || 'Failed to create invoice');
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue/10 rounded-2xl text-blue">
                            <Receipt size={28} />
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-widest italic uppercase">{t('sales_invoice')}</h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-500 text-xs font-bold uppercase tracking-widest max-w-md leading-relaxed ml-1">
                        {t('create_new_invoice_desc') || 'Generate professional sales receipts for gym products and merchandise.'}
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <div className="glass-card p-6 min-w-[200px] flex flex-col justify-between h-32 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity translate-x-2 -translate-y-2">
                            <Calculator size={64} className="text-blue" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{t('invoice_total') || 'Invoice Total'}</p>
                        <p className="text-4xl font-black text-blue">{finalTotal.toLocaleString()} <span className="text-xs">EGP</span></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Invoice Form Area */}
                <div className="xl:col-span-3 space-y-8">
                    
                    {/* Customer Selection Card */}
                    <div className="glass-card p-8 border-l-4 border-l-blue relative z-30">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-2 bg-blue/5 rounded-lg text-blue">
                                <User size={20} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white italic">{t('customer_details') || 'Customer Details'}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">                                
                                <Select
                                    label="select_user"
                                    name="userId"
                                    register={register}
                                    setValue={setValue}
                                    watch={watch}
                                    errors={errors}
                                    options={[
                                        ...users.map(user => ({
                                            value: user.id,
                                            label: user.full_name || user.username
                                        }))
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Items Entry Area */}
                    <div className="glass-card p-8 relative z-20">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-2 bg-orange/5 rounded-lg text-orange">
                                <Package size={20} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white italic">{t('invoice_items') || 'Invoice Items'}</h3>
                        </div>

                        {/* Add Item Row */}
                        <div className="bg-gray-50/50 dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 mb-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 items-end">
                                <div className="lg:col-span-2">
                                    <Select 
                                        label="product"
                                        name="currentProductId"
                                        register={register}
                                        setValue={setValue}
                                        watch={watch}
                                        errors={errors}
                                        placeholder="select_product"
                                        options={products.map(p => ({
                                            value: p.id,
                                            label: `${p.name} (${p.price} EGP)`
                                        }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('price')}</label>
                                    <input 
                                        type="number" 
                                        readOnly 
                                        {...register('currentPrice')}
                                        className="w-full bg-white dark:bg-black border border-gray-100 dark:border-white/10 rounded-xl p-3 text-xs text-gray-400 outline-none" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('quantity')}</label>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        {...register('currentQuantity')}
                                        className="w-full bg-white dark:bg-black border border-gray-100 dark:border-white/10 rounded-xl p-3 text-xs text-blue font-bold outline-none" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('tax')} %</label>
                                    <input 
                                        type="number" 
                                        {...register('currentTax')}
                                        className="w-full bg-white dark:bg-black border border-gray-100 dark:border-white/10 rounded-xl p-3 text-xs outline-none" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('discount')} %</label>
                                    <input 
                                        type="number" 
                                        {...register('currentDiscountPercent')}
                                        className="w-full bg-white dark:bg-black border border-gray-100 dark:border-white/10 rounded-xl p-3 text-xs outline-none" 
                                    />
                                </div>
                                <button 
                                    type="button"
                                    onClick={addItem}
                                    className="p-3 bg-blue hover:bg-blue/90 text-black rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95 h-[46px]"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="overflow-x-auto rounded-3xl border border-gray-100 dark:border-white/5">
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-50 dark:bg-white/5">
                                    <tr>
                                        <th className="p-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('product')}</th>
                                        <th className="p-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('price')}</th>
                                        <th className="p-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('quantity')}</th>
                                        <th className="p-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('discount')}</th>
                                        <th className="p-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('total')}</th>
                                        <th className="p-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-12 text-center text-gray-400 italic text-xs uppercase tracking-widest">
                                                {t('no_items_yet') || 'No items added yet'}
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((item, index) => (
                                            <tr key={index} className="border-t border-gray-100 dark:border-white/5 hover:bg-blue/5 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-blue/10 flex items-center justify-center text-blue">
                                                            <ShoppingBag size={14} />
                                                        </div>
                                                        <span className="text-xs font-black text-gray-900 dark:text-white uppercase italic">{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center text-xs font-bold text-gray-500">{item.price} EGP</td>
                                                <td className="p-4 text-center">
                                                    <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-lg text-xs font-black text-gray-900 dark:text-white">{item.quantity}</span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="inline-flex items-center gap-1 text-[10px] font-black text-orange uppercase tracking-tighter">
                                                        <Tag size={10} />
                                                        {item.discountPercent > 0 ? `${item.discountPercent}%` : `${item.discountValue} EGP`}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center text-xs font-black text-blue tracking-tight italic">
                                                    {item.total.toFixed(2)} EGP
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => removeItem(index)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Summary */}
                <div className="space-y-8">
                    <div className="glass-card p-8 sticky top-8">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-2 bg-blue/5 rounded-lg text-blue">
                                < Calculator size={20} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white italic">{t('summary')}</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                                <span className="text-[10px] font-black uppercase tracking-widest">{t('subtotal') || 'Subtotal'}</span>
                                <span className="text-sm font-black italic">{total.toLocaleString()} EGP</span>
                            </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('overall_discount') || 'Overall Discount'} (EGP)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        {...register('overallDiscount')}
                                        className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/5 rounded-xl p-4 text-gray-900 dark:text-white text-xs font-bold font-main outline-none focus:border-blue/50"
                                    />
                                    <div className="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 text-orange">
                                        <Tag size={14} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                                <div className="flex justify-between items-center mb-10">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue italic">{t('final_total') || 'Grand Total'}</span>
                                    <span className="text-3xl font-black text-gray-900 dark:text-white italic">{finalTotal.toLocaleString()}</span>
                                </div>

                                <button 
                                    onClick={handleSubmit(onSubmitInvoice)}
                                    disabled={isSubmitting}
                                    className="w-full py-6 bg-gradient-to-r from-blue to-blue/80 hover:from-blue/90 hover:to-blue text-black font-black uppercase italic tracking-[0.3em] rounded-[2rem] shadow-xl shadow-blue/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden group relative"
                                >
                                    <span className="relative z-10">{isSubmitting ? t('processing') : t('confirm_invoice')}</span>
                                    <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesInvoice;
