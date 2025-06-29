// src/components/ExportCsvButton.tsx
import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles/ExportCsvButton.module.css';

interface Transaction {
  _id?: string;
  date: string;
  amount: number;
  category: string;
  status: string;
  user_profile: string;
}

interface ExportCsvButtonProps {
  searchQuery: string;
  filterCategory: string;
  filterStatus: string;
  sortOption: string;
}

const ExportCsvButton: React.FC<ExportCsvButtonProps> = ({
  searchQuery,
  filterCategory,
  filterStatus,
  sortOption,
}) => {
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);

  const fetchAllTransactions = async (): Promise<Transaction[]> => {
    if (!token) return [];
    let allTransactions: Transaction[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (filterCategory) params.append('category', filterCategory);
      if (filterStatus) params.append('status', filterStatus);
      if (sortOption) params.append('sort', sortOption);

      try {
        const res = await axios.get(
          `http://localhost:5000/api/dashboard/transactions?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const transactions: Transaction[] = res.data.transactions || [];
        if (transactions.length === 0) {
          hasMore = false;
        } else {
          allTransactions = allTransactions.concat(transactions);
          page++;
        }
      } catch (error) {
        console.error('Error fetching transactions for CSV export:', error);
        hasMore = false;
      }
    }

    return allTransactions;
  };

  const convertToCSV = (transactions: Transaction[]) => {
    const headers = ['Date', 'Amount', 'Category', 'Status', 'User Profile'];
    const rows = transactions.map((tx) => [
      new Date(tx.date).toLocaleDateString(),
      tx.amount.toString(),
      tx.category,
      tx.status,
      tx.user_profile,
    ]);

    const csvContent =
      [headers, ...rows]
        .map((e) => e.map((v) => `"${v.replace(/"/g, '""')}"`).join(','))
        .join('\n') + '\n';

    return csvContent;
  };

  const handleExportClick = async () => {
    if (loading) return;
    setLoading(true);
    const transactions = await fetchAllTransactions();

    if (transactions.length === 0) {
      alert('No transactions found to export.');
      setLoading(false);
      return;
    }

    const csv = convertToCSV(transactions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleExportClick}
      className={styles.exportButton}
      disabled={loading}
    >
      {loading ? 'Exporting...' : 'Export CSV'}
    </button>
  );
};

export default ExportCsvButton;
