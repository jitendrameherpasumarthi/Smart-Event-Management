import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search events, participants, tasks...",
  onClear,
  className = ""
}) => {
  return (
    <div className={`search-box ${className}`} style={{ position: 'relative' }}>
      <FiSearch className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          style={{
            position: 'absolute',
            right: '0.85rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem'
          }}
          title="Clear search"
        >
          <FiX />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
