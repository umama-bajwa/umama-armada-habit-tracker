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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MobileNavigation = () => {
  const { user } = useAuth();
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Habits', path: '/habits', icon: CheckSquare },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="mobile-top-header">
        <Link to="/dashboard" className="mobile-brand-link">
          <div className="brand-logo-icon sm">
            <Zap size={16} />
          </div>
          <span className="brand-title">ARMADA</span>
        </Link>

        <div className="mobile-header-actions">
          <Link to="/habits/new" className="mobile-add-btn" title="Add Habit">
            <Plus size={18} />
          </Link>
          <Link to="/profile" className="avatar-circle sm">
            {userInitial}
          </Link>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `mobile-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={20} className="mobile-nav-icon" />
              <span className="mobile-nav-label">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};
