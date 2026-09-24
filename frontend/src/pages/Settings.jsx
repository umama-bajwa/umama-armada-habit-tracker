import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/AppLayout';
import { PageHeader } from '../components/PageHeader';
import {
  Bell,
  LogOut,
  Info,
  Shield,
  Loader2,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { addToast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Local UI settings
  const [dailyReminders, setDailyReminders] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate('/login', { replace: true });
  };

  const handleToggleReminder = (setter, val, name) => {
    setter(!val);
    addToast(`${name} preference updated locally.`, 'info');
  };

  return (
    <AppLayout>
      <div className="settings-page max-w-3xl mx-auto animate-fade-in flex flex-col gap-8">
        <PageHeader
          title="Settings"
          subtitle="Manage your app preferences."
        />

        {/* Card 1: Notifications Section */}
        <div className="detail-card glass-panel mb-8">
          <div className="section-title-row mb-3">
            <Bell size={18} className="text-cyan" />
            <h3 className="section-title">Notifications</h3>
          </div>
          <p className="setting-description mb-4">
            Manage your daily habit reminder preferences.
          </p>

          <div className="setting-rows-group">
            <div className="setting-toggle-row">
              <div>
                <h4 className="setting-row-title">Daily Habit Reminders</h4>
                <p className="setting-row-subtitle">
                  Receive gentle morning notifications for pending habits.
                </p>
              </div>
              <label className="custom-switch-toggle">
                <input
                  type="checkbox"
                  checked={dailyReminders}
                  onChange={() =>
                    handleToggleReminder(
                      setDailyReminders,
                      dailyReminders,
                      'Daily reminders'
                    )
                  }
                />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div className="setting-toggle-row">
              <div>
                <h4 className="setting-row-title">Streak Milestone Alerts</h4>
                <p className="setting-row-subtitle">
                  Get notified when you hit new streak achievements.
                </p>
              </div>
              <label className="custom-switch-toggle">
                <input
                  type="checkbox"
                  checked={streakAlerts}
                  onChange={() =>
                    handleToggleReminder(
                      setStreakAlerts,
                      streakAlerts,
                      'Streak alerts'
                    )
                  }
                />
                <span className="switch-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Card 2: Account Section */}
        <div className="detail-card glass-panel mb-8">
          <div className="section-title-row mb-3">
            <Shield size={18} className="text-violet" />
            <h3 className="section-title">Account</h3>
          </div>

          <div className="account-row">
            <div>
              <h4 className="account-row-title">Sign Out</h4>
              <p className="account-row-sub">
                End your authenticated JWT session.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="btn btn-logout"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 size={16} className="spinner-icon" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut size={16} />
                  <span>Logout</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 3: About Section */}
        <div className="detail-card glass-panel about-card mb-8">
          <div className="section-title-row mb-2">
            <Info size={18} className="text-emerald" />
            <h3 className="section-title">About</h3>
          </div>
          <h4 className="about-app-name">Armada Habit Tracker</h4>
          <p className="about-app-tagline">
            "Build better habits, one day at a time."
          </p>
          <div className="about-meta mt-3">
            <span>Version 1.0.0</span> • <span>Laravel JWT API Connected</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

