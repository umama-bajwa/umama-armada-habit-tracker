import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/AppLayout';
import { PageHeader } from '../components/PageHeader';
import { User, Mail, LogOut, Loader2 } from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate('/login', { replace: true });
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <AppLayout>
      <div className="profile-page max-w-3xl mx-auto animate-fade-in flex flex-col gap-8">
        <PageHeader
          title="Profile"
          subtitle="Manage your personal account details."
        />

        {/* Card 1: User Card Header */}
        <div className="profile-hero-card glass-panel mb-8">
          <div className="profile-avatar-large">{userInitial}</div>
          <div className="profile-hero-info">
            <h2 className="profile-hero-name">{user?.name || 'Armada User'}</h2>
            <p className="profile-hero-email">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        {/* Card 2: Personal Information Section */}
        <div className="detail-card glass-panel mb-8">
          <h3 className="section-title mb-4">Personal Information</h3>

          <div className="info-rows-group">
            <div className="info-row">
              <div className="info-label-group">
                <User size={18} className="info-icon" />
                <span className="info-label">Full Name</span>
              </div>
              <span className="info-val">{user?.name || 'Not provided'}</span>
            </div>

            <div className="info-row">
              <div className="info-label-group">
                <Mail size={18} className="info-icon" />
                <span className="info-label">Email Address</span>
              </div>
              <span className="info-val">{user?.email || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Account & Security Section */}
        <div className="detail-card glass-panel mb-8">
          <h3 className="section-title mb-4">Account</h3>

          <div className="account-actions-group">
            <div className="account-row">
              <div>
                <h4 className="account-row-title">Sign Out</h4>
                <p className="account-row-sub">
                  Securely end your current session on this device.
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
        </div>
      </div>
    </AppLayout>
  );
};

