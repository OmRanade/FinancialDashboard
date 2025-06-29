import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import './styles/GraphAnalytics.css';

interface TransactionRaw {
  date: string;
  amount: number;
  category: string;
  status: string;
}

interface TransactionGrouped {
  date: string;
  revenue: number;
  expense: number;
}

const GraphAnalytics = ({ refresh }: { refresh: number }) => {
  const [data, setData] = useState<TransactionGrouped[]>([]);
  const [filter, setFilter] = useState('monthly');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending'>('All');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          'http://localhost:5000/api/dashboard/transactions?sortBy=date&order=asc&limit=100',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const txns: TransactionRaw[] = res.data.transactions || [];

        const filtered = txns.filter((txn) => {
          return statusFilter === 'All' || txn.status === statusFilter;
        });

        const grouped: { [key: string]: TransactionGrouped } = {};

        filtered.forEach((txn) => {
          const dateObj = new Date(txn.date);
          let label = '';

          if (filter === 'monthly') {
            label = dateObj.toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            });
          } else if (filter === 'yearly') {
            label = dateObj.getFullYear().toString();
          } else {
            label = dateObj.toLocaleDateString('en-US', {
              weekday: 'short',
              day: '2-digit',
            });
          }

          if (!grouped[label]) {
            grouped[label] = { date: label, revenue: 0, expense: 0 };
          }

          if (txn.category === 'Revenue') {
            grouped[label].revenue += txn.amount;
          } else if (txn.category === 'Expense') {
            grouped[label].expense += txn.amount;
          }
        });

        const finalData = Object.values(grouped);
        setData(finalData);
      } catch (err) {
        console.error('Failed to fetch transactions for graph:', err);
      }
    };

    fetchTransactions();
  }, [filter, statusFilter, refresh]);

  return (
    <div className="graph-analytics">
      <div className="graph-header">
        <h3>Revenue vs Expense</h3>
        <div className="graph-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="weekly">Weekly</option>
          </select>
          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Paid' | 'Pending')}
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>
      <div className="chart-scroll-wrapper">
        <ResponsiveContainer width={data.length * 80} height={400}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#27ae60" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#27ae60" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eb5757" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#eb5757" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#27ae60" fillOpacity={1} fill="url(#colorRev)" />
            <Area type="monotone" dataKey="expense" stroke="#eb5757" fillOpacity={1} fill="url(#colorExp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraphAnalytics;
