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
import Footer from './Footer';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // 🔁 added
  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1); // 🔁 added

  return (
    <div className={`dashboard-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-main">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="dashboard-content">
          <div id='summary'>
            <SummaryCards refresh={refreshTrigger} /> {/* 🔁 */}
          </div>
          <div className="contianer-gp-rt" id='analytics_and_transactions'>
            <GraphAnalytics refresh={refreshTrigger} /> {/* 🔁 */}
            <RecentTransactions refresh={refreshTrigger} /> {/* 🔁 */}
          </div>
          <div id="table">
            <TransactionManager onTransactionChange={triggerRefresh} /> {/* 🔁 */}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
