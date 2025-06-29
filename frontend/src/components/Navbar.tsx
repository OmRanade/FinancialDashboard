// src/components/Navbar.tsx
import './styles/Navbar.css';

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onMenuClick}>☰</button>
        <h2 className="navbar-title">Dashboard</h2>
      </div>
      <div className="navbar-right">
        <span className="notification">🔔</span>
        <span className="user-avatar">👤</span>
      </div>
    </nav>
  );
};

export default Navbar;
