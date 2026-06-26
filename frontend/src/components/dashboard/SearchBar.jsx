import React from 'react';

/**
 * SearchBar Component
 * Renders a responsive, controlled search input field with an inline search icon
 * and a clear button.
 *
 * @param {Object} props
 * @param {string} props.searchTerm - Current search input value
 * @param {Function} props.setSearchTerm - Callback to update the search term state
 */
const SearchBar = ({ 
  searchTerm = '', 
  setSearchTerm 
}) => {
  const handleClear = () => {
    if (setSearchTerm) {
      setSearchTerm('');
    }
  };

  return (
    <div className="relative w-full">
      {/* Search Icon Indicator */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg 
          className="h-5 w-5 text-slate-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>

      {/* Controlled Input Field */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
        placeholder="Search tasks by title..."
        className="block w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-surface-container-low border border-slate-200 dark:border-outline-variant rounded-lg text-slate-900 dark:text-on-surface placeholder-slate-400 dark:placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-surface hover:border-slate-300 dark:hover:border-outline transition-all duration-200"
      />

      {/* Clear Text Action Button (Visible only when search term has content) */}
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none transition-colors duration-150"
          title="Clear search"
        >
          <svg 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2.5"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
