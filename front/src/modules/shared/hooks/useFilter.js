import { useMemo } from 'react';

/**
 * Custom hook to filter data based on a search term and specified fields.
 * 
 * @param {Array} data - The array of items to filter.
 * @param {string} searchTerm - The search string to filter by.
 * @param {Array} searchFields - Array of fields to search in. 
 *                               Can be a string (supports nested keys like 'user.name') 
 *                               or a function that returns the value to search for.
 * @returns {Array} - The filtered data.
 */
const useFilter = (data, searchTerm, searchFields = []) => {
  return useMemo(() => {
    const items = data || [];
    if (!searchTerm || !searchTerm.trim()) return items;
    
    const search = searchTerm.toLowerCase();

    return items.filter((item) => {
      return searchFields.some((field) => {
        let value;
        if (typeof field === 'function') {
          value = field(item);
        } else {
          // Support nested fields like 'user.full_name'
          value = field.split('.').reduce((obj, key) => obj?.[key], item);
        }
        
        // If the value is an array, check if any element matches (optional, but good for robustness)
        if (Array.isArray(value)) {
          return value.some(v => String(v || '').toLowerCase().includes(search));
        }

        return String(value || '').toLowerCase().includes(search);
      });
    });
  }, [data, searchTerm, searchFields]);
};

export default useFilter;
