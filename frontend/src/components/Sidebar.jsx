import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  TrendingUp,
  User,
  Settings,
  Plus,
  Zap,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Habits', path: '/habits', icon: CheckSquare },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-container">
        <Link to="/dashboard" className="sidebar-brand-link">
          <div className="brand-logo-icon">
            <Zap className="logo-spark" size={20} />
          </div>
          <span className="brand-title">ARMADA</span>
        </Link>
      </div>

      {/* Primary Action Button */}
      <div className="sidebar-action-container">
        <Link to="/habits/new" className="btn btn-primary sidebar-add-btn">
          <Plus size={18} />
          <span>Add Habit</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="sidebar-menu-label">MENU</div>
        <ul className="sidebar-menu-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={18} className="nav-icon" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Footer Card */}
      <div className="sidebar-footer-user">
        <Link to="/profile" className="user-profile-badge sidebar-user-badge">
          <div className="avatar-circle">{userInitial}</div>
          <div className="user-info-text">
            <span className="user-name">{user?.name || 'Armada User'}</span>
            <span className="user-email">{user?.email || 'user@example.com'}</span>
          </div>
        </Link>
        <button
          onClick={logout}
          className="sidebar-logout-btn"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
