// src/components/Dashboard.tsx
import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './styles/Dashboard.css';
import './styles/Navbar.css';
import './styles/Sidebar.css';
import SummaryCards from './SummaryCards';
import RecentTransactions from './RecentTransactions';
import GraphAnalytics from './GraphAnalytics';
import TransactionManager from './TransactionManager';
import Footer from './Footer'; // ✅ New import

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`dashboard-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-main">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="dashboard-content">
          <div id='summary'>
            <SummaryCards />
          </div>
          <div className="contianer-gp-rt" id='analytics_and_transactions'>
            <GraphAnalytics />
            <RecentTransactions />
          </div>
          <div id="table">
            <TransactionManager /> 
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
