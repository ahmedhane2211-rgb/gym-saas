/**
 * Recursively extract text from a React element or node
 * @param {*} node 
 * @returns {string}
 */
const extractText = (node) => {
    if (node === null || node === undefined) return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (typeof node === 'boolean') return String(node);
    
    if (Array.isArray(node)) {
        return node.map(extractText).join(' ').replace(/\s+/g, ' ').trim();
    }
    
    if (typeof node === 'object') {
        if (node.props) {
            if (node.props.children !== undefined) {
                return extractText(node.props.children);
            }
        }
    }
    return '';
};

/**
 * Export data to CSV
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Column definitions { header, key, render }
 * @param {string} fileName - Name of the file
 * @param {Function} t - Translation function
 */
export const exportToCSV = (data, columns, fileName = 'export', t = (key) => key) => {
    if (!data || data.length === 0) return;

    // Filter out actions column
    const exportColumns = columns.filter(col => col.header !== 'actions');

    // Create Headers (translated)
    const headers = exportColumns.map(col => {
        const headerText = t(col.header) || col.header;
        return `"${String(headerText).replace(/"/g, '""')}"`;
    }).join(',');

    // Create Rows
    const rows = data.map(item => {
        return exportColumns.map(col => {
            let val = '';
            if (typeof col.render === 'function') {
                try {
                    const node = col.render(item);
                    val = extractText(node);
                } catch (e) {
                    val = item[col.key] || '';
                }
            } else {
                val = item[col.key] || '';
            }
            
            // Clean value for CSV
            const cleanVal = String(val).replace(/"/g, '""');
            return `"${cleanVal}"`;
        }).join(',');
    });

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


