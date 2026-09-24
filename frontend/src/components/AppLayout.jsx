import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';

export const AppLayout = ({ children }) => {
  return (
    <div className="app-shell-container">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Top & Bottom Navigation */}
      <MobileNavigation />

      {/* Main Content Viewport */}
      <div className="app-main-viewport">
        <main className="app-main-content">
          {children}
        </main>
      </div>
    </div>
  );
};
