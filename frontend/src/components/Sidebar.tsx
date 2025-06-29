// src/components/Sidebar.tsx
import './styles/Sidebar.css';
import {
  FaClipboardList,
  FaExchangeAlt,
  FaFileCsv,
  FaClock,
  FaSignOutAlt,
  FaChartLine,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const navigate = useNavigate();

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onClose(); // close sidebar on mobile
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'mobile-show' : ''}`}>
      <div className="logo">
        J<span>Penta</span>
      </div>
      <ul className="menu">
        <li onClick={() => scrollToId('summary')}>
          <FaClipboardList /> Summary
        </li>
        <li onClick={() => scrollToId('table')}>
          <FaExchangeAlt /> Transactions
        </li>
        <li onClick={() => scrollToId('analytics_and_transactions')}>
          <FaChartLine /> Analytics
        </li>
        <li onClick={() => scrollToId('table')}>
          <FaFileCsv /> Export CSV
        </li>
        <li onClick={() => scrollToId('analytics_and_transactions')}>
          <FaClock/> Recent Transactions
        </li>
        <li onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
