import { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionFilters from './TransactionFilters';
import './styles/TransactionManager.css';
import ExportCsvButton from './ExportCsvButton';

interface Transaction {
  _id?: string;
  date: string;
  amount: number;
  category: string;
  status: string;
  user_profile: string;
}

const TransactionManager = ({ onTransactionChange }: { onTransactionChange: () => void }) => { // ✅ added prop
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formData, setFormData] = useState<Transaction>({
    date: '',
    amount: 0,
    category: '',
    status: '',
    user_profile: '',
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortOption, setSortOption] = useState('');

  const [pendingSearch, setPendingSearch] = useState('');
  const [pendingCategory, setPendingCategory] = useState('');
  const [pendingStatus, setPendingStatus] = useState('');
  const [pendingSort, setPendingSort] = useState('');

  const token = localStorage.getItem('token');

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (filterCategory) params.append('category', filterCategory);
    if (filterStatus) params.append('status', filterStatus);
    if (sortOption) params.append('sort', sortOption);
    return params.toString();
  };

  const fetchTransactions = async () => {
    if (!token) return;
    try {
      const queryString = buildQueryParams();
      const res = await axios.get(`http://localhost:5000/api/dashboard/transactions?${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.transactions) {
        const validTransactions = res.data.transactions.filter(
          (tx: Transaction | null) => !!tx && !!tx.date
        );
        setTransactions(validTransactions);
        setHasMore(validTransactions.length > 0);
      } else {
        setTransactions([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setMessage({ type: 'error', text: 'Unauthorized. Please login again.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch transactions.' });
      }
      setTransactions([]);
      setHasMore(false);
    }
  };

  useEffect(() => {
    if (token) fetchTransactions();
  }, [token, page, searchQuery, filterCategory, filterStatus, sortOption]);

  const resetForm = () => {
    setFormData({ date: '', amount: 0, category: '', status: '', user_profile: '' });
    setEditId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token) return;

      if (editId) {
        const res = await axios.put(
          `http://localhost:5000/api/dashboard/transactions/${editId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTransactions((prev) =>
          prev.map((tx) => (tx._id === editId ? res.data : tx))
        );
        setMessage({ type: 'success', text: 'Transaction updated successfully.' });
      } else {
        const res = await axios.post('http://localhost:5000/api/dashboard/transactions', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions((prev) => [res.data, ...prev]);
        setMessage({ type: 'success', text: 'Transaction added successfully.' });
      }

      resetForm();
      onTransactionChange(); // ✅ Refresh dashboard components
    } catch (err) {
      console.error('Error submitting transaction:', err);
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = (tx: Transaction) => {
    setEditId(tx._id || null);
    setFormData({
      date: tx.date ? tx.date.split('T')[0] : '',
      amount: tx.amount,
      category: tx.category,
      status: tx.status,
      user_profile: tx.user_profile,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      if (!token) return;

      await axios.delete(`http://localhost:5000/api/dashboard/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
      setMessage({ type: 'success', text: 'Transaction deleted.' });
      resetForm();
      onTransactionChange(); // ✅ Refresh dashboard components
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setMessage({ type: 'error', text: 'Failed to delete transaction.' });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const handleClearFilters = () => {
    setPendingSearch('');
    setPendingCategory('');
    setPendingStatus('');
    setPendingSort('');

    setSearchQuery('');
    setFilterCategory('');
    setFilterStatus('');
    setSortOption('');
    setPage(1);
  };

  const handleApplyFilters = () => {
    setSearchQuery(pendingSearch);
    setFilterCategory(pendingCategory);
    setFilterStatus(pendingStatus);
    setSortOption(pendingSort);
    setPage(1);
  };

  if (!token) {
    return (
      <div className="transaction-manager">
        <p>Please log in to view transactions.</p>
      </div>
    );
  }

  return (
    <div className="transaction-manager">
      <h2>Transaction Manager</h2>
      
      {message && <div className={`form-message ${message.type}`}>{message.text}</div>}

      <form className="transaction-form" onSubmit={handleSubmit}>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
        />
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Revenue">Revenue</option>
          <option value="Expense">Expense</option>
        </select>
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="">Select Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
        <input
          type="text"
          name="user_profile"
          value={formData.user_profile}
          onChange={handleChange}
          placeholder="User Profile"
          required
        />
        <button type="submit">{editId ? 'Update' : 'Add'} Transaction</button>
      </form>

      <div className="transaction-list">
        <div className="transaction-header">
          <div>Date</div>
          <div>Amount</div>
          <div>Category</div>
          <div>Status</div>
          <div>User Profile</div>
          <div>Actions</div>
        </div>

        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          transactions.map((tx) => (
            <div className="transaction-item" key={tx._id}>
              <div>{new Date(tx.date).toLocaleDateString()}</div>
              <div>{tx.amount}</div>
              <div>{tx.category}</div>
              <div>{tx.status}</div>
              <div>{tx.user_profile}</div>
              <div className="actions">
                <button type="button" onClick={() => handleEdit(tx)} title="Edit">
                  ✏️
                </button>
                <button type="button" onClick={() => tx._id && handleDelete(tx._id)} title="Delete">
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <TransactionFilters
        searchQuery={pendingSearch}
        onSearchChange={setPendingSearch}
        category={pendingCategory}
        onCategoryChange={setPendingCategory}
        status={pendingStatus}
        onStatusChange={setPendingStatus}
        sort={pendingSort}
        onSortChange={setPendingSort}
        onClearFilters={handleClearFilters}
        onApplyFilters={handleApplyFilters}
      />

      <div className="pagination-controls">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
        <span>Page {page}</span>
        <button disabled={!hasMore} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>

      <div className="exportCSV">
        <ExportCsvButton
          searchQuery={searchQuery}
          filterCategory={filterCategory}
          filterStatus={filterStatus}
          sortOption={sortOption}
        />
      </div>
    </div>
  );
};

export default TransactionManager;
