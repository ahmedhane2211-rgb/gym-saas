import React, { useState, useEffect, useContext, forwardRef, useRef, useImperativeHandle } from 'react';
import { Search, X } from 'lucide-react';
import useDebounce from '../hooks/useDebounce';
import { LanguageContext } from '../context/LanguageContext';

const SearchFilter = forwardRef(({ onSearch, placeholder, initialValue = '', onKeyDown, autoFocus = false }, ref) => {
  const { t } = useContext(LanguageContext);
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    clear: () => setSearchTerm(''),
    focus: () => {
        if (inputRef.current) inputRef.current.focus();
    },
    get value() {
        return searchTerm;
    }
  }));

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="relative group w-full md:w-96">
      <div className="absolute inset-y-0 ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange transition-colors">
        <Search size={18} />
      </div>
      
      <input
        ref={inputRef}
        type="text"
        autoFocus={autoFocus}
        placeholder={placeholder || t('search_placeholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-full bg-gray-50 dark:bg-gray-dark/30 border border-gray-200 dark:border-white/5 rounded-xl py-4 ltr:pl-12 ltr:pr-10 rtl:pr-12 rtl:pl-10 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-orange/20 focus:ring-4 focus:ring-orange/5 transition-all placeholder:text-gray-400 font-medium font-main"
      />

      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-500/10"
          title={t('clear')}
        >
          <X size={14} />
        </button>
      )}

      {/* Decorative focus border */}
      <div className="absolute inset-0 rounded-xl border border-orange/0 group-focus-within:border-orange/20 pointer-events-none transition-all duration-300" />
    </div>
  );
});

SearchFilter.displayName = 'SearchFilter';

export default SearchFilter;

