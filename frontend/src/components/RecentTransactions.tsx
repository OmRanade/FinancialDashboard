import { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/RecentTransactions.css';

interface Transaction {
  _id: string;
  date: string;
  amount: number;
  category: string;
  status: string;
  user_profile: string;
}

const RecentTransactions = ({ refresh }: { refresh: number }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/transactions?page=1&limit=5&sortBy=date&order=desc', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.data?.transactions) {
          setTransactions(res.data.transactions);
        }
      } catch (error) {
        console.error('Failed to fetch recent transactions', error);
      }
    };

    if (token) fetchTransactions();
  }, [token, refresh]);

  return (
    <div className="recent-transactions">
      <h3>Recent Transactions</h3>
      <ul>
        {transactions.map(tx => (
          <li key={tx._id} className={`transaction-card ${tx.category.toLowerCase()}`}>
            <div className="tx-details">
              <span className="tx-category">{tx.category}</span>
              <span className="tx-date">{new Date(tx.date).toLocaleDateString()}</span>
            </div>
            <div className="tx-meta">
              <span className="tx-amount">₹ {tx.amount}</span>
              <span className={`tx-status ${tx.status.toLowerCase()}`}>{tx.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;
