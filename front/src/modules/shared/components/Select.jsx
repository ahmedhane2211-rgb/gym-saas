import React, { useContext, useState, useRef, useEffect } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { ChevronDown, Search, Check } from 'lucide-react';

const Select = ({ label, options = [], register, name, errors, placeholder, setValue, watch }) => {
    const { t } = useContext(LanguageContext);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    // Use watch to get the current value for UI display purposes only
    const currentValue = watch ? watch(name) : '';
    const selectedOption = options.find(opt => String(opt.value) === String(currentValue));

    // Handle clicking outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        // Update the form value manually to sync with hidden input
        if (setValue) {
            setValue(name, val, { shouldValidate: true });
        }
        setIsOpen(false);
        setSearchTerm('');
    };

    const filteredOptions = options.filter(option => 
        option.label?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`space-y-2 relative ${isOpen ? 'z-[120]' : 'z-10'}`} ref={dropdownRef}>
            {label && (
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-light/50 tracking-[0.2em] uppercase px-1">
                    {t(label)}
                </label>
            )}
            
            {/* Hidden Input linked to register */}
            <input type="hidden" {...register(name)} />
            
            {/* Display Button */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full min-h-14 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:border-blue/30 ${isOpen ? 'border-blue/50 ring-2 ring-blue/5' : ''}`}
            >
                <span className={`text-xs font-bold ${selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-light/40'}`}>
                    {selectedOption ? selectedOption.label : (t(placeholder) || t('select_option') || 'Select...')}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-[110] left-0 right-0 top-full mt-2 bg-white dark:bg-gray-dark border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                    {/* Search Area */}
                    <div className="p-3 border-b border-gray-100 dark:border-white/5 sticky top-0 bg-white dark:bg-gray-dark z-10">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input 
                                autoFocus
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('search_placeholder') || 'Search...'}
                                className="w-full bg-gray-50 dark:bg-white/5 rounded-lg py-2 pl-9 pr-3 text-xs text-gray-900 dark:text-white focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-[240px] overflow-y-auto no-scrollbar py-2">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div 
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`px-4 py-3 text-xs font-medium cursor-pointer flex items-center justify-between transition-colors hover:bg-blue/5 dark:hover:bg-white/5 ${String(currentValue) === String(option.value) ? 'bg-blue/5 dark:bg-white/5 text-blue' : 'text-gray-600 dark:text-gray-400'}`}
                                >
                                    <span>{option.label}</span>
                                    {String(currentValue) === String(option.value) && <Check size={14} className="text-blue" />}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-center text-xs text-gray-400 italic">
                                {t('no_results') || 'No results found'}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {errors && errors[name] && (
                <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mt-1.5 px-1 animate-in slide-in-from-top-1">
                    {errors[name].message}
                </p>
            )}
        </div>
    );
};

export default Select;
