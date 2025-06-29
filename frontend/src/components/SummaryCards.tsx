// src/components/SummaryCards.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/SummaryCards.css';
import { FaArrowUp, FaArrowDown, FaPiggyBank, FaWallet } from 'react-icons/fa';

const SummaryCards = () => {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    totalSavings: 0,
    balance: 0
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/summary', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (res.data && typeof res.data.totalRevenue === 'number') {
          const { totalRevenue, totalExpenses, totalSavings } = res.data;
          setSummary({
            totalRevenue,
            totalExpenses,
            totalSavings,
            balance: totalRevenue - totalExpenses,
          });
        } else {
          console.warn('Summary API returned invalid data:', res.data);
        }
      } catch (err) {
        console.error('Failed to fetch summary', err);
      }
    };

    if (token) fetchSummary();
  }, [token]);

  return (
    <div className="summary-cards">
      <div className="card income">
        <div className="icon"><FaArrowUp /></div>
        <div className="label">Revenue</div>
        <div className="value">₹ {summary.totalRevenue}</div>
      </div>
      <div className="card expense">
        <div className="icon"><FaArrowDown /></div>
        <div className="label">Expenses</div>
        <div className="value">₹ {summary.totalExpenses}</div>
      </div>
      <div className="card savings">
        <div className="icon"><FaPiggyBank /></div>
        <div className="label">Savings</div>
        <div className="value">₹ {summary.totalSavings}</div>
      </div>
      <div className="card balance">
        <div className="icon"><FaWallet /></div>
        <div className="label">Balance</div>
        <div className="value">₹ {summary.balance}</div>
      </div>
    </div>
  );
};

export default SummaryCards;