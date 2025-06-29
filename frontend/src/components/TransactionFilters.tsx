import React from 'react';
import './styles/TransactionFilters.css';

interface TransactionFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  onClearFilters,
  onApplyFilters,
}) => {
  return (
    <div className="transaction-filters-wrapper">
      <h2 className="filters-heading">Filter & Sort Transactions</h2>
      <div className="transaction-filters">
        <input
          type="text"
          placeholder="Search by User Profile"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="filter-input"
        />

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          <option value="Revenue">Revenue</option>
          <option value="Expense">Expense</option>
        </select>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Sort By</option>
          <option value="date_asc">Date ↑</option>
          <option value="date_desc">Date ↓</option>
          <option value="amount_asc">Amount ↑</option>
          <option value="amount_desc">Amount ↓</option>
        </select>
      </div>

      <div className="filter-buttons">
        <button className="apply-filters-btn" onClick={onApplyFilters} type="button">
          Apply Filters
        </button>
        <button className="clear-filters-btn" onClick={onClearFilters} type="button">
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default TransactionFilters;
